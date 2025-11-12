---
name: docker-compose-builder
description: Generates production-ready docker-compose.yml files from project descriptions with support for Node.js, Python, Go, and Rust stacks including Dockerfiles, volume configs, and networking
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - docker
  - containers
  - devops
  - infrastructure
  - deployment
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Docker Compose Builder

Automatically generate production-ready Docker Compose configurations from project descriptions. This skill creates complete Docker setups including docker-compose.yml, Dockerfiles, .dockerignore files, and volume configurations for Node.js, Python, Go, and Rust applications.

## What It Does

The Docker Compose Builder skill:

1. **Analyzes Requirements** - Understands your project stack and dependencies
2. **Generates docker-compose.yml** - Creates service definitions with proper networking
3. **Creates Dockerfiles** - Builds optimized, multi-stage Docker images
4. **Configures Volumes** - Sets up persistent data storage and bind mounts
5. **Networks Services** - Establishes container networking and service discovery
6. **Adds Health Checks** - Implements container health monitoring
7. **Includes .dockerignore** - Optimizes build context by excluding unnecessary files

## Key Features

- **Multi-Language Support**: Node.js, Python, Go, Rust with framework detection
- **Database Integration**: PostgreSQL, MySQL, MongoDB, Redis with proper networking
- **Environment Variables**: Secure configuration management with .env support
- **Development & Production**: Separate configs for different environments
- **Multi-Stage Builds**: Optimized Docker images with minimal size
- **Health Checks**: Automatic service health monitoring
- **Volume Management**: Persistent storage for databases and application data
- **Network Isolation**: Secure inter-service communication

## When to Use This Skill

Use the Docker Compose Builder when you need to:

- Containerize a new application quickly
- Set up local development environments
- Create reproducible deployment configurations
- Integrate multiple services (app + database + cache)
- Generate production-ready Docker setups
- Migrate from bare metal to containers
- Document infrastructure as code

## Supported Tech Stacks

### Application Languages
- **Node.js**: Express, NestJS, Next.js, with npm/yarn/pnpm
- **Python**: Flask, FastAPI, Django with pip/poetry/pipenv
- **Go**: Standard library, Gin, Echo with go modules
- **Rust**: Actix, Rocket, Axum with cargo

### Databases & Services
- **PostgreSQL**: With persistent volumes and initialization scripts
- **MySQL/MariaDB**: Configured with proper charset and collation
- **MongoDB**: With authentication and replica set options
- **Redis**: As cache or message broker
- **Nginx**: As reverse proxy or static file server

## Example Usage

### Input: Node.js + PostgreSQL Application

```
Project: Node.js Express API with PostgreSQL database
Tech Stack: Node.js 20, Express.js, PostgreSQL 15
Features: API server on port 3000, database with persistent storage, Redis cache
Environment: Development with hot reload
```

### Output: Generated Docker Compose Configuration

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: express_api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/appdb
      - REDIS_URL=redis://cache:6379
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_healthy
    networks:
      - app-network
    command: npm run dev

  db:
    image: postgres:15-alpine
    container_name: postgres_db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: appdb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network

  cache:
    image: redis:7-alpine
    container_name: redis_cache
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network

volumes:
  postgres_data:
  redis_data:

networks:
  app-network:
    driver: bridge
```

#### Dockerfile

```dockerfile
# Multi-stage build for Node.js application
FROM node:20-alpine AS base
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
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```

#### .dockerignore

```
node_modules
npm-debug.log
.env
.env.local
.git
.gitignore
README.md
.vscode
.idea
coverage
.DS_Store
*.log
```

## Output Components

The skill generates:

1. **docker-compose.yml** - Complete service orchestration
2. **Dockerfile** - Multi-stage optimized image builds
3. **.dockerignore** - Excludes unnecessary files from builds
4. **docker-compose.dev.yml** - Development-specific overrides
5. **docker-compose.prod.yml** - Production-specific configuration
6. **.env.example** - Template for environment variables
7. **README-DOCKER.md** - Usage instructions and commands

## Best Practices

### For Optimal Results

1. **Specify Versions**: Always pin exact versions of base images and dependencies
2. **Use Multi-Stage Builds**: Separate build and runtime environments
3. **Implement Health Checks**: Ensure services are ready before connecting
4. **Volume Management**: Use named volumes for databases, bind mounts for code
5. **Network Isolation**: Create dedicated networks for service groups
6. **Environment Variables**: Use .env files, never hardcode secrets
7. **Resource Limits**: Set memory and CPU constraints for production

### Security Recommendations

```yaml
# Run as non-root user
USER node

# Use read-only root filesystem
read_only: true

# Set resource limits
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

## Common Use Cases

### Full-Stack Application
```
App: React frontend + Node.js API + PostgreSQL
Services: nginx (reverse proxy), app (Node.js), db (Postgres)
Result: Complete stack with routing, API, and database
```

### Microservices Architecture
```
Services: auth-service, user-service, product-service, gateway
Database: PostgreSQL (shared), Redis (cache)
Result: Multi-service architecture with API gateway
```

### Data Processing Pipeline
```
App: Python data processor + MongoDB + Redis queue
Services: worker (Python), db (MongoDB), queue (Redis)
Result: Asynchronous task processing system
```

## Limitations

- **Complex Orchestration**: Very large microservices may need Kubernetes
- **Cloud-Specific Features**: Does not generate AWS ECS or GCP Cloud Run configs
- **Legacy Applications**: May need manual adjustments for older frameworks
- **Windows Containers**: Focuses on Linux containers only
- **GPU Support**: Does not automatically configure NVIDIA Docker

## Tips

- Use `docker-compose up -d` to start services in detached mode
- Run `docker-compose logs -f` to follow logs from all services
- Use `docker-compose exec <service> sh` to access container shell
- Combine with `.env` files for environment-specific configurations
- Test locally before deploying to production
- Use `docker-compose down -v` to remove volumes when resetting

## Related Skills

- **ci-cd-pipeline-generator**: Create CI/CD workflows for Docker builds
- **api-documentation-generator**: Document your containerized APIs
- **security-scanner**: Scan Docker images for vulnerabilities

## Installation

This skill is available for use in:
- Claude.ai web interface
- Claude Code (desktop application)
- Claude API integrations

No additional installation required - activate the skill and start generating Docker configurations!
