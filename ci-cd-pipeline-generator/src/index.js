/**
 * CI/CD Pipeline Generator
 * Creates GitHub Actions and GitLab CI/CD configurations from project requirements
 */

class CICDPipelineGenerator {
  constructor() {
    this.supportedPlatforms = ['github-actions', 'gitlab-ci'];
    this.supportedLanguages = ['nodejs', 'python', 'go', 'rust'];
    this.stages = ['lint', 'test', 'build', 'security', 'docker', 'deploy'];
  }

  /**
   * Main entry point - generates CI/CD pipeline configuration
   */
  generate(projectType, platform, options = {}) {
    const workflow = this.generateWorkflow(projectType, platform, options);
    const secrets = this.extractRequiredSecrets(options);
    const documentation = this.generateDocumentation(platform, options);
    const badges = this.generateBadges(platform);
    const estimatedRuntime = this.estimateRuntime(options.stages || []);

    return {
      workflow,
      secrets,
      documentation,
      badges,
      estimatedRuntime
    };
  }

  /**
   * Generate complete workflow configuration
   */
  generateWorkflow(projectType, platform, options) {
    if (platform === 'github-actions') {
      return this.generateGitHubActions(projectType, options);
    } else if (platform === 'gitlab-ci') {
      return this.generateGitLabCI(projectType, options);
    }
    return '';
  }

  /**
   * Generate GitHub Actions workflow
   */
  generateGitHubActions(projectType, options) {
    const stages = options.stages || ['test', 'build'];
    const language = projectType.language;
    const version = projectType.version || 'latest';

    let workflow = `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

`;

    // Add environment variables
    workflow += this.generateEnvSection(projectType, options);

    // Add jobs
    workflow += `jobs:\n`;

    // Lint job
    if (stages.includes('lint')) {
      workflow += this.generateGitHubLintJob(projectType, options);
    }

    // Test job
    if (stages.includes('test')) {
      workflow += this.generateGitHubTestJob(projectType, options);
    }

    // Build job
    if (stages.includes('build')) {
      workflow += this.generateGitHubBuildJob(projectType, options);
    }

    // Security job
    if (stages.includes('security')) {
      workflow += this.generateGitHubSecurityJob(projectType, options);
    }

    // Docker job
    if (stages.includes('docker')) {
      workflow += this.generateGitHubDockerJob(projectType, options);
    }

    // Deploy jobs
    if (stages.includes('deploy') && options.deployment?.enabled) {
      workflow += this.generateGitHubDeployJobs(projectType, options);
    }

    return workflow;
  }

  /**
   * Generate environment variables section
   */
  generateEnvSection(projectType, options) {
    const language = projectType.language;
    const version = projectType.version || 'latest';

    let env = `env:\n`;

    if (language === 'nodejs') {
      env += `  NODE_VERSION: '${version}'\n`;
    } else if (language === 'python') {
      env += `  PYTHON_VERSION: '${version}'\n`;
    } else if (language === 'go') {
      env += `  GO_VERSION: '${version}'\n`;
    } else if (language === 'rust') {
      env += `  RUST_VERSION: '${version}'\n`;
    }

    if (options.deployment?.target?.includes('aws')) {
      env += `  AWS_REGION: us-east-1\n`;
    }

    env += `\n`;
    return env;
  }

  /**
   * Generate GitHub Actions lint job
   */
  generateGitHubLintJob(projectType, options) {
    const language = projectType.language;
    const pkg = projectType.packageManager || this.getDefaultPackageManager(language);

    let job = `  lint:
    name: Code Quality
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

`;

    job += this.generateLanguageSetup(language, projectType.version, 'github-actions');
    job += this.generateInstallDeps(language, pkg, 'github-actions', options.caching);

    // Add lint command
    if (language === 'nodejs') {
      job += `      - name: Run linter
        run: ${pkg} run lint

      - name: Check formatting
        run: ${pkg} run format:check

`;
    } else if (language === 'python') {
      job += `      - name: Run flake8
        run: flake8 .

      - name: Run black
        run: black --check .

`;
    } else if (language === 'go') {
      job += `      - name: Run golangci-lint
        uses: golangci/golangci-lint-action@v3

`;
    } else if (language === 'rust') {
      job += `      - name: Run clippy
        run: cargo clippy -- -D warnings

      - name: Check formatting
        run: cargo fmt --check

`;
    }

    return job;
  }

  /**
   * Generate GitHub Actions test job
   */
  generateGitHubTestJob(projectType, options) {
    const language = projectType.language;
    const pkg = projectType.packageManager || this.getDefaultPackageManager(language);
    const needsLint = (options.stages || []).includes('lint');

    let job = `  test:
    name: Test Suite
    runs-on: ubuntu-latest
`;

    if (needsLint) {
      job += `    needs: lint
`;
    }

    // Matrix testing
    if (options.testing?.matrix?.enabled) {
      job += this.generateMatrixConfig(projectType, options);
    }

    job += `
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

`;

    job += this.generateLanguageSetup(language, projectType.version, 'github-actions');
    job += this.generateInstallDeps(language, pkg, 'github-actions', options.caching);

    // Add test commands
    if (language === 'nodejs') {
      job += `      - name: Run tests
        run: ${pkg} test${options.testing?.coverage ? ' -- --coverage' : ''}

`;

      if (options.testing?.coverage) {
        job += `      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests

`;
      }
    } else if (language === 'python') {
      job += `      - name: Run tests
        run: pytest${options.testing?.coverage ? ' --cov=. --cov-report=xml' : ''}

`;

      if (options.testing?.coverage) {
        job += `      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.xml

`;
      }
    } else if (language === 'go') {
      job += `      - name: Run tests
        run: go test -v ./...${options.testing?.coverage ? ' -coverprofile=coverage.out' : ''}

`;
    } else if (language === 'rust') {
      job += `      - name: Run tests
        run: cargo test --verbose

`;
    }

    return job;
  }

  /**
   * Generate GitHub Actions build job
   */
  generateGitHubBuildJob(projectType, options) {
    const language = projectType.language;
    const pkg = projectType.packageManager || this.getDefaultPackageManager(language);
    const needsTest = (options.stages || []).includes('test');

    let job = `  build:
    name: Build Application
    runs-on: ubuntu-latest
`;

    if (needsTest) {
      job += `    needs: test
`;
    }

    job += `
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

`;

    job += this.generateLanguageSetup(language, projectType.version, 'github-actions');
    job += this.generateInstallDeps(language, pkg, 'github-actions', options.caching);

    // Add build commands
    if (language === 'nodejs') {
      job += `      - name: Build application
        run: ${pkg} run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build
          path: dist/
          retention-days: 7

`;
    } else if (language === 'python') {
      job += `      - name: Build package
        run: python -m build

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

`;
    } else if (language === 'go') {
      job += `      - name: Build binary
        run: go build -o app

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: binary
          path: app

`;
    } else if (language === 'rust') {
      job += `      - name: Build release
        run: cargo build --release

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: binary
          path: target/release/

`;
    }

    return job;
  }

  /**
   * Generate GitHub Actions security scan job
   */
  generateGitHubSecurityJob(projectType, options) {
    const language = projectType.language;
    const pkg = projectType.packageManager || this.getDefaultPackageManager(language);

    let job = `  security:
    name: Security Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

`;

    if (language === 'nodejs') {
      job += `      - name: Run npm audit
        run: npm audit --production

`;
    } else if (language === 'python') {
      job += `      - name: Run safety check
        run: |
          pip install safety
          safety check

`;
    } else if (language === 'go') {
      job += `      - name: Run gosec
        uses: securego/gosec@master
        with:
          args: ./...

`;
    } else if (language === 'rust') {
      job += `      - name: Run cargo audit
        run: |
          cargo install cargo-audit
          cargo audit

`;
    }

    job += `      - name: Run Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: \${{ secrets.SNYK_TOKEN }}

`;

    return job;
  }

  /**
   * Generate GitHub Actions Docker job
   */
  generateGitHubDockerJob(projectType, options) {
    const needsBuild = (options.stages || []).includes('build');

    let job = `  docker:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
`;

    if (needsBuild) {
      job += `    needs: build
`;
    }

    job += `    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/develop'

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKER_USERNAME }}
          password: \${{ secrets.DOCKER_PASSWORD }}

      - name: Docker meta
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: \${{ secrets.DOCKER_USERNAME }}/\${{ github.event.repository.name }}
          tags: |
            type=ref,event=branch
            type=sha,prefix={{branch}}-
            type=semver,pattern={{version}}

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: \${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

`;

    return job;
  }

  /**
   * Generate GitHub Actions deploy jobs
   */
  generateGitHubDeployJobs(projectType, options) {
    const deployment = options.deployment;
    let jobs = '';

    if (!deployment.environments || deployment.environments.length === 0) {
      return '';
    }

    deployment.environments.forEach(env => {
      const envName = env.name;
      const branch = env.branch;

      jobs += `  deploy-${envName}:
    name: Deploy to ${envName.charAt(0).toUpperCase() + envName.slice(1)}
    runs-on: ubuntu-latest
    needs: docker
    if: github.ref == 'refs/heads/${branch}'
    environment:
      name: ${envName}
      url: ${env.url || 'https://example.com'}

    steps:
`;

      jobs += this.generateDeploymentSteps(deployment.target, envName);
    });

    return jobs;
  }

  /**
   * Generate deployment steps based on target
   */
  generateDeploymentSteps(target, environment) {
    let steps = '';

    if (target === 'aws-ecs') {
      steps += `      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: \${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: \${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: \${{ env.AWS_REGION }}

      - name: Deploy to ECS
        run: |
          aws ecs update-service \\
            --cluster ${environment}-cluster \\
            --service \${{ github.event.repository.name }}-${environment} \\
            --force-new-deployment

`;
    } else if (target === 'vercel') {
      steps += `      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'

`;
    } else if (target === 'heroku') {
      steps += `      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.14
        with:
          heroku_api_key: \${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: \${{ secrets.HEROKU_APP_NAME }}
          heroku_email: \${{ secrets.HEROKU_EMAIL }}

`;
    }

    return steps;
  }

  /**
   * Generate GitLab CI configuration
   */
  generateGitLabCI(projectType, options) {
    const stages = options.stages || ['test', 'build'];
    const language = projectType.language;

    let config = `stages:\n`;
    stages.forEach(stage => {
      config += `  - ${stage}\n`;
    });
    config += `\n`;

    // Variables
    config += this.generateGitLabVariables(projectType);

    // Cache
    if (options.caching) {
      config += this.generateGitLabCache(projectType);
    }

    // Jobs
    if (stages.includes('lint')) {
      config += this.generateGitLabLintJob(projectType, options);
    }

    if (stages.includes('test')) {
      config += this.generateGitLabTestJob(projectType, options);
    }

    if (stages.includes('build')) {
      config += this.generateGitLabBuildJob(projectType, options);
    }

    if (stages.includes('docker')) {
      config += this.generateGitLabDockerJob(projectType, options);
    }

    if (stages.includes('deploy') && options.deployment?.enabled) {
      config += this.generateGitLabDeployJobs(projectType, options);
    }

    return config;
  }

  /**
   * Generate GitLab variables section
   */
  generateGitLabVariables(projectType) {
    const language = projectType.language;
    const version = projectType.version || 'latest';

    let vars = `variables:\n`;

    if (language === 'nodejs') {
      vars += `  NODE_VERSION: "${version}"\n`;
    } else if (language === 'python') {
      vars += `  PYTHON_VERSION: "${version}"\n`;
    } else if (language === 'go') {
      vars += `  GO_VERSION: "${version}"\n`;
    }

    vars += `\n`;
    return vars;
  }

  /**
   * Generate GitLab cache configuration
   */
  generateGitLabCache(projectType) {
    const language = projectType.language;

    let cache = `cache:\n  paths:\n`;

    if (language === 'nodejs') {
      cache += `    - node_modules/\n`;
    } else if (language === 'python') {
      cache += `    - .venv/\n`;
    } else if (language === 'go') {
      cache += `    - .go/\n`;
    } else if (language === 'rust') {
      cache += `    - target/\n`;
    }

    cache += `\n`;
    return cache;
  }

  /**
   * Generate GitLab test job
   */
  generateGitLabTestJob(projectType, options) {
    const language = projectType.language;
    const image = this.getDockerImage(language, projectType.version);

    let job = `test:
  stage: test
  image: ${image}
  script:
`;

    if (language === 'nodejs') {
      job += `    - npm ci\n`;
      job += `    - npm test\n`;
    } else if (language === 'python') {
      job += `    - pip install -r requirements.txt\n`;
      job += `    - pytest\n`;
    } else if (language === 'go') {
      job += `    - go test -v ./...\n`;
    } else if (language === 'rust') {
      job += `    - cargo test\n`;
    }

    job += `\n`;
    return job;
  }

  /**
   * Generate GitLab lint job
   */
  generateGitLabLintJob(projectType, options) {
    const language = projectType.language;
    const image = this.getDockerImage(language, projectType.version);

    let job = `lint:
  stage: lint
  image: ${image}
  script:
`;

    if (language === 'nodejs') {
      job += `    - npm ci\n`;
      job += `    - npm run lint\n`;
    } else if (language === 'python') {
      job += `    - pip install flake8 black\n`;
      job += `    - flake8 .\n`;
      job += `    - black --check .\n`;
    } else if (language === 'go') {
      job += `    - go fmt ./...\n`;
    } else if (language === 'rust') {
      job += `    - cargo fmt --check\n`;
      job += `    - cargo clippy\n`;
    }

    job += `\n`;
    return job;
  }

  /**
   * Generate GitLab build job
   */
  generateGitLabBuildJob(projectType, options) {
    const language = projectType.language;
    const image = this.getDockerImage(language, projectType.version);

    let job = `build:
  stage: build
  image: ${image}
  script:
`;

    if (language === 'nodejs') {
      job += `    - npm ci\n`;
      job += `    - npm run build\n`;
      job += `  artifacts:\n`;
      job += `    paths:\n`;
      job += `      - dist/\n`;
    } else if (language === 'python') {
      job += `    - pip install build\n`;
      job += `    - python -m build\n`;
      job += `  artifacts:\n`;
      job += `    paths:\n`;
      job += `      - dist/\n`;
    } else if (language === 'go') {
      job += `    - go build -o app\n`;
      job += `  artifacts:\n`;
      job += `    paths:\n`;
      job += `      - app\n`;
    } else if (language === 'rust') {
      job += `    - cargo build --release\n`;
      job += `  artifacts:\n`;
      job += `    paths:\n`;
      job += `      - target/release/\n`;
    }

    job += `\n`;
    return job;
  }

  /**
   * Generate GitLab Docker job
   */
  generateGitLabDockerJob(projectType, options) {
    return `docker:
  stage: docker
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD
    - docker build -t $DOCKER_USERNAME/$CI_PROJECT_NAME:$CI_COMMIT_SHORT_SHA .
    - docker push $DOCKER_USERNAME/$CI_PROJECT_NAME:$CI_COMMIT_SHORT_SHA
  only:
    - main
    - develop

`;
  }

  /**
   * Generate GitLab deploy jobs
   */
  generateGitLabDeployJobs(projectType, options) {
    const deployment = options.deployment;
    let jobs = '';

    if (!deployment.environments || deployment.environments.length === 0) {
      return '';
    }

    deployment.environments.forEach(env => {
      jobs += `deploy-${env.name}:
  stage: deploy
  script:
    - echo "Deploying to ${env.name}"
  environment:
    name: ${env.name}
    url: ${env.url || 'https://example.com'}
  only:
    - ${env.branch}

`;
    });

    return jobs;
  }

  /**
   * Helper: Generate language setup steps for GitHub Actions
   */
  generateLanguageSetup(language, version, platform) {
    let setup = '';

    if (language === 'nodejs') {
      setup += `      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: \${{ env.NODE_VERSION }}

`;
    } else if (language === 'python') {
      setup += `      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: \${{ env.PYTHON_VERSION }}

`;
    } else if (language === 'go') {
      setup += `      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: \${{ env.GO_VERSION }}

`;
    } else if (language === 'rust') {
      setup += `      - name: Setup Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          override: true

`;
    }

    return setup;
  }

  /**
   * Helper: Generate dependency installation steps
   */
  generateInstallDeps(language, pkg, platform, caching) {
    let install = '';

    if (caching && platform === 'github-actions') {
      if (language === 'nodejs') {
        install += `      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.npm
          key: \${{ runner.os }}-node-\${{ hashFiles('**/package-lock.json') }}

`;
      } else if (language === 'python') {
        install += `      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: \${{ runner.os }}-pip-\${{ hashFiles('**/requirements.txt') }}

`;
      }
    }

    install += `      - name: Install dependencies
`;

    if (language === 'nodejs') {
      install += `        run: ${pkg === 'npm' ? 'npm ci' : pkg + ' install'}
`;
    } else if (language === 'python') {
      install += `        run: pip install -r requirements.txt
`;
    } else if (language === 'go') {
      install += `        run: go mod download
`;
    } else if (language === 'rust') {
      install += `        run: cargo fetch
`;
    }

    install += `\n`;
    return install;
  }

  /**
   * Helper: Generate matrix configuration
   */
  generateMatrixConfig(projectType, options) {
    const matrix = options.testing.matrix;

    let config = `    strategy:
      matrix:
`;

    if (matrix.versions && matrix.versions.length > 0) {
      config += `        ${projectType.language}-version: [${matrix.versions.map(v => `'${v}'`).join(', ')}]\n`;
    }

    if (matrix.os && matrix.os.length > 0) {
      config += `        os: [${matrix.os.join(', ')}]\n`;
    }

    return config;
  }

  /**
   * Helper: Get default package manager for language
   */
  getDefaultPackageManager(language) {
    const defaults = {
      nodejs: 'npm',
      python: 'pip',
      go: 'go',
      rust: 'cargo'
    };
    return defaults[language] || 'npm';
  }

  /**
   * Helper: Get Docker image for language
   */
  getDockerImage(language, version) {
    const images = {
      nodejs: `node:${version || 'latest'}-alpine`,
      python: `python:${version || 'latest'}-slim`,
      go: `golang:${version || 'latest'}-alpine`,
      rust: `rust:${version || 'latest'}-alpine`
    };
    return images[language] || 'ubuntu:latest';
  }

  /**
   * Extract required secrets from configuration
   */
  extractRequiredSecrets(options) {
    const secrets = [];

    // Docker secrets
    if ((options.stages || []).includes('docker')) {
      secrets.push(
        { name: 'DOCKER_USERNAME', description: 'Docker Hub username', required: true },
        { name: 'DOCKER_PASSWORD', description: 'Docker Hub password or token', required: true }
      );
    }

    // Deployment secrets
    if (options.deployment?.enabled) {
      const target = options.deployment.target;

      if (target?.includes('aws')) {
        secrets.push(
          { name: 'AWS_ACCESS_KEY_ID', description: 'AWS access key', required: true },
          { name: 'AWS_SECRET_ACCESS_KEY', description: 'AWS secret key', required: true }
        );
      } else if (target === 'vercel') {
        secrets.push(
          { name: 'VERCEL_TOKEN', description: 'Vercel deployment token', required: true },
          { name: 'VERCEL_ORG_ID', description: 'Vercel organization ID', required: true },
          { name: 'VERCEL_PROJECT_ID', description: 'Vercel project ID', required: true }
        );
      } else if (target === 'heroku') {
        secrets.push(
          { name: 'HEROKU_API_KEY', description: 'Heroku API key', required: true },
          { name: 'HEROKU_APP_NAME', description: 'Heroku app name', required: true },
          { name: 'HEROKU_EMAIL', description: 'Heroku account email', required: true }
        );
      }
    }

    // Security scanning
    if ((options.stages || []).includes('security')) {
      secrets.push(
        { name: 'SNYK_TOKEN', description: 'Snyk API token for security scanning', required: false }
      );
    }

    // Notifications
    if (options.notifications?.slack) {
      secrets.push(
        { name: 'SLACK_WEBHOOK', description: 'Slack webhook URL for notifications', required: false }
      );
    }

    return secrets;
  }

  /**
   * Generate documentation for setup
   */
  generateDocumentation(platform, options) {
    let doc = `# CI/CD Pipeline Setup

## Quick Start

1. Copy the generated workflow file to your repository:
`;

    if (platform === 'github-actions') {
      doc += `   - Create \`.github/workflows/ci-cd.yml\`
   - Paste the generated workflow content

`;
    } else if (platform === 'gitlab-ci') {
      doc += `   - Create \`.gitlab-ci.yml\` in repository root
   - Paste the generated configuration

`;
    }

    doc += `2. Configure required secrets in your repository settings

3. Push to trigger the pipeline

## Required Secrets

`;

    const secrets = this.extractRequiredSecrets(options);
    secrets.forEach(secret => {
      doc += `- **${secret.name}**: ${secret.description}${secret.required ? ' (required)' : ' (optional)'}\n`;
    });

    doc += `\n## Pipeline Stages

`;

    const stages = options.stages || ['test', 'build'];
    stages.forEach(stage => {
      doc += `- **${stage}**: ${this.getStageDescription(stage)}\n`;
    });

    return doc;
  }

  /**
   * Helper: Get description for pipeline stage
   */
  getStageDescription(stage) {
    const descriptions = {
      lint: 'Code quality and formatting checks',
      test: 'Unit and integration tests',
      build: 'Build application artifacts',
      security: 'Security vulnerability scanning',
      docker: 'Build and push Docker images',
      deploy: 'Deploy to target environment'
    };
    return descriptions[stage] || 'Pipeline stage';
  }

  /**
   * Generate status badges
   */
  generateBadges(platform) {
    const badges = [];

    if (platform === 'github-actions') {
      badges.push({
        name: 'CI/CD',
        markdown: '![CI/CD](https://github.com/user/repo/workflows/CI-CD%20Pipeline/badge.svg)'
      });
    } else if (platform === 'gitlab-ci') {
      badges.push({
        name: 'Pipeline Status',
        markdown: '[![pipeline status](https://gitlab.com/user/repo/badges/main/pipeline.svg)](https://gitlab.com/user/repo/-/commits/main)'
      });
    }

    return badges;
  }

  /**
   * Estimate pipeline runtime
   */
  estimateRuntime(stages) {
    let minutes = 0;

    const timings = {
      lint: 1,
      test: 3,
      build: 2,
      security: 2,
      docker: 3,
      deploy: 2
    };

    stages.forEach(stage => {
      minutes += timings[stage] || 1;
    });

    return `${minutes}-${minutes + 3} minutes`;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CICDPipelineGenerator;
}

// Demo usage
if (require.main === module) {
  const generator = new CICDPipelineGenerator();

  const result = generator.generate(
    {
      language: 'nodejs',
      framework: 'express',
      version: '20',
      packageManager: 'npm'
    },
    'github-actions',
    {
      stages: ['lint', 'test', 'build', 'docker', 'deploy'],
      deployment: {
        enabled: true,
        target: 'aws-ecs',
        environments: [
          { name: 'production', branch: 'main', url: 'https://api.example.com' },
          { name: 'staging', branch: 'develop', url: 'https://staging.api.example.com' }
        ]
      },
      testing: {
        coverage: true,
        e2e: false,
        matrix: { enabled: false }
      },
      caching: true
    }
  );

  console.log('=== Generated Workflow ===');
  console.log(result.workflow);
  console.log('\n=== Required Secrets ===');
  console.log(JSON.stringify(result.secrets, null, 2));
  console.log('\n=== Estimated Runtime ===');
  console.log(result.estimatedRuntime);
}
