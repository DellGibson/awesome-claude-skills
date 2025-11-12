# CI/CD Pipeline Generator

Automatically generate production-ready CI/CD pipeline configurations for GitHub Actions and GitLab CI. Creates complete workflows with test, build, lint, security scan, and deploy stages tailored to your project's tech stack.

## Features

- **Multi-Platform**: GitHub Actions and GitLab CI/CD configurations
- **Language Support**: Node.js, Python, Go, Rust with framework detection
- **Comprehensive Stages**: Lint, test, build, security, Docker, deploy
- **Smart Caching**: Optimized dependency caching for faster builds
- **Matrix Testing**: Test across multiple versions and platforms
- **Deployment Integration**: Vercel, AWS, Docker Hub, Heroku, and more
- **Security Scanning**: Integrated vulnerability checks
- **Branch Workflows**: Different pipelines for main, develop, feature branches

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `ci-cd-pipeline-generator` skill
4. Claude will automatically use this skill when you need CI/CD configurations

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `ci-cd-pipeline-generator`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["ci-cd-pipeline-generator"],
    messages=[{
        "role": "user",
        "content": "Create GitHub Actions workflow for Node.js app with tests and AWS deployment"
    }]
)
```

## Usage

### Basic Example

Ask Claude:
> "Generate a GitHub Actions workflow for my Node.js Express API with testing, building, and deployment to AWS ECS"

### Output

Claude will generate:

1. **Complete workflow YAML** - Ready to use CI/CD configuration
2. **Required secrets list** - Environment variables needed
3. **Setup documentation** - Instructions for configuration
4. **Status badges** - Markdown for repository README
5. **Runtime estimate** - Expected pipeline execution time

### Advanced Usage

Specify:

- **Platform**: github-actions or gitlab-ci
- **Stages**: lint, test, build, security, docker, deploy
- **Deployment Target**: vercel, aws-ecs, docker-hub, heroku
- **Testing**: Coverage, E2E tests, matrix builds
- **Environments**: production, staging, development

Example prompt:
> "Create GitHub Actions workflow for:
> - Python 3.11 FastAPI application
> - Run tests with coverage reporting
> - Build Docker image and push to Docker Hub
> - Deploy to AWS ECS for staging (develop branch) and production (main branch)
> - Include security scanning"

## Best Practices

### Use Caching

Speed up builds with dependency caching:

```yaml
- name: Cache dependencies
  uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

### Matrix Testing

Test across multiple versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 21]
    os: [ubuntu-latest, windows-latest]
```

### Branch Protection

Require status checks before merging:
1. Go to Settings > Branches
2. Add branch protection rule
3. Check "Require status checks to pass"
4. Select your workflow jobs

### Secure Secrets

Never commit credentials:
1. Use repository secrets
2. Access via `${{ secrets.SECRET_NAME }}`
3. Rotate regularly

### Optimize Runtime

- Run independent jobs in parallel
- Use caching for dependencies
- Skip unnecessary steps with conditions
- Use Docker layer caching

## Pipeline Patterns

### Simple Test & Deploy

```yaml
Stages: test → deploy
Branches: main → production
```

### Complete CI/CD

```yaml
Stages: lint → test → build → security → docker → deploy
Environments:
  - main → production
  - develop → staging
  - feature/* → preview
```

### Monorepo

```yaml
- Detect changed packages
- Test only affected code
- Build changed services
- Deploy independently
```

## Common Workflows

### Node.js API

```yaml
- Lint with ESLint
- Test with Jest + coverage
- Build Docker image
- Deploy to AWS ECS
```

### Python Application

```yaml
- Format check with Black
- Lint with flake8
- Test with pytest + coverage
- Build with Docker
- Deploy to Cloud Run
```

### Go Service

```yaml
- Format check with gofmt
- Lint with golangci-lint
- Test with go test
- Build binary
- Deploy to Kubernetes
```

### Rust Application

```yaml
- Format check with rustfmt
- Lint with clippy
- Test with cargo test
- Build release binary
- Push Docker image
```

## Quick Commands

### GitHub Actions

```bash
# View workflow runs
gh workflow list
gh workflow view ci-cd

# Trigger manually
gh workflow run ci-cd

# Watch logs
gh run watch

# View specific run
gh run view <run-id>
```

### GitLab CI

```bash
# View pipelines
gitlab-ci-local --list

# Run locally
gitlab-ci-local

# Trigger pipeline
git push -o ci.skip  # Skip CI
git push             # Run CI
```

## Troubleshooting

### Workflow not triggering

Check:
- Workflow file location (`.github/workflows/`)
- File name ends with `.yml` or `.yaml`
- Trigger conditions (branches, events)
- Branch protection rules

### Job failing

```bash
# Check logs
gh run view --log

# Common issues:
- Missing secrets
- Incorrect paths
- Syntax errors in YAML
- Permission issues
```

### Slow builds

Optimize:
- Enable caching
- Use Docker layer caching
- Run jobs in parallel
- Skip unnecessary steps

### Secrets not working

Verify:
- Secret names match exactly
- Secrets are set in repository settings
- Using correct syntax: `${{ secrets.NAME }}`
- Secret has correct permissions

## Integration Ideas

### Auto-Deploy on Merge

```yaml
on:
  push:
    branches: [main]
  # Deploys automatically when PR is merged
```

### Nightly Builds

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Run at 2 AM daily
```

### Multi-Environment

```yaml
# Staging
on:
  push:
    branches: [develop]

# Production
on:
  push:
    branches: [main]
  # Requires manual approval
```

### Slack Notifications

```yaml
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Deployment Targets

| Platform | Use Case | Configuration |
|----------|----------|---------------|
| **Vercel** | Next.js, React, Vue | Zero-config deployments |
| **Netlify** | Static sites, JAMstack | Git-based deploys |
| **AWS ECS** | Containerized apps | Docker + ECS service |
| **Docker Hub** | Container images | Push to registry |
| **Heroku** | Quick deployments | Buildpack support |
| **Cloud Run** | Serverless containers | Google Cloud |

## Supported Languages

- **Node.js**: npm, yarn, pnpm
- **Python**: pip, poetry, pipenv
- **Go**: go modules
- **Rust**: cargo

## Limitations

- Very complex workflows may need manual customization
- Does not support Jenkins or CircleCI
- Self-hosted runners require additional configuration
- Enterprise features may need separate setup

## Related Skills

- **docker-compose-builder**: Generate Dockerfiles for CI
- **security-scanner**: Add security scanning to pipelines
- **dependency-upgrade-assistant**: Automate dependency updates

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
