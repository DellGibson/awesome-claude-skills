/**
 * Docker Compose Builder
 * Generates production-ready Docker Compose configurations from project descriptions
 */

class DockerComposeBuilder {
  constructor() {
    this.supportedLanguages = ['nodejs', 'python', 'go', 'rust'];
    this.supportedServices = ['postgres', 'mysql', 'mongodb', 'redis', 'nginx', 'rabbitmq', 'elasticsearch'];
  }

  /**
   * Main entry point - generates complete Docker setup
   */
  build(projectDescription, techStack, options = {}) {
    const services = this.generateServices(techStack, options);
    const dockerCompose = this.generateDockerCompose(services, options);
    const dockerfile = this.generateDockerfile(techStack, options);
    const dockerignore = this.generateDockerignore(techStack);
    const envExample = this.generateEnvExample(services, options);
    const commands = this.generateCommands();
    const documentation = this.generateDocumentation(services, options);

    return {
      dockerCompose,
      dockerfile,
      dockerignore,
      envExample,
      commands,
      services: services.map(s => ({
        name: s.name,
        image: s.image,
        ports: s.ports,
        volumes: s.volumes
      })),
      documentation
    };
  }

  /**
   * Generate service definitions
   */
  generateServices(techStack, options) {
    const services = [];

    // Add application service
    services.push(this.generateAppService(techStack, options));

    // Add additional services (databases, cache, etc.)
    if (options.services && Array.isArray(options.services)) {
      options.services.forEach(service => {
        services.push(this.generateAdditionalService(service, options));
      });
    }

    // Add Nginx if requested
    if (options.includeNginx) {
      services.push(this.generateNginxService(options));
    }

    return services;
  }

  /**
   * Generate application service configuration
   */
  generateAppService(techStack, options) {
    const language = techStack.language;
    const port = options.ports?.app || 3000;
    const env = options.environment || 'development';

    const service = {
      name: 'app',
      image: this.getBaseImage(language, techStack.version),
      build: env === 'development' ? 'development' : 'production',
      ports: [`${port}:${port}`],
      environment: this.generateAppEnvironment(techStack, options),
      volumes: env === 'development' ? this.getDevelopmentVolumes(language) : [],
      dependsOn: [],
      healthCheck: options.healthChecks ? this.getHealthCheck(language, port) : null
    };

    // Add dependencies on other services
    if (options.services) {
      options.services.forEach(s => {
        if (['postgres', 'mysql', 'mongodb', 'redis'].includes(s.name)) {
          service.dependsOn.push(this.mapServiceName(s.name));
        }
      });
    }

    return service;
  }

  /**
   * Generate additional service (database, cache, etc.)
   */
  generateAdditionalService(serviceConfig, options) {
    const serviceName = this.mapServiceName(serviceConfig.name);
    const version = serviceConfig.version || 'latest';

    switch (serviceConfig.name) {
      case 'postgres':
        return {
          name: serviceName,
          image: `postgres:${version}-alpine`,
          ports: [`${serviceConfig.port || 5432}:5432`],
          environment: {
            POSTGRES_USER: 'postgres',
            POSTGRES_PASSWORD: 'password',
            POSTGRES_DB: 'appdb'
          },
          volumes: options.volumes ? [`postgres_data:/var/lib/postgresql/data`] : [],
          healthCheck: options.healthChecks ? {
            test: 'pg_isready -U postgres',
            interval: '10s',
            timeout: '5s',
            retries: 5
          } : null
        };

      case 'mysql':
        return {
          name: serviceName,
          image: `mysql:${version}`,
          ports: [`${serviceConfig.port || 3306}:3306`],
          environment: {
            MYSQL_ROOT_PASSWORD: 'password',
            MYSQL_DATABASE: 'appdb',
            MYSQL_USER: 'user',
            MYSQL_PASSWORD: 'password'
          },
          volumes: options.volumes ? [`mysql_data:/var/lib/mysql`] : [],
          healthCheck: options.healthChecks ? {
            test: 'mysqladmin ping -h localhost -u root -ppassword',
            interval: '10s',
            timeout: '5s',
            retries: 5
          } : null
        };

      case 'mongodb':
        return {
          name: serviceName,
          image: `mongo:${version}`,
          ports: [`${serviceConfig.port || 27017}:27017`],
          environment: {
            MONGO_INITDB_ROOT_USERNAME: 'root',
            MONGO_INITDB_ROOT_PASSWORD: 'password',
            MONGO_INITDB_DATABASE: 'appdb'
          },
          volumes: options.volumes ? [`mongodb_data:/data/db`] : [],
          healthCheck: options.healthChecks ? {
            test: 'mongosh --eval "db.adminCommand(\'ping\')"',
            interval: '10s',
            timeout: '5s',
            retries: 5
          } : null
        };

      case 'redis':
        return {
          name: serviceName,
          image: `redis:${version}-alpine`,
          ports: [`${serviceConfig.port || 6379}:6379`],
          volumes: options.volumes ? [`redis_data:/data`] : [],
          healthCheck: options.healthChecks ? {
            test: 'redis-cli ping',
            interval: '10s',
            timeout: '3s',
            retries: 5
          } : null
        };

      case 'nginx':
        return this.generateNginxService(options);

      case 'rabbitmq':
        return {
          name: serviceName,
          image: `rabbitmq:${version}-management-alpine`,
          ports: [`${serviceConfig.port || 5672}:5672`, '15672:15672'],
          environment: {
            RABBITMQ_DEFAULT_USER: 'admin',
            RABBITMQ_DEFAULT_PASS: 'password'
          },
          volumes: options.volumes ? [`rabbitmq_data:/var/lib/rabbitmq`] : [],
          healthCheck: options.healthChecks ? {
            test: 'rabbitmq-diagnostics -q ping',
            interval: '30s',
            timeout: '10s',
            retries: 5
          } : null
        };

      case 'elasticsearch':
        return {
          name: serviceName,
          image: `elasticsearch:${version}`,
          ports: [`${serviceConfig.port || 9200}:9200`],
          environment: {
            'discovery.type': 'single-node',
            'ES_JAVA_OPTS': '-Xms512m -Xmx512m'
          },
          volumes: options.volumes ? [`elasticsearch_data:/usr/share/elasticsearch/data`] : [],
          healthCheck: options.healthChecks ? {
            test: 'curl -f http://localhost:9200/_cluster/health || exit 1',
            interval: '30s',
            timeout: '10s',
            retries: 5
          } : null
        };

      default:
        return null;
    }
  }

  /**
   * Generate Nginx reverse proxy service
   */
  generateNginxService(options) {
    return {
      name: 'nginx',
      image: 'nginx:alpine',
      ports: ['80:80', '443:443'],
      volumes: [
        './nginx.conf:/etc/nginx/nginx.conf:ro',
        './ssl:/etc/nginx/ssl:ro'
      ],
      dependsOn: ['app']
    };
  }

  /**
   * Generate docker-compose.yml content
   */
  generateDockerCompose(services, options) {
    const version = '3.8';
    let compose = `version: '${version}'\n\n`;
    compose += `services:\n`;

    // Generate each service
    services.forEach(service => {
      compose += this.generateServiceYaml(service, options);
    });

    // Add volumes section
    const volumesList = this.extractVolumes(services);
    if (volumesList.length > 0) {
      compose += `\nvolumes:\n`;
      volumesList.forEach(volume => {
        compose += `  ${volume}:\n`;
      });
    }

    // Add networks section
    compose += `\nnetworks:\n`;
    compose += `  app-network:\n`;
    compose += `    driver: bridge\n`;

    return compose;
  }

  /**
   * Generate YAML for a single service
   */
  generateServiceYaml(service, options) {
    let yaml = `  ${service.name}:\n`;

    // Build or image
    if (service.name === 'app') {
      yaml += `    build:\n`;
      yaml += `      context: .\n`;
      yaml += `      dockerfile: Dockerfile\n`;
      if (service.build) {
        yaml += `      target: ${service.build}\n`;
      }
    } else {
      yaml += `    image: ${service.image}\n`;
    }

    yaml += `    container_name: ${service.name}_container\n`;

    // Ports
    if (service.ports && service.ports.length > 0) {
      yaml += `    ports:\n`;
      service.ports.forEach(port => {
        yaml += `      - "${port}"\n`;
      });
    }

    // Environment
    if (service.environment) {
      yaml += `    environment:\n`;
      if (typeof service.environment === 'object') {
        Object.entries(service.environment).forEach(([key, value]) => {
          yaml += `      ${key}: ${value}\n`;
        });
      } else {
        service.environment.forEach(env => {
          yaml += `      - ${env}\n`;
        });
      }
    }

    // Volumes
    if (service.volumes && service.volumes.length > 0) {
      yaml += `    volumes:\n`;
      service.volumes.forEach(volume => {
        yaml += `      - ${volume}\n`;
      });
    }

    // Depends on
    if (service.dependsOn && service.dependsOn.length > 0) {
      yaml += `    depends_on:\n`;
      service.dependsOn.forEach(dep => {
        if (options.healthChecks) {
          yaml += `      ${dep}:\n`;
          yaml += `        condition: service_healthy\n`;
        } else {
          yaml += `      - ${dep}\n`;
        }
      });
    }

    // Health check
    if (service.healthCheck) {
      yaml += `    healthcheck:\n`;
      yaml += `      test: ["CMD-SHELL", "${service.healthCheck.test}"]\n`;
      yaml += `      interval: ${service.healthCheck.interval}\n`;
      yaml += `      timeout: ${service.healthCheck.timeout}\n`;
      yaml += `      retries: ${service.healthCheck.retries}\n`;
    }

    // Networks
    yaml += `    networks:\n`;
    yaml += `      - app-network\n`;

    yaml += `\n`;
    return yaml;
  }

  /**
   * Generate Dockerfile based on language and options
   */
  generateDockerfile(techStack, options) {
    const language = techStack.language;
    const version = techStack.version || 'latest';
    const multiStage = options.multiStage !== false;

    switch (language) {
      case 'nodejs':
        return this.generateNodeDockerfile(version, multiStage);
      case 'python':
        return this.generatePythonDockerfile(version, multiStage);
      case 'go':
        return this.generateGoDockerfile(version, multiStage);
      case 'rust':
        return this.generateRustDockerfile(version, multiStage);
      default:
        return this.generateNodeDockerfile(version, multiStage);
    }
  }

  /**
   * Generate Node.js Dockerfile
   */
  generateNodeDockerfile(version, multiStage) {
    if (!multiStage) {
      return `FROM node:${version}-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
`;
    }

    return `# Multi-stage build for Node.js application
FROM node:${version}-alpine AS base
WORKDIR /app
COPY package*.json ./

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production build stage
FROM base AS build
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:${version}-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
`;
  }

  /**
   * Generate Python Dockerfile
   */
  generatePythonDockerfile(version, multiStage) {
    if (!multiStage) {
      return `FROM python:${version}-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]
`;
    }

    return `# Multi-stage build for Python application
FROM python:${version}-slim AS base
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1

# Development stage
FROM base AS development
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir debugpy pytest
COPY . .
EXPOSE 8000
CMD ["python", "app.py"]

# Production build stage
FROM base AS build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# Production stage
FROM python:${version}-slim AS production
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PYTHONPATH=/app
COPY --from=build /usr/local/lib/python${version}/site-packages /usr/local/lib/python${version}/site-packages
COPY --from=build /app /app
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser
EXPOSE 8000
CMD ["python", "app.py"]
`;
  }

  /**
   * Generate Go Dockerfile
   */
  generateGoDockerfile(version, multiStage) {
    if (!multiStage) {
      return `FROM golang:${version}-alpine
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN go build -o main .
EXPOSE 8080
CMD ["./main"]
`;
    }

    return `# Multi-stage build for Go application
FROM golang:${version}-alpine AS builder
WORKDIR /app
COPY go.* ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Production stage
FROM alpine:latest AS production
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/main .
RUN adduser -D appuser && chown -R appuser:appuser /root
USER appuser
EXPOSE 8080
CMD ["./main"]
`;
  }

  /**
   * Generate Rust Dockerfile
   */
  generateRustDockerfile(version, multiStage) {
    if (!multiStage) {
      return `FROM rust:${version}-alpine
WORKDIR /app
COPY Cargo.* ./
RUN cargo build --release
COPY . .
EXPOSE 8080
CMD ["cargo", "run", "--release"]
`;
    }

    return `# Multi-stage build for Rust application
FROM rust:${version}-alpine AS builder
WORKDIR /app
RUN apk add --no-cache musl-dev
COPY Cargo.* ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src
COPY . .
RUN touch src/main.rs
RUN cargo build --release

# Production stage
FROM alpine:latest AS production
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/target/release/app .
RUN adduser -D appuser && chown -R appuser:appuser /root
USER appuser
EXPOSE 8080
CMD ["./app"]
`;
  }

  /**
   * Generate .dockerignore file
   */
  generateDockerignore(techStack) {
    const language = techStack.language;
    let ignore = `# Git files
.git
.gitignore
.gitattributes

# Documentation
README.md
*.md
docs/

# IDE
.vscode
.idea
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
logs/

# Testing
coverage/
.nyc_output/
`;

    switch (language) {
      case 'nodejs':
        ignore += `\n# Node.js
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
build/
`;
        break;
      case 'python':
        ignore += `\n# Python
__pycache__/
*.py[cod]
*$py.class
.pytest_cache/
venv/
env/
*.egg-info/
`;
        break;
      case 'go':
        ignore += `\n# Go
bin/
vendor/
*.exe
`;
        break;
      case 'rust':
        ignore += `\n# Rust
target/
Cargo.lock
`;
        break;
    }

    return ignore;
  }

  /**
   * Generate .env.example file
   */
  generateEnvExample(services, options) {
    let env = `# Application Configuration
NODE_ENV=development
PORT=3000

`;

    services.forEach(service => {
      if (service.name === 'db' || service.name.includes('postgres')) {
        env += `# PostgreSQL Configuration
DATABASE_URL=postgresql://postgres:password@db:5432/appdb
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=appdb

`;
      } else if (service.name.includes('mysql')) {
        env += `# MySQL Configuration
DATABASE_URL=mysql://user:password@mysql:3306/appdb
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=appdb
MYSQL_USER=user
MYSQL_PASSWORD=password

`;
      } else if (service.name.includes('mongodb')) {
        env += `# MongoDB Configuration
MONGODB_URI=mongodb://root:password@mongodb:27017/appdb?authSource=admin
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=password

`;
      } else if (service.name === 'cache' || service.name.includes('redis')) {
        env += `# Redis Configuration
REDIS_URL=redis://cache:6379

`;
      }
    });

    return env;
  }

  /**
   * Generate useful Docker commands
   */
  generateCommands() {
    return {
      build: 'docker-compose build',
      start: 'docker-compose up -d',
      stop: 'docker-compose down',
      restart: 'docker-compose restart',
      logs: 'docker-compose logs -f',
      shell: 'docker-compose exec app sh',
      ps: 'docker-compose ps',
      clean: 'docker-compose down -v'
    };
  }

  /**
   * Generate documentation for using the setup
   */
  generateDocumentation(services, options) {
    let doc = `# Docker Setup Documentation

## Services

`;

    services.forEach(service => {
      doc += `### ${service.name}\n`;
      doc += `- **Image**: ${service.image || 'Custom build'}\n`;
      if (service.ports && service.ports.length > 0) {
        doc += `- **Ports**: ${service.ports.join(', ')}\n`;
      }
      doc += `\n`;
    });

    doc += `## Quick Start

\`\`\`bash
# Build images
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access application shell
docker-compose exec app sh

# Stop all services
docker-compose down
\`\`\`

## Development Workflow

1. Make code changes in your editor
2. Changes are automatically reflected via volumes
3. Restart services if needed: \`docker-compose restart app\`

## Production Deployment

\`\`\`bash
# Build production images
docker-compose -f docker-compose.yml build --target production

# Start in production mode
docker-compose up -d
\`\`\`

## Troubleshooting

### View service logs
\`\`\`bash
docker-compose logs [service-name]
\`\`\`

### Rebuild from scratch
\`\`\`bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
\`\`\`

### Access database
\`\`\`bash
docker-compose exec db psql -U postgres -d appdb
\`\`\`
`;

    return doc;
  }

  /**
   * Helper: Get base Docker image for language
   */
  getBaseImage(language, version = 'latest') {
    const images = {
      nodejs: `node:${version}-alpine`,
      python: `python:${version}-slim`,
      go: `golang:${version}-alpine`,
      rust: `rust:${version}-alpine`
    };
    return images[language] || images.nodejs;
  }

  /**
   * Helper: Map service name to container name
   */
  mapServiceName(name) {
    const mapping = {
      postgres: 'db',
      mysql: 'mysql',
      mongodb: 'mongodb',
      redis: 'cache',
      nginx: 'nginx',
      rabbitmq: 'rabbitmq',
      elasticsearch: 'elasticsearch'
    };
    return mapping[name] || name;
  }

  /**
   * Helper: Get development volumes for language
   */
  getDevelopmentVolumes(language) {
    const volumes = ['.:/app'];

    if (language === 'nodejs') {
      volumes.push('/app/node_modules');
    } else if (language === 'python') {
      volumes.push('/app/__pycache__');
    }

    return volumes;
  }

  /**
   * Helper: Generate app environment variables
   */
  generateAppEnvironment(techStack, options) {
    const env = [];
    const language = techStack.language;

    if (language === 'nodejs') {
      env.push(`NODE_ENV=${options.environment || 'development'}`);
    } else if (language === 'python') {
      env.push(`PYTHONUNBUFFERED=1`);
    }

    // Add database URLs if services are configured
    if (options.services) {
      options.services.forEach(service => {
        if (service.name === 'postgres') {
          env.push('DATABASE_URL=postgresql://postgres:password@db:5432/appdb');
        } else if (service.name === 'mysql') {
          env.push('DATABASE_URL=mysql://user:password@mysql:3306/appdb');
        } else if (service.name === 'mongodb') {
          env.push('MONGODB_URI=mongodb://root:password@mongodb:27017/appdb?authSource=admin');
        } else if (service.name === 'redis') {
          env.push('REDIS_URL=redis://cache:6379');
        }
      });
    }

    return env;
  }

  /**
   * Helper: Get health check configuration
   */
  getHealthCheck(language, port) {
    const healthChecks = {
      nodejs: {
        test: `wget --no-verbose --tries=1 --spider http://localhost:${port}/health || exit 1`,
        interval: '30s',
        timeout: '10s',
        retries: 3
      },
      python: {
        test: `curl -f http://localhost:${port}/health || exit 1`,
        interval: '30s',
        timeout: '10s',
        retries: 3
      },
      go: {
        test: `wget --no-verbose --tries=1 --spider http://localhost:${port}/health || exit 1`,
        interval: '30s',
        timeout: '10s',
        retries: 3
      },
      rust: {
        test: `wget --no-verbose --tries=1 --spider http://localhost:${port}/health || exit 1`,
        interval: '30s',
        timeout: '10s',
        retries: 3
      }
    };

    return healthChecks[language] || healthChecks.nodejs;
  }

  /**
   * Helper: Extract volume names from services
   */
  extractVolumes(services) {
    const volumes = new Set();

    services.forEach(service => {
      if (service.volumes) {
        service.volumes.forEach(volume => {
          // Named volumes (not bind mounts)
          if (!volume.startsWith('.') && !volume.startsWith('/')) {
            const volumeName = volume.split(':')[0];
            volumes.add(volumeName);
          }
        });
      }
    });

    return Array.from(volumes);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DockerComposeBuilder;
}

// Demo usage
if (require.main === module) {
  const builder = new DockerComposeBuilder();

  const result = builder.build(
    'Express.js REST API with PostgreSQL and Redis',
    {
      language: 'nodejs',
      framework: 'express',
      version: '20'
    },
    {
      services: [
        { name: 'postgres', version: '15', port: 5432 },
        { name: 'redis', version: '7', port: 6379 }
      ],
      environment: 'development',
      ports: { app: 3000 },
      volumes: true,
      healthChecks: true,
      multiStage: true
    }
  );

  console.log('=== Generated Docker Compose ===');
  console.log(result.dockerCompose);
  console.log('\n=== Generated Dockerfile ===');
  console.log(result.dockerfile);
  console.log('\n=== Useful Commands ===');
  console.log(JSON.stringify(result.commands, null, 2));
}
