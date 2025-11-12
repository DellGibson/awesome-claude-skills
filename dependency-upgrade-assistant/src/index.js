/**
 * Dependency Upgrade Assistant
 * Checks for outdated dependencies and security vulnerabilities
 */

class DependencyUpgradeAssistant {
  constructor() {
    this.knownVulnerabilities = {
      'lodash': {
        '4.17.20': ['CVE-2021-23337'],
        '4.17.19': ['CVE-2020-8203', 'CVE-2021-23337']
      },
      'axios': {
        '0.21.1': ['CVE-2021-3749']
      }
    };

    this.latestVersions = {
      'lodash': '4.17.21',
      'axios': '0.27.2',
      'react': '18.2.0',
      'express': '4.18.2',
      'jest': '29.5.0'
    };
  }

  /**
   * Analyze dependencies
   */
  analyze(dependencyFile, options = {}) {
    const fileType = options.fileType === 'auto' ? this.detectFileType(dependencyFile) : options.fileType;
    const dependencies = this.parseDependencies(dependencyFile, fileType);
    const outdated = this.checkOutdated(dependencies);
    const upgradeStrategy = this.generateUpgradeStrategy(outdated);
    const migrationGuide = options.includeMigrationGuide ? this.generateMigrationGuide(outdated) : null;
    const totalVulnerabilities = outdated.filter(d => d.hasCVE).length;

    return {
      outdated,
      upgradeStrategy,
      migrationGuide,
      totalVulnerabilities,
      summary: this.generateSummary(outdated, totalVulnerabilities)
    };
  }

  /**
   * Detect dependency file type
   */
  detectFileType(content) {
    if (content.trim().startsWith('{')) return 'package.json';
    if (content.includes('[package]') || content.includes('[dependencies]')) return 'Cargo.toml';
    return 'requirements.txt';
  }

  /**
   * Parse dependencies from file
   */
  parseDependencies(content, fileType) {
    const deps = [];

    if (fileType === 'package.json') {
      try {
        const pkg = JSON.parse(content);
        const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };

        Object.entries(dependencies || {}).forEach(([name, version]) => {
          deps.push({
            name,
            version: version.replace(/^[\^~]/, '')
          });
        });
      } catch (e) {
        // Invalid JSON
      }
    } else if (fileType === 'requirements.txt') {
      content.split('\n').forEach(line => {
        const match = line.match(/^([a-zA-Z0-9-_]+)==(.+)$/);
        if (match) {
          deps.push({ name: match[1], version: match[2] });
        }
      });
    }

    return deps;
  }

  /**
   * Check for outdated dependencies
   */
  checkOutdated(dependencies) {
    const outdated = [];

    dependencies.forEach(dep => {
      const latest = this.latestVersions[dep.name];
      if (latest && latest !== dep.version) {
        const updateType = this.getUpdateType(dep.version, latest);
        const cves = this.checkVulnerabilities(dep.name, dep.version);

        outdated.push({
          package: dep.name,
          current: dep.version,
          latest: latest,
          updateType: updateType,
          hasCVE: cves.length > 0,
          cves: cves,
          breakingChanges: updateType === 'major',
          recommendation: this.getRecommendation(updateType, cves.length > 0)
        });
      }
    });

    return outdated;
  }

  /**
   * Get update type (major, minor, patch)
   */
  getUpdateType(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    if (latestParts[0] > currentParts[0]) return 'major';
    if (latestParts[1] > currentParts[1]) return 'minor';
    if (latestParts[2] > currentParts[2]) return 'patch';

    return 'patch';
  }

  /**
   * Check for known vulnerabilities
   */
  checkVulnerabilities(packageName, version) {
    const vulns = this.knownVulnerabilities[packageName];
    if (vulns && vulns[version]) {
      return vulns[version];
    }
    return [];
  }

  /**
   * Get recommendation
   */
  getRecommendation(updateType, hasCVE) {
    if (hasCVE) return 'Upgrade immediately (security fix)';
    if (updateType === 'patch') return 'Safe to upgrade (bug fixes)';
    if (updateType === 'minor') return 'Low risk (new features)';
    if (updateType === 'major') return 'Review breaking changes before upgrading';
    return 'Consider upgrading';
  }

  /**
   * Generate upgrade strategy
   */
  generateUpgradeStrategy(outdated) {
    const immediate = [];
    const lowRisk = [];
    const reviewRequired = [];

    outdated.forEach(dep => {
      const entry = `${dep.package}: ${dep.current} → ${dep.latest}`;

      if (dep.hasCVE) {
        immediate.push(entry + ' (CVE fix)');
      } else if (dep.updateType === 'patch' || dep.updateType === 'minor') {
        lowRisk.push(entry);
      } else if (dep.updateType === 'major') {
        reviewRequired.push(entry + ' (breaking changes)');
      }
    });

    return {
      immediate,
      lowRisk,
      reviewRequired
    };
  }

  /**
   * Generate migration guide
   */
  generateMigrationGuide(outdated) {
    let guide = '# Dependency Upgrade Guide\n\n';

    guide += '## Phase 1: Security Fixes (Do First)\n\n';
    const securityFixes = outdated.filter(d => d.hasCVE);
    if (securityFixes.length > 0) {
      securityFixes.forEach(dep => {
        guide += `### ${dep.package}\n`;
        guide += `- Current: ${dep.current}\n`;
        guide += `- Latest: ${dep.latest}\n`;
        guide += `- CVEs: ${dep.cves.join(', ')}\n`;
        guide += `- Command: \`npm install ${dep.package}@${dep.latest}\`\n\n`;
      });
    } else {
      guide += 'No security vulnerabilities detected.\n\n';
    }

    guide += '## Phase 2: Low-Risk Updates\n\n';
    const lowRisk = outdated.filter(d => !d.hasCVE && d.updateType !== 'major');
    lowRisk.forEach(dep => {
      guide += `- ${dep.package}: ${dep.current} → ${dep.latest}\n`;
    });
    guide += '\n';

    guide += '## Phase 3: Major Updates (Review Required)\n\n';
    const major = outdated.filter(d => d.updateType === 'major');
    if (major.length > 0) {
      major.forEach(dep => {
        guide += `### ${dep.package}\n`;
        guide += `- Current: ${dep.current}\n`;
        guide += `- Latest: ${dep.latest}\n`;
        guide += `- Warning: Breaking changes expected\n`;
        guide += `- Action: Review changelog and migration guide\n\n`;
      });
    }

    return guide;
  }

  /**
   * Generate summary
   */
  generateSummary(outdated, totalVulnerabilities) {
    const total = outdated.length;
    const major = outdated.filter(d => d.updateType === 'major').length;
    const minor = outdated.filter(d => d.updateType === 'minor').length;
    const patch = outdated.filter(d => d.updateType === 'patch').length;

    return {
      totalOutdated: total,
      securityVulnerabilities: totalVulnerabilities,
      majorUpdates: major,
      minorUpdates: minor,
      patchUpdates: patch,
      recommendation: totalVulnerabilities > 0
        ? 'Apply security updates immediately'
        : 'Consider updating to latest versions'
    };
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DependencyUpgradeAssistant;
}

// Demo
if (require.main === module) {
  const assistant = new DependencyUpgradeAssistant();

  const samplePackageJson = `{
    "dependencies": {
      "lodash": "4.17.20",
      "react": "17.0.2",
      "express": "4.17.1"
    }
  }`;

  const result = assistant.analyze(samplePackageJson, {
    fileType: 'auto',
    includeSecurityScan: true,
    includeMigrationGuide: true
  });

  console.log('=== Dependency Analysis ===');
  console.log(JSON.stringify(result, null, 2));
}
