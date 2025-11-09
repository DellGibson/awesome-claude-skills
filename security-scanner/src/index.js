#!/usr/bin/env node
/**
 * Security Scanner - Demo Implementation
 * Scans code for common security vulnerabilities
 */

class SecurityScanner {
  constructor() {
    this.patterns = {
      critical: {
        eval: {
          pattern: /\beval\s*\(/g,
          message: 'Code injection via eval()',
          cwe: 'CWE-95',
          category: 'code-injection'
        },
        exec: {
          pattern: /\bexec\s*\(/g,
          message: 'Code injection via exec()',
          cwe: 'CWE-95',
          category: 'code-injection'
        },
        hardcodedPassword: {
          pattern: /(password|passwd|pwd)\s*=\s*['"][^'"]+['"]/gi,
          message: 'Hardcoded password',
          cwe: 'CWE-798',
          category: 'hardcoded-secrets'
        },
        sqlInjection: {
          pattern: /f["']SELECT.*\{|["']SELECT.*\+.*\+|["']SELECT.*%/g,
          message: 'SQL injection vulnerability',
          cwe: 'CWE-89',
          category: 'injection'
        },
        commandInjection: {
          pattern: /os\.system\(|subprocess.*shell\s*=\s*True/g,
          message: 'Command injection risk',
          cwe: 'CWE-78',
          category: 'injection'
        }
      },
      high: {
        md5: {
          pattern: /hashlib\.md5\(|crypto\.createHash\(['"]md5['"]\)/g,
          message: 'Weak cryptography: MD5',
          cwe: 'CWE-327',
          category: 'weak-crypto'
        },
        sha1: {
          pattern: /hashlib\.sha1\(|crypto\.createHash\(['"]sha1['"]\)/g,
          message: 'Weak cryptography: SHA1',
          cwe: 'CWE-327',
          category: 'weak-crypto'
        },
        mathRandom: {
          pattern: /Math\.random\(\)|random\.random\(\)/g,
          message: 'Weak random number generation',
          cwe: 'CWE-338',
          category: 'weak-crypto'
        },
        sslVerifyFalse: {
          pattern: /verify\s*=\s*False|rejectUnauthorized\s*:\s*false/g,
          message: 'SSL verification disabled',
          cwe: 'CWE-295',
          category: 'insecure-config'
        }
      },
      medium: {
        innerHTML: {
          pattern: /\.innerHTML\s*=/g,
          message: 'XSS risk via innerHTML',
          cwe: 'CWE-79',
          category: 'xss'
        },
        todoSecurity: {
          pattern: /TODO.*security|FIXME.*security|XXX.*security/gi,
          message: 'Security TODO comment',
          cwe: 'CWE-1266',
          category: 'code-quality'
        }
      }
    };
  }

  /**
   * Scan code for security vulnerabilities
   * @param {string} code - Source code to scan
   * @param {object} options - Scan options
   * @returns {object} Scan results with findings and score
   */
  scan(code, options = {}) {
    const language = options.language || this.detectLanguage(code);
    const findings = [];

    let id = 1;
    for (const [severity, patterns] of Object.entries(this.patterns)) {
      for (const [key, config] of Object.entries(patterns)) {
        const matches = [...code.matchAll(config.pattern)];

        for (const match of matches) {
          const lineNumber = this.getLineNumber(code, match.index);
          const lineCode = this.getLineCode(code, lineNumber);

          findings.push({
            id: `SEC-${id.toString().padStart(3, '0')}`,
            title: config.message,
            severity: severity.toUpperCase(),
            category: config.category,
            lineNumber,
            code: lineCode.trim(),
            description: this.getDescription(config.category),
            impact: this.getImpact(severity),
            remediation: this.getRemediation(config.category),
            cwe: config.cwe
          });

          id++;
        }
      }
    }

    const issuesBySeverity = this.groupBySeverity(findings);
    const securityScore = this.calculateSecurityScore(issuesBySeverity);
    const riskLevel = this.getRiskLevel(securityScore, issuesBySeverity);
    const recommendations = this.generateRecommendations(findings);

    return {
      securityScore: Math.round(securityScore),
      totalIssues: findings.length,
      issuesBySeverity,
      findings: findings.sort((a, b) => this.severityWeight(b.severity) - this.severityWeight(a.severity)),
      riskLevel,
      recommendations,
      language
    };
  }

  detectLanguage(code) {
    if (code.includes('def ') || code.includes('import ')) return 'python';
    if (code.includes('function ') || code.includes('const ')) return 'javascript';
    return 'unknown';
  }

  getLineNumber(code, index) {
    return code.substring(0, index).split('\n').length;
  }

  getLineCode(code, lineNumber) {
    return code.split('\n')[lineNumber - 1] || '';
  }

  groupBySeverity(findings) {
    return {
      critical: findings.filter(f => f.severity === 'CRITICAL').length,
      high: findings.filter(f => f.severity === 'HIGH').length,
      medium: findings.filter(f => f.severity === 'MEDIUM').length,
      low: findings.filter(f => f.severity === 'LOW').length
    };
  }

  calculateSecurityScore(issuesBySeverity) {
    const score = 100 - (
      (issuesBySeverity.critical * 30) +
      (issuesBySeverity.high * 15) +
      (issuesBySeverity.medium * 5) +
      (issuesBySeverity.low * 1)
    );
    return Math.max(0, Math.min(100, score));
  }

  getRiskLevel(score, issues) {
    if (issues.critical > 0) return 'CRITICAL';
    if (score < 50) return 'HIGH';
    if (score < 75) return 'MEDIUM';
    if (score < 90) return 'LOW';
    return 'SAFE';
  }

  severityWeight(severity) {
    const weights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    return weights[severity] || 0;
  }

  getDescription(category) {
    const descriptions = {
      'code-injection': 'Allows execution of arbitrary code',
      'injection': 'Enables injection of malicious commands or queries',
      'hardcoded-secrets': 'Credentials exposed in source code',
      'weak-crypto': 'Uses cryptographically weak algorithms',
      'xss': 'Cross-site scripting vulnerability',
      'insecure-config': 'Insecure configuration weakens security',
      'code-quality': 'Security-related code quality issue'
    };
    return descriptions[category] || 'Security issue detected';
  }

  getImpact(severity) {
    const impacts = {
      critical: 'Complete system compromise, data breach, or unauthorized access',
      high: 'Significant security weakness that could lead to exploitation',
      medium: 'Moderate security concern that should be addressed',
      low: 'Minor issue with limited security impact'
    };
    return impacts[severity] || 'Security impact';
  }

  getRemediation(category) {
    const remediations = {
      'code-injection': 'Never use eval() or exec() with user input. Use safe alternatives.',
      'injection': 'Use parameterized queries and input validation',
      'hardcoded-secrets': 'Move credentials to environment variables or secrets management',
      'weak-crypto': 'Use strong cryptographic algorithms (e.g., SHA-256, bcrypt)',
      'xss': 'Sanitize user input and use secure DOM methods',
      'insecure-config': 'Enable security features and use secure defaults',
      'code-quality': 'Address security TODOs before deployment'
    };
    return remediations[category] || 'Review and fix security issue';
  }

  generateRecommendations(findings) {
    const recommendations = [];
    const criticalFindings = findings.filter(f => f.severity === 'CRITICAL');
    const highFindings = findings.filter(f => f.severity === 'HIGH');

    criticalFindings.slice(0, 3).forEach(f => {
      recommendations.push(`FIX IMMEDIATELY: ${f.title} (Line ${f.lineNumber})`);
    });

    highFindings.slice(0, 2).forEach(f => {
      recommendations.push(`HIGH PRIORITY: ${f.title} (Line ${f.lineNumber})`);
    });

    if (recommendations.length === 0 && findings.length > 0) {
      recommendations.push('Address all identified issues before deployment');
    }

    if (recommendations.length === 0) {
      recommendations.push('No critical security issues detected');
    }

    return recommendations;
  }

  formatOutput(result) {
    console.log('\n🔒 SECURITY SCAN RESULTS\n');
    console.log(`Overall Security Score: ${result.securityScore}/100 ${this.getScoreEmoji(result.securityScore)}`);
    console.log(`Language: ${result.language}\n`);

    console.log(`Total Issues: ${result.totalIssues}`);
    console.log(`  🔴 Critical: ${result.issuesBySeverity.critical}`);
    console.log(`  🟠 High: ${result.issuesBySeverity.high}`);
    console.log(`  🟡 Medium: ${result.issuesBySeverity.medium}`);
    console.log(`  🟢 Low: ${result.issuesBySeverity.low}`);
    console.log(`\nRisk Level: ${this.getRiskEmoji(result.riskLevel)} ${result.riskLevel}\n`);

    if (result.findings.length > 0) {
      console.log('━'.repeat(60));
      console.log('\n📋 FINDINGS\n');

      result.findings.forEach((finding, index) => {
        const icon = this.getSeverityIcon(finding.severity);
        console.log(`${index + 1}. ${icon} ${finding.title}`);
        console.log(`   Severity: ${finding.severity} | CWE: ${finding.cwe}`);
        console.log(`   Line ${finding.lineNumber}: ${finding.code}`);
        console.log(`   Impact: ${finding.impact}`);
        console.log(`   Fix: ${finding.remediation}\n`);
      });
    }

    if (result.recommendations.length > 0) {
      console.log('━'.repeat(60));
      console.log('\n💡 RECOMMENDATIONS\n');
      result.recommendations.forEach((rec, i) => {
        console.log(`${i + 1}. ${rec}`);
      });
      console.log('');
    }
  }

  getScoreEmoji(score) {
    if (score >= 90) return '✅ Excellent';
    if (score >= 75) return '👍 Good';
    if (score >= 50) return '⚠️ Fair';
    if (score >= 25) return '❌ Poor';
    return '🔴 Critical';
  }

  getRiskEmoji(level) {
    const emojis = {
      CRITICAL: '🔴',
      HIGH: '🟠',
      MEDIUM: '🟡',
      LOW: '🟢',
      SAFE: '✅'
    };
    return emojis[level] || '❓';
  }

  getSeverityIcon(severity) {
    const icons = {
      CRITICAL: '🔴',
      HIGH: '🟠',
      MEDIUM: '🟡',
      LOW: '🟢'
    };
    return icons[severity] || '⚪';
  }
}

// CLI Interface
if (require.main === module) {
  const sampleCode = `
import hashlib
import os

# Database credentials
DB_PASSWORD = "admin123"

def authenticate(username, password):
    password_hash = hashlib.md5(password.encode()).hexdigest()
    query = f"SELECT * FROM users WHERE username='{username}'"
    return execute_query(query)

def run_command(cmd):
    os.system(cmd)
  `.trim();

  const scanner = new SecurityScanner();
  const result = scanner.scan(sampleCode);
  scanner.formatOutput(result);
}

module.exports = SecurityScanner;
