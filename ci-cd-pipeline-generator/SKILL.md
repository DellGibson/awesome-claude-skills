---
name: ci-cd-pipeline-generator
description: Creates GitHub Actions and GitLab CI/CD pipeline configurations for Node.js, Python, Rust, and Go projects with automated test, build, and deploy stages
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - ci-cd
  - github-actions
  - gitlab-ci
  - automation
  - deployment
  - testing
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# CI/CD Pipeline Generator

Automatically generate production-ready CI/CD pipeline configurations for GitHub Actions and GitLab CI. This skill creates complete workflows with test, build, lint, security scan, and deploy stages tailored to your project's tech stack.

## What It Does

The CI/CD Pipeline Generator skill:

1. **Detects Project Type** - Analyzes language and framework from project structure
2. **Generates Workflows** - Creates GitHub Actions or GitLab CI YAML configurations
3. **Configures Test Stage** - Sets up unit testing, integration testing, and coverage
4. **Adds Build Stage** - Compiles code and creates artifacts
5. **Implements Lint/Format** - Runs code quality checks and formatters
6. **Security Scanning** - Integrates dependency vulnerability checks
7. **Deploy Stage** - Configures deployment to various platforms (Vercel, AWS, Docker Hub)
8. **Caching Optimization** - Speeds up builds with dependency caching

## Key Features

- **Multi-Platform Support**: GitHub Actions and GitLab CI/CD
- **Language Coverage**: Node.js, Python, Go, Rust with framework detection
- **Stage Customization**: Choose which stages to include (test, build, deploy)
- **Deployment Targets**: Vercel, Netlify, AWS, GCP, Docker Hub, Heroku
- **Matrix Builds**: Test across multiple versions and platforms
- **Secrets Management**: Secure environment variable configuration
- **Caching Strategy**: Optimized dependency and build caching
- **Branch Workflows**: Different pipelines for main, develop, feature branches

## When to Use This Skill

Use the CI/CD Pipeline Generator when you need to:

- Set up automated testing and deployment for a new project
- Migrate from one CI platform to another
- Standardize CI/CD across multiple repositories
- Add security scanning and code quality checks
- Implement deployment automation
- Create matrix builds for multi-platform support
- Set up staging and production environments

## Supported Platforms

### CI/CD Providers
- **GitHub Actions**: Complete workflow files with job dependencies
- **GitLab CI**: Pipeline configurations with stages and artifacts

### Deployment Targets
- **Vercel**: Serverless deployments for Next.js, React, Vue
- **Netlify**: Static site deployments
- **AWS**: ECR, ECS, S3, Lambda deployments
- **Docker Hub**: Container image publishing
- **Heroku**: App deployments with buildpacks
- **Google Cloud Platform**: Cloud Run, App Engine

## Example Usage

### Input: Node.js Project with Testing and Deployment

```
Project Type: Node.js Express API
Platform: GitHub Actions
Stages: test, build, deploy
Deployment: AWS ECS with Docker
Test Coverage: Required
Branch Strategy: main (production), develop (staging)
```

### Output: Generated GitHub Actions Workflow

#### .github/workflows/ci-cd.yml

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'
  AWS_REGION: us-east-1

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

      - name: Security audit
        run: npm audit --production

  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: test

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 7

  docker:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ secrets.DOCKER_USERNAME }}/myapp
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster staging-cluster \
            --service myapp-staging \
            --force-new-deployment

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com

    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production-cluster \
            --service myapp-production \
            --force-new-deployment

      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Output Components

The skill generates:

1. **Workflow/Pipeline YAML** - Complete CI/CD configuration
2. **Secrets Documentation** - List of required environment variables
3. **README Section** - Instructions for setting up CI/CD
4. **Badge Markdown** - Status badges for repository README
5. **Environment Config** - Deployment environment settings

## Best Practices

### For Optimal Pipelines

1. **Use Caching**: Cache dependencies to speed up builds
   ```yaml
   - uses: actions/cache@v3
     with:
       path: ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
   ```

2. **Fail Fast**: Run tests early to catch issues quickly
   ```yaml
   strategy:
     fail-fast: true
   ```

3. **Matrix Testing**: Test across multiple versions
   ```yaml
   strategy:
     matrix:
       node-version: [18, 20, 21]
       os: [ubuntu-latest, windows-latest]
   ```

4. **Secure Secrets**: Never commit credentials
   ```yaml
   # Use repository secrets
   password: ${{ secrets.PASSWORD }}
   ```

5. **Branch Protection**: Require status checks to pass
   ```
   Settings > Branches > Branch protection rules
   ✓ Require status checks to pass before merging
   ```

## Common Pipeline Patterns

### Basic Test & Deploy
```yaml
stages: [test, deploy]
test → deploy (on main only)
```

### Full CI/CD
```yaml
stages: [lint, test, build, security, deploy]
lint → test → build → security → deploy
```

### Multi-Environment
```yaml
main → production
develop → staging
feature/* → preview deployments
```

### Monorepo
```yaml
Detect changed packages
Run tests only for changed code
Build and deploy affected services
```

## Limitations

- **Complex Workflows**: Very advanced pipelines may need manual customization
- **Platform-Specific**: Cannot generate Jenkins or CircleCI configs
- **Custom Runners**: Does not configure self-hosted runners
- **Advanced Security**: Enterprise security policies need manual setup

## Tips

- Start with minimal stages and add more as needed
- Use workflow templates for consistency across projects
- Monitor pipeline execution times and optimize caching
- Set up notifications for failed builds (Slack, email)
- Use deployment approvals for production environments
- Keep workflows in sync across branches

## Related Skills

- **docker-compose-builder**: Generate Dockerfiles for CI builds
- **security-scanner**: Add security scanning to pipelines
- **dependency-upgrade-assistant**: Automate dependency updates

## Installation

This skill is available for use in:
- Claude.ai web interface
- Claude Code (desktop application)
- Claude API integrations

No additional installation required - activate the skill and start generating CI/CD pipelines!
