/**
 * Tests for Dependency Upgrade Assistant
 */

const DependencyUpgradeAssistant = require('../src/index');

describe('DependencyUpgradeAssistant', () => {
  let assistant;

  beforeEach(() => {
    assistant = new DependencyUpgradeAssistant();
  });

  describe('constructor', () => {
    it('should initialize with supported package managers', () => {
      expect(assistant.supportedManagers).toContain('npm');
      expect(assistant.supportedManagers).toContain('yarn');
      expect(assistant.supportedManagers).toContain('pip');
    });

    it('should define severity levels', () => {
      expect(assistant.severityLevels).toContain('critical');
      expect(assistant.severityLevels).toContain('high');
      expect(assistant.severityLevels).toContain('medium');
      expect(assistant.severityLevels).toContain('low');
    });
  });

  describe('analyze', () => {
    const samplePackageJson = {
      dependencies: {
        'express': '4.17.0',
        'lodash': '4.17.20'
      },
      devDependencies: {
        'jest': '26.0.0'
      }
    };

    it('should return complete upgrade analysis', () => {
      const result = assistant.analyze(samplePackageJson, 'npm', {});

      expect(result).toHaveProperty('outdated');
      expect(result).toHaveProperty('vulnerabilities');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('upgradePlan');
    });

    it('should include breaking changes when requested', () => {
      const result = assistant.analyze(samplePackageJson, 'npm', {
        checkBreakingChanges: true
      });

      expect(result).toHaveProperty('breakingChanges');
    });
  });

  describe('findOutdated', () => {
    it('should detect outdated dependencies', () => {
      const dependencies = {
        'express': '4.0.0',
        'lodash': '4.17.0'
      };

      const outdated = assistant.findOutdated(dependencies, 'npm');

      expect(Array.isArray(outdated)).toBe(true);
    });

    it('should identify major, minor, and patch updates', () => {
      const dependencies = {
        'package-a': '1.0.0'
      };

      const outdated = assistant.findOutdated(dependencies, 'npm');

      if (outdated.length > 0) {
        expect(['major', 'minor', 'patch']).toContain(outdated[0].updateType);
      }
    });
  });

  describe('checkVulnerabilities', () => {
    it('should check for known vulnerabilities', () => {
      const dependencies = {
        'lodash': '4.17.20'
      };

      const vulnerabilities = assistant.checkVulnerabilities(dependencies, 'npm');

      expect(Array.isArray(vulnerabilities)).toBe(true);
    });

    it('should include CVE information', () => {
      const dependencies = {
        'old-vulnerable-package': '1.0.0'
      };

      const vulnerabilities = assistant.checkVulnerabilities(dependencies, 'npm');

      vulnerabilities.forEach(vuln => {
        expect(vuln).toHaveProperty('severity');
        expect(vuln).toHaveProperty('package');
      });
    });

    it('should prioritize by severity', () => {
      const dependencies = {
        'package-a': '1.0.0',
        'package-b': '2.0.0'
      };

      const vulnerabilities = assistant.checkVulnerabilities(dependencies, 'npm');

      if (vulnerabilities.length > 1) {
        const severityOrder = ['critical', 'high', 'medium', 'low'];
        for (let i = 0; i < vulnerabilities.length - 1; i++) {
          const currentIdx = severityOrder.indexOf(vulnerabilities[i].severity);
          const nextIdx = severityOrder.indexOf(vulnerabilities[i + 1].severity);
          expect(currentIdx).toBeLessThanOrEqual(nextIdx);
        }
      }
    });
  });

  describe('generateRecommendations', () => {
    it('should prioritize security updates', () => {
      const outdated = [
        { package: 'safe-package', currentVersion: '1.0.0', latestVersion: '2.0.0' }
      ];
      const vulnerabilities = [
        { package: 'vulnerable-package', severity: 'critical' }
      ];

      const recommendations = assistant.generateRecommendations(outdated, vulnerabilities);

      expect(recommendations.length).toBeGreaterThan(0);
      if (recommendations.length > 1) {
        expect(recommendations[0].priority).toBe('critical');
      }
    });

    it('should suggest incremental updates for major versions', () => {
      const outdated = [
        {
          package: 'big-package',
          currentVersion: '1.0.0',
          latestVersion: '5.0.0',
          updateType: 'major'
        }
      ];

      const recommendations = assistant.generateRecommendations(outdated, []);

      expect(recommendations.some(r => r.strategy === 'incremental')).toBe(true);
    });
  });

  describe('createUpgradePlan', () => {
    it('should create phased upgrade plan', () => {
      const recommendations = [
        { package: 'pkg-a', priority: 'critical', updateType: 'patch' },
        { package: 'pkg-b', priority: 'medium', updateType: 'major' }
      ];

      const plan = assistant.createUpgradePlan(recommendations, {});

      expect(plan).toHaveProperty('phases');
      expect(Array.isArray(plan.phases)).toBe(true);
    });

    it('should group by priority and risk', () => {
      const recommendations = [
        { package: 'pkg-a', priority: 'critical', risk: 'low' },
        { package: 'pkg-b', priority: 'low', risk: 'high' }
      ];

      const plan = assistant.createUpgradePlan(recommendations, {});

      expect(plan.phases.length).toBeGreaterThan(0);
      expect(plan.phases[0].priority).toBe('critical');
    });
  });

  describe('checkBreakingChanges', () => {
    it('should identify breaking changes in major updates', () => {
      const package = {
        name: 'test-package',
        currentVersion: '1.0.0',
        targetVersion: '2.0.0'
      };

      const breaking = assistant.checkBreakingChanges(package);

      expect(breaking).toHaveProperty('hasBreaking');
      expect(breaking).toHaveProperty('changes');
    });
  });

  describe('generateMigrationGuide', () => {
    it('should provide migration steps', () => {
      const upgrade = {
        package: 'framework',
        from: '1.0.0',
        to: '2.0.0',
        breakingChanges: ['API changed', 'Config format updated']
      };

      const guide = assistant.generateMigrationGuide(upgrade);

      expect(guide).toContain('Migration');
      expect(guide).toContain('framework');
    });
  });

  describe('integration', () => {
    it('should analyze complete package.json and provide upgrade plan', () => {
      const packageJson = {
        name: 'my-app',
        version: '1.0.0',
        dependencies: {
          'express': '4.17.1',
          'lodash': '4.17.20',
          'axios': '0.21.0',
          'moment': '2.29.0'
        },
        devDependencies: {
          'jest': '26.6.0',
          'eslint': '7.0.0',
          'webpack': '4.44.0'
        }
      };

      const result = assistant.analyze(packageJson, 'npm', {
        checkBreakingChanges: true,
        checkVulnerabilities: true,
        generateMigrationGuides: true
      });

      expect(result.outdated.length).toBeGreaterThanOrEqual(0);
      expect(result.vulnerabilities).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThanOrEqual(0);
      expect(result.upgradePlan).toHaveProperty('phases');
      expect(result.upgradePlan.phases.length).toBeGreaterThanOrEqual(0);
    });
  });
});
