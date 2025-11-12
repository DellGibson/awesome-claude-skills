/**
 * Tests for Docker Compose Builder
 */

const DockerComposeBuilder = require('../src/index');

describe('DockerComposeBuilder', () => {
  let builder;

  beforeEach(() => {
    builder = new DockerComposeBuilder();
  });

  describe('constructor', () => {
    it('should initialize with supported languages', () => {
      expect(builder.supportedLanguages).toContain('nodejs');
      expect(builder.supportedLanguages).toContain('python');
      expect(builder.supportedLanguages).toContain('go');
      expect(builder.supportedLanguages).toContain('rust');
    });

    it('should initialize with supported services', () => {
      expect(builder.supportedServices).toContain('postgres');
      expect(builder.supportedServices).toContain('mysql');
      expect(builder.supportedServices).toContain('mongodb');
      expect(builder.supportedServices).toContain('redis');
    });
  });

  describe('build', () => {
    it('should generate complete Docker setup', () => {
      const result = builder.build(
        'Node.js API',
        { language: 'nodejs', version: '20' },
        { services: [{ name: 'postgres' }] }
      );

      expect(result).toHaveProperty('dockerCompose');
      expect(result).toHaveProperty('dockerfile');
      expect(result).toHaveProperty('dockerignore');
      expect(result).toHaveProperty('envExample');
      expect(result).toHaveProperty('commands');
      expect(result).toHaveProperty('services');
      expect(result).toHaveProperty('documentation');
    });

    it('should generate valid docker-compose.yml', () => {
      const result = builder.build(
        'Test App',
        { language: 'nodejs' },
        {}
      );

      expect(result.dockerCompose).toContain('version:');
      expect(result.dockerCompose).toContain('services:');
    });
  });

  describe('generateServices', () => {
    it('should generate app service', () => {
      const services = builder.generateServices(
        { language: 'nodejs' },
        {}
      );

      expect(services.length).toBeGreaterThan(0);
      expect(services.some(s => s.name === 'app')).toBe(true);
    });

    it('should add requested additional services', () => {
      const services = builder.generateServices(
        { language: 'nodejs' },
        { services: [{ name: 'postgres' }, { name: 'redis' }] }
      );

      expect(services.some(s => s.name === 'db')).toBe(true);
      expect(services.some(s => s.name === 'cache')).toBe(true);
    });

    it('should include nginx when requested', () => {
      const services = builder.generateServices(
        { language: 'nodejs' },
        { includeNginx: true }
      );

      expect(services.some(s => s.name === 'nginx')).toBe(true);
    });
  });

  describe('generateAppService', () => {
    it('should generate Node.js app service', () => {
      const service = builder.generateAppService(
        { language: 'nodejs', version: '20' },
        { ports: { app: 3000 } }
      );

      expect(service.name).toBe('app');
      expect(service.ports).toContain('3000:3000');
    });

    it('should include health checks when enabled', () => {
      const service = builder.generateAppService(
        { language: 'nodejs' },
        { healthChecks: true }
      );

      expect(service.healthCheck).toBeDefined();
    });

    it('should set dependencies on database services', () => {
      const service = builder.generateAppService(
        { language: 'nodejs' },
        { services: [{ name: 'postgres' }, { name: 'redis' }] }
      );

      expect(service.dependsOn.length).toBeGreaterThan(0);
    });
  });

  describe('generateAdditionalService', () => {
    it('should generate PostgreSQL service', () => {
      const service = builder.generateAdditionalService(
        { name: 'postgres', version: '15' },
        { volumes: true, healthChecks: true }
      );

      expect(service.name).toBe('db');
      expect(service.image).toContain('postgres:15');
      expect(service.environment.POSTGRES_USER).toBeDefined();
      expect(service.volumes.length).toBeGreaterThan(0);
      expect(service.healthCheck).toBeDefined();
    });

    it('should generate MySQL service', () => {
      const service = builder.generateAdditionalService(
        { name: 'mysql', version: '8' },
        {}
      );

      expect(service.name).toBe('mysql');
      expect(service.image).toContain('mysql:8');
      expect(service.environment.MYSQL_ROOT_PASSWORD).toBeDefined();
    });

    it('should generate MongoDB service', () => {
      const service = builder.generateAdditionalService(
        { name: 'mongodb', version: '6' },
        {}
      );

      expect(service.name).toBe('mongodb');
      expect(service.image).toContain('mongo:6');
      expect(service.environment.MONGO_INITDB_ROOT_USERNAME).toBeDefined();
    });

    it('should generate Redis service', () => {
      const service = builder.generateAdditionalService(
        { name: 'redis', version: '7' },
        {}
      );

      expect(service.name).toBe('cache');
      expect(service.image).toContain('redis:7');
    });

    it('should generate RabbitMQ service', () => {
      const service = builder.generateAdditionalService(
        { name: 'rabbitmq' },
        {}
      );

      expect(service.name).toBe('rabbitmq');
      expect(service.ports.length).toBeGreaterThan(1); // AMQP + Management
    });
  });

  describe('generateDockerCompose', () => {
    it('should generate valid YAML structure', () => {
      const services = [
        {
          name: 'app',
          image: 'node:20-alpine',
          ports: ['3000:3000'],
          environment: ['NODE_ENV=production'],
          volumes: [],
          dependsOn: []
        }
      ];

      const compose = builder.generateDockerCompose(services, {});

      expect(compose).toContain("version: '3.8'");
      expect(compose).toContain('services:');
      expect(compose).toContain('networks:');
    });

    it('should include volumes section for named volumes', () => {
      const services = [
        {
          name: 'db',
          image: 'postgres',
          volumes: ['postgres_data:/var/lib/postgresql/data']
        }
      ];

      const compose = builder.generateDockerCompose(services, {});

      expect(compose).toContain('volumes:');
      expect(compose).toContain('postgres_data:');
    });
  });

  describe('generateDockerfile', () => {
    it('should generate Node.js Dockerfile', () => {
      const dockerfile = builder.generateDockerfile(
        { language: 'nodejs', version: '20' },
        { multiStage: false }
      );

      expect(dockerfile).toContain('FROM node:20-alpine');
      expect(dockerfile).toContain('WORKDIR /app');
      expect(dockerfile).toContain('npm ci');
    });

    it('should generate multi-stage Node.js Dockerfile', () => {
      const dockerfile = builder.generateDockerfile(
        { language: 'nodejs', version: '20' },
        { multiStage: true }
      );

      expect(dockerfile).toContain('FROM node:20-alpine AS base');
      expect(dockerfile).toContain('FROM base AS development');
      expect(dockerfile).toContain('FROM node:20-alpine AS production');
    });

    it('should generate Python Dockerfile', () => {
      const dockerfile = builder.generateDockerfile(
        { language: 'python', version: '3.11' },
        {}
      );

      expect(dockerfile).toContain('FROM python:3.11');
      expect(dockerfile).toContain('pip install');
    });

    it('should generate Go Dockerfile', () => {
      const dockerfile = builder.generateDockerfile(
        { language: 'go', version: '1.21' },
        { multiStage: true }
      );

      expect(dockerfile).toContain('FROM golang:1.21');
      expect(dockerfile).toContain('go mod download');
      expect(dockerfile).toContain('go build');
    });

    it('should generate Rust Dockerfile', () => {
      const dockerfile = builder.generateDockerfile(
        { language: 'rust', version: '1.70' },
        {}
      );

      expect(dockerfile).toContain('FROM rust:1.70');
      expect(dockerfile).toContain('cargo build');
    });
  });

  describe('generateDockerignore', () => {
    it('should include common ignore patterns', () => {
      const dockerignore = builder.generateDockerignore({ language: 'nodejs' });

      expect(dockerignore).toContain('.git');
      expect(dockerignore).toContain('.env');
      expect(dockerignore).toContain('*.log');
    });

    it('should include Node.js specific patterns', () => {
      const dockerignore = builder.generateDockerignore({ language: 'nodejs' });

      expect(dockerignore).toContain('node_modules');
      expect(dockerignore).toContain('npm-debug.log');
    });

    it('should include Python specific patterns', () => {
      const dockerignore = builder.generateDockerignore({ language: 'python' });

      expect(dockerignore).toContain('__pycache__');
      expect(dockerignore).toContain('*.pyc');
      expect(dockerignore).toContain('venv');
    });

    it('should include Go specific patterns', () => {
      const dockerignore = builder.generateDockerignore({ language: 'go' });

      expect(dockerignore).toContain('vendor');
    });
  });

  describe('generateEnvExample', () => {
    it('should generate environment variables', () => {
      const services = [
        { name: 'db', image: 'postgres' }
      ];

      const env = builder.generateEnvExample(services, {});

      expect(env).toContain('PORT=');
      expect(env).toContain('DATABASE_URL');
    });

    it('should include PostgreSQL variables', () => {
      const services = [
        { name: 'db', image: 'postgres' }
      ];

      const env = builder.generateEnvExample(services, {});

      expect(env).toContain('POSTGRES_USER');
      expect(env).toContain('POSTGRES_PASSWORD');
    });

    it('should include Redis variables', () => {
      const services = [
        { name: 'cache', image: 'redis' }
      ];

      const env = builder.generateEnvExample(services, {});

      expect(env).toContain('REDIS_URL');
    });
  });

  describe('generateCommands', () => {
    it('should provide useful Docker commands', () => {
      const commands = builder.generateCommands();

      expect(commands.build).toBe('docker-compose build');
      expect(commands.start).toBe('docker-compose up -d');
      expect(commands.stop).toBe('docker-compose down');
      expect(commands.logs).toBe('docker-compose logs -f');
    });
  });

  describe('generateDocumentation', () => {
    it('should generate comprehensive documentation', () => {
      const services = [
        { name: 'app', image: 'node:20', ports: ['3000:3000'] }
      ];

      const doc = builder.generateDocumentation(services, {});

      expect(doc).toContain('# Docker Setup Documentation');
      expect(doc).toContain('## Services');
      expect(doc).toContain('## Quick Start');
      expect(doc).toContain('docker-compose build');
    });
  });

  describe('helper methods', () => {
    it('should get base image for language', () => {
      expect(builder.getBaseImage('nodejs', '20')).toBe('node:20-alpine');
      expect(builder.getBaseImage('python', '3.11')).toBe('python:3.11-slim');
      expect(builder.getBaseImage('go', '1.21')).toBe('golang:1.21-alpine');
    });

    it('should map service names correctly', () => {
      expect(builder.mapServiceName('postgres')).toBe('db');
      expect(builder.mapServiceName('redis')).toBe('cache');
      expect(builder.mapServiceName('nginx')).toBe('nginx');
    });

    it('should get development volumes', () => {
      const volumes = builder.getDevelopmentVolumes('nodejs');
      expect(volumes).toContain('.:/app');
      expect(volumes).toContain('/app/node_modules');
    });
  });

  describe('integration', () => {
    it('should build complete stack for Node.js app', () => {
      const result = builder.build(
        'Express API with PostgreSQL and Redis',
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

      expect(result.services.length).toBe(3); // app, db, cache
      expect(result.dockerCompose).toContain('db:');
      expect(result.dockerCompose).toContain('cache:');
      expect(result.dockerfile).toContain('multi-stage');
      expect(result.commands.build).toBeDefined();
      expect(result.documentation).toContain('PostgreSQL');
      expect(result.envExample).toContain('DATABASE_URL');
    });
  });
});
