# Docker Compose Builder

Generate production-ready Docker Compose configurations automatically from project descriptions. Creates complete Docker setups including docker-compose.yml, Dockerfiles, volume configs, and networking for Node.js, Python, Go, and Rust applications.

## Features

- **Multi-Language Support**: Node.js, Python, Go, Rust with framework detection
- **Service Integration**: PostgreSQL, MySQL, MongoDB, Redis, Nginx, RabbitMQ, Elasticsearch
- **Multi-Stage Builds**: Optimized Docker images with separate dev/prod stages
- **Health Checks**: Automatic service health monitoring
- **Volume Management**: Persistent storage and development bind mounts
- **Network Configuration**: Secure inter-service communication
- **Environment Management**: .env file generation with secure defaults

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `docker-compose-builder` skill
4. Claude will automatically use this skill when you need Docker configurations

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `docker-compose-builder`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["docker-compose-builder"],
    messages=[{
        "role": "user",
        "content": "Generate Docker Compose for Express.js app with PostgreSQL"
    }]
)
```

## Usage

### Basic Example

Ask Claude:
> "Create a Docker Compose setup for my Node.js Express API with PostgreSQL database and Redis cache"

### Output

Claude will generate:

1. **docker-compose.yml** - Complete orchestration configuration
2. **Dockerfile** - Optimized multi-stage build
3. **.dockerignore** - Build optimization
4. **.env.example** - Environment variable template
5. **Documentation** - Setup and usage instructions

### Advanced Usage

You can specify:

- **Language**: nodejs, python, go, rust
- **Services**: postgres, mysql, mongodb, redis, nginx
- **Environment**: development, production, or both
- **Ports**: Custom port mappings
- **Features**: Health checks, volumes, multi-stage builds

Example prompt:
> "Generate Docker Compose for Python FastAPI application using:
> - Python 3.11
> - PostgreSQL 15 with persistent storage
> - Redis 7 for caching
> - Development environment with hot reload
> - Include health checks"

## Best Practices

### Pin Versions

Always specify exact versions for reproducibility:

```yaml
services:
  app:
    image: node:20-alpine  # Not just 'node:latest'
  db:
    image: postgres:15-alpine  # Specific version
```

### Use Multi-Stage Builds

Separate build and runtime for smaller images:

```dockerfile
FROM node:20-alpine AS build
# Build step

FROM node:20-alpine AS production
COPY --from=build /app/dist ./dist
# Smaller final image
```

### Implement Health Checks

Ensure services are ready before connecting:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

### Manage Secrets Securely

Never commit sensitive data:

```bash
# Use .env files (add to .gitignore)
DATABASE_PASSWORD=your_secure_password

# Or use Docker secrets
docker secret create db_password ./password.txt
```

### Development vs Production

Create separate configurations:

```bash
# Development
docker-compose -f docker-compose.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Common Patterns

### Full-Stack Application

```yaml
services:
  frontend:    # React/Vue.js
  backend:     # Node.js/Python API
  database:    # PostgreSQL
  cache:       # Redis
  nginx:       # Reverse proxy
```

### Microservices

```yaml
services:
  api-gateway:
  auth-service:
  user-service:
  product-service:
  shared-db:
  message-queue:
```

### Data Pipeline

```yaml
services:
  worker:        # Python processor
  database:      # MongoDB
  queue:         # RabbitMQ
  cache:         # Redis
```

## Quick Commands

```bash
# Build all images
docker-compose build

# Start services (detached)
docker-compose up -d

# View logs
docker-compose logs -f

# Access app shell
docker-compose exec app sh

# Restart service
docker-compose restart app

# Stop all services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

## Troubleshooting

### Service won't start

```bash
# Check logs
docker-compose logs service-name

# Rebuild without cache
docker-compose build --no-cache service-name
```

### Port already in use

```bash
# Check what's using the port
sudo lsof -i :3000

# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Map host 3001 to container 3000
```

### Database connection fails

```bash
# Ensure health check passes
docker-compose ps

# Check network connectivity
docker-compose exec app ping db
```

### Volume permission issues

```bash
# Linux: Fix ownership
sudo chown -R $USER:$USER ./volumes

# Or run as non-root user in Dockerfile
USER node
```

## Integration Ideas

### CI/CD Pipeline

```yaml
# .github/workflows/docker.yml
- name: Build and push
  run: |
    docker-compose build
    docker-compose push
```

### Local Development

```bash
# Start with hot reload
docker-compose up

# Run tests
docker-compose exec app npm test

# Access database
docker-compose exec db psql -U postgres
```

### Production Deployment

```bash
# Build production images
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build

# Deploy with resource limits
docker-compose -f docker-compose.prod.yml up -d
```

## Output Formats

### docker-compose.yml
Complete service orchestration with networking, volumes, and dependencies

### Dockerfile
Multi-stage builds optimized for development and production

### .dockerignore
Excludes unnecessary files from build context

### .env.example
Template for environment-specific configuration

### Documentation
Setup instructions and common commands

## Supported Technologies

| Category | Options |
|----------|---------|
| **Languages** | Node.js, Python, Go, Rust |
| **Frameworks** | Express, NestJS, FastAPI, Flask, Django, Gin, Actix |
| **Databases** | PostgreSQL, MySQL, MongoDB |
| **Cache** | Redis |
| **Queue** | RabbitMQ |
| **Search** | Elasticsearch |
| **Proxy** | Nginx |

## Limitations

- **Kubernetes**: For complex orchestration, consider Kubernetes
- **Cloud-Specific**: Does not generate ECS or Cloud Run configs
- **Windows Containers**: Focuses on Linux containers
- **GPU Support**: Basic setup only, no NVIDIA Docker configs

## Related Skills

- **ci-cd-pipeline-generator**: Create GitHub Actions for Docker builds
- **security-scanner**: Scan Docker images for vulnerabilities
- **api-documentation-generator**: Document containerized APIs

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
