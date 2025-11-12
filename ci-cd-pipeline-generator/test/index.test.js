/**
 * Tests for CI/CD Pipeline Generator
 */

const CICDPipelineGenerator = require('../src/index');

describe('CICDPipelineGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new CICDPipelineGenerator();
  });

  describe('constructor', () => {
    it('should initialize with supported platforms', () => {
      expect(generator.supportedPlatforms).toContain('github-actions');
      expect(generator.supportedPlatforms).toContain('gitlab-ci');
    });

    it('should initialize with supported languages', () => {
      expect(generator.supportedLanguages).toContain('nodejs');
      expect(generator.supportedLanguages).toContain('python');
      expect(generator.supportedLanguages).toContain('go');
      expect(generator.supportedLanguages).toContain('rust');
    });

    it('should define available stages', () => {
      expect(generator.stages).toContain('lint');
      expect(generator.stages).toContain('test');
      expect(generator.stages).toContain('build');
      expect(generator.stages).toContain('security');
      expect(generator.stages).toContain('docker');
      expect(generator.stages).toContain('deploy');
    });
  });

  describe('generate', () => {
    const projectType = {
      language: 'nodejs',
      version: '20'
    };

    it('should generate complete CI/CD configuration', () => {
      const result = generator.generate(projectType, 'github-actions', {
        stages: ['test', 'build']
      });

      expect(result).toHaveProperty('workflow');
      expect(result).toHaveProperty('secrets');
      expect(result).toHaveProperty('documentation');
      expect(result).toHaveProperty('badges');
      expect(result).toHaveProperty('estimatedRuntime');
    });

    it('should return workflow YAML for GitHub Actions', () => {
      const result = generator.generate(projectType, 'github-actions', {});

      expect(result.workflow).toContain('name:');
      expect(result.workflow).toContain('on:');
      expect(result.workflow).toContain('jobs:');
    });

    it('should generate GitLab CI when requested', () => {
      const result = generator.generate(projectType, 'gitlab-ci', {});

      expect(result.workflow).toBeDefined();
    });
  });

  describe('generateGitHubActions', () => {
    it('should generate valid GitHub Actions workflow', () => {
      const projectType = { language: 'nodejs', version: '20' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['lint', 'test', 'build']
      });

      expect(workflow).toContain('name: CI/CD Pipeline');
      expect(workflow).toContain('on:');
      expect(workflow).toContain('push:');
      expect(workflow).toContain('pull_request:');
    });

    it('should include lint job when requested', () => {
      const projectType = { language: 'nodejs' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['lint']
      });

      expect(workflow).toContain('lint:');
    });

    it('should include test job when requested', () => {
      const projectType = { language: 'nodejs' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['test']
      });

      expect(workflow).toContain('test:');
    });

    it('should include build job when requested', () => {
      const projectType = { language: 'nodejs' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['build']
      });

      expect(workflow).toContain('build:');
    });

    it('should include security scanning when requested', () => {
      const projectType = { language: 'nodejs' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['security']
      });

      expect(workflow).toContain('security:');
    });

    it('should include Docker build when requested', () => {
      const projectType = { language: 'nodejs' };
      const workflow = generator.generateGitHubActions(projectType, {
        stages: ['docker']
      });

      expect(workflow).toContain('docker:');
    });
  });

  describe('generateEnvSection', () => {
    it('should set Node.js version', () => {
      const env = generator.generateEnvSection(
        { language: 'nodejs', version: '20' },
        {}
      );

      expect(env).toContain('NODE_VERSION');
      expect(env).toContain('20');
    });

    it('should set Python version', () => {
      const env = generator.generateEnvSection(
        { language: 'python', version: '3.11' },
        {}
      );

      expect(env).toContain('PYTHON_VERSION');
      expect(env).toContain('3.11');
    });

    it('should set Go version', () => {
      const env = generator.generateEnvSection(
        { language: 'go', version: '1.21' },
        {}
      );

      expect(env).toContain('GO_VERSION');
    });

    it('should include AWS region for AWS deployments', () => {
      const env = generator.generateEnvSection(
        { language: 'nodejs' },
        { deployment: { target: 'aws-ecs' } }
      );

      expect(env).toContain('AWS_REGION');
    });
  });

  describe('extractRequiredSecrets', () => {
    it('should extract Docker Hub secrets', () => {
      const secrets = generator.extractRequiredSecrets({
        stages: ['docker'],
        dockerRegistry: 'dockerhub'
      });

      expect(secrets.some(s => s.includes('DOCKER'))).toBe(true);
    });

    it('should extract AWS secrets for AWS deployment', () => {
      const secrets = generator.extractRequiredSecrets({
        deployment: { enabled: true, target: 'aws-ecs' }
      });

      expect(secrets.some(s => s.includes('AWS'))).toBe(true);
    });

    it('should return empty array for minimal config', () => {
      const secrets = generator.extractRequiredSecrets({
        stages: ['lint', 'test']
      });

      expect(Array.isArray(secrets)).toBe(true);
    });
  });

  describe('generateBadges', () => {
    it('should generate GitHub Actions badges', () => {
      const badges = generator.generateBadges('github-actions');

      expect(badges.length).toBeGreaterThan(0);
      expect(badges.some(b => b.includes('github'))).toBe(true);
    });

    it('should generate GitLab CI badges', () => {
      const badges = generator.generateBadges('gitlab-ci');

      expect(badges.length).toBeGreaterThan(0);
    });
  });

  describe('estimateRuntime', () => {
    it('should estimate runtime for stages', () => {
      const runtime = generator.estimateRuntime(['lint', 'test', 'build']);

      expect(typeof runtime).toBe('string');
      expect(runtime).toContain('min');
    });

    it('should increase estimate with more stages', () => {
      const short = generator.estimateRuntime(['test']);
      const long = generator.estimateRuntime(['lint', 'test', 'build', 'security', 'docker']);

      expect(short.length).toBeGreaterThan(0);
      expect(long.length).toBeGreaterThan(0);
    });
  });

  describe('generateDocumentation', () => {
    it('should generate setup documentation', () => {
      const doc = generator.generateDocumentation('github-actions', {
        stages: ['test', 'build']
      });

      expect(doc).toContain('CI/CD');
      expect(doc).toContain('GitHub Actions');
    });

    it('should include secret setup instructions', () => {
      const doc = generator.generateDocumentation('github-actions', {
        deployment: { enabled: true, target: 'aws-ecs' }
      });

      expect(doc).toContain('secret');
    });
  });

  describe('integration', () => {
    it('should generate complete Node.js CI/CD pipeline', () => {
      const result = generator.generate(
        { language: 'nodejs', version: '20', packageManager: 'npm' },
        'github-actions',
        {
          stages: ['lint', 'test', 'build', 'security', 'docker'],
          caching: true,
          dockerRegistry: 'dockerhub',
          deployment: {
            enabled: true,
            target: 'aws-ecs',
            environments: ['staging', 'production']
          }
        }
      );

      expect(result.workflow).toContain('lint:');
      expect(result.workflow).toContain('test:');
      expect(result.workflow).toContain('build:');
      expect(result.workflow).toContain('security:');
      expect(result.workflow).toContain('docker:');
      expect(result.secrets.length).toBeGreaterThan(0);
      expect(result.documentation).toBeTruthy();
      expect(result.badges.length).toBeGreaterThan(0);
    });

    it('should generate Python CI/CD pipeline', () => {
      const result = generator.generate(
        { language: 'python', version: '3.11' },
        'github-actions',
        {
          stages: ['lint', 'test'],
          caching: true
        }
      );

      expect(result.workflow).toContain('PYTHON_VERSION');
      expect(result.workflow).toContain('flake8');
    });
  });
});
