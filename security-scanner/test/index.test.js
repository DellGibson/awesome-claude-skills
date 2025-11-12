/**
 * Tests for Security Scanner
 */

const SecurityScanner = require('../src/index');

describe('SecurityScanner', () => {
  let scanner;

  beforeEach(() => {
    scanner = new SecurityScanner();
  });

  describe('constructor', () => {
    it('should initialize with vulnerability patterns', () => {
      expect(scanner.patterns).toBeDefined();
      expect(scanner.patterns.critical).toBeDefined();
      expect(scanner.patterns.high).toBeDefined();
      expect(scanner.patterns.medium).toBeDefined();
    });

    it('should have patterns for critical vulnerabilities', () => {
      expect(scanner.patterns.critical.eval).toBeDefined();
      expect(scanner.patterns.critical.hardcodedPassword).toBeDefined();
      expect(scanner.patterns.critical.sqlInjection).toBeDefined();
    });

    it('should have CWE references', () => {
      expect(scanner.patterns.critical.eval.cwe).toBe('CWE-95');
      expect(scanner.patterns.critical.hardcodedPassword.cwe).toBe('CWE-798');
      expect(scanner.patterns.critical.sqlInjection.cwe).toBe('CWE-89');
    });
  });

  describe('scan', () => {
    it('should scan code and return results', () => {
      const code = 'const x = 1;';
      const result = scanner.scan(code);

      expect(result).toHaveProperty('securityScore');
      expect(result).toHaveProperty('totalIssues');
      expect(result).toHaveProperty('issuesBySeverity');
      expect(result).toHaveProperty('findings');
      expect(result).toHaveProperty('riskLevel');
      expect(result).toHaveProperty('recommendations');
      expect(result).toHaveProperty('language');
    });

    it('should detect eval() vulnerability', () => {
      const code = 'eval(userInput);';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.title.includes('eval'))).toBe(true);
    });

    it('should detect hardcoded passwords', () => {
      const code = 'const password = "admin123";';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.category === 'hardcoded-secrets')).toBe(true);
    });

    it('should detect SQL injection vulnerabilities', () => {
      const code = 'query = f"SELECT * FROM users WHERE id={user_id}"';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.category === 'injection')).toBe(true);
    });

    it('should detect command injection', () => {
      const code = 'os.system(user_command)';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.title.includes('Command injection'))).toBe(true);
    });

    it('should detect weak cryptography (MD5)', () => {
      const code = 'hashlib.md5(password)';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.category === 'weak-crypto')).toBe(true);
    });

    it('should detect weak cryptography (SHA1)', () => {
      const code = 'crypto.createHash("sha1")';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.message.includes('SHA1'))).toBe(true);
    });

    it('should detect weak random number generation', () => {
      const code = 'const token = Math.random();';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.title.includes('random'))).toBe(true);
    });

    it('should detect disabled SSL verification', () => {
      const code = 'requests.get(url, verify=False)';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.title.includes('SSL'))).toBe(true);
    });

    it('should detect XSS via innerHTML', () => {
      const code = 'element.innerHTML = userInput;';
      const result = scanner.scan(code);

      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.findings.some(f => f.category === 'xss')).toBe(true);
    });

    it('should return 100 score for clean code', () => {
      const code = 'const x = 1; const y = 2; return x + y;';
      const result = scanner.scan(code);

      expect(result.securityScore).toBe(100);
      expect(result.totalIssues).toBe(0);
    });

    it('should lower score for vulnerable code', () => {
      const code = 'eval(userInput); password = "admin123"; hashlib.md5(data)';
      const result = scanner.scan(code);

      expect(result.securityScore).toBeLessThan(50);
      expect(result.totalIssues).toBeGreaterThan(2);
    });
  });

  describe('detectLanguage', () => {
    it('should detect Python', () => {
      const code = 'def hello():\n    import os';
      const language = scanner.detectLanguage(code);
      expect(language).toBe('python');
    });

    it('should detect JavaScript', () => {
      const code = 'function hello() { const x = 1; }';
      const language = scanner.detectLanguage(code);
      expect(language).toBe('javascript');
    });

    it('should return unknown for ambiguous code', () => {
      const code = 'x = 1';
      const language = scanner.detectLanguage(code);
      expect(language).toBe('unknown');
    });
  });

  describe('getLineNumber', () => {
    it('should get correct line number', () => {
      const code = 'line1\nline2\nline3';
      const index = code.indexOf('line3');
      const lineNumber = scanner.getLineNumber(code, index);
      expect(lineNumber).toBe(3);
    });

    it('should return 1 for first line', () => {
      const code = 'first line\nsecond line';
      const lineNumber = scanner.getLineNumber(code, 0);
      expect(lineNumber).toBe(1);
    });
  });

  describe('getLineCode', () => {
    it('should extract line content', () => {
      const code = 'line1\nline2\nline3';
      const lineCode = scanner.getLineCode(code, 2);
      expect(lineCode).toBe('line2');
    });

    it('should return empty string for invalid line', () => {
      const code = 'line1\nline2';
      const lineCode = scanner.getLineCode(code, 10);
      expect(lineCode).toBe('');
    });
  });

  describe('groupBySeverity', () => {
    it('should group findings by severity', () => {
      const findings = [
        { severity: 'CRITICAL' },
        { severity: 'CRITICAL' },
        { severity: 'HIGH' },
        { severity: 'MEDIUM' },
        { severity: 'LOW' }
      ];

      const grouped = scanner.groupBySeverity(findings);
      expect(grouped.critical).toBe(2);
      expect(grouped.high).toBe(1);
      expect(grouped.medium).toBe(1);
      expect(grouped.low).toBe(1);
    });

    it('should return zeros for no findings', () => {
      const grouped = scanner.groupBySeverity([]);
      expect(grouped.critical).toBe(0);
      expect(grouped.high).toBe(0);
      expect(grouped.medium).toBe(0);
      expect(grouped.low).toBe(0);
    });
  });

  describe('calculateSecurityScore', () => {
    it('should return 100 for no issues', () => {
      const issues = { critical: 0, high: 0, medium: 0, low: 0 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBe(100);
    });

    it('should heavily penalize critical issues', () => {
      const issues = { critical: 1, high: 0, medium: 0, low: 0 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBeLessThanOrEqual(70);
    });

    it('should penalize high issues significantly', () => {
      const issues = { critical: 0, high: 1, medium: 0, low: 0 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBeLessThan(100);
      expect(score).toBeGreaterThan(70);
    });

    it('should lightly penalize low issues', () => {
      const issues = { critical: 0, high: 0, medium: 0, low: 5 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBeGreaterThan(90);
    });

    it('should not go below 0', () => {
      const issues = { critical: 10, high: 10, medium: 10, low: 10 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBeGreaterThanOrEqual(0);
    });

    it('should not exceed 100', () => {
      const issues = { critical: -5, high: 0, medium: 0, low: 0 };
      const score = scanner.calculateSecurityScore(issues);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('getRiskLevel', () => {
    it('should return CRITICAL for critical issues', () => {
      const issues = { critical: 1, high: 0, medium: 0, low: 0 };
      const level = scanner.getRiskLevel(80, issues);
      expect(level).toBe('CRITICAL');
    });

    it('should return HIGH for low scores', () => {
      const issues = { critical: 0, high: 5, medium: 0, low: 0 };
      const level = scanner.getRiskLevel(40, issues);
      expect(level).toBe('HIGH');
    });

    it('should return MEDIUM for moderate scores', () => {
      const issues = { critical: 0, high: 0, medium: 5, low: 0 };
      const level = scanner.getRiskLevel(65, issues);
      expect(level).toBe('MEDIUM');
    });

    it('should return LOW for good scores', () => {
      const issues = { critical: 0, high: 0, medium: 0, low: 2 };
      const level = scanner.getRiskLevel(85, issues);
      expect(level).toBe('LOW');
    });

    it('should return SAFE for excellent scores', () => {
      const issues = { critical: 0, high: 0, medium: 0, low: 0 };
      const level = scanner.getRiskLevel(95, issues);
      expect(level).toBe('SAFE');
    });
  });

  describe('severityWeight', () => {
    it('should assign correct weights', () => {
      expect(scanner.severityWeight('CRITICAL')).toBe(4);
      expect(scanner.severityWeight('HIGH')).toBe(3);
      expect(scanner.severityWeight('MEDIUM')).toBe(2);
      expect(scanner.severityWeight('LOW')).toBe(1);
    });

    it('should return 0 for unknown severity', () => {
      expect(scanner.severityWeight('UNKNOWN')).toBe(0);
    });
  });

  describe('getDescription', () => {
    it('should return description for code injection', () => {
      const desc = scanner.getDescription('code-injection');
      expect(desc).toContain('code');
    });

    it('should return description for hardcoded secrets', () => {
      const desc = scanner.getDescription('hardcoded-secrets');
      expect(desc).toContain('Credentials');
    });

    it('should return description for weak crypto', () => {
      const desc = scanner.getDescription('weak-crypto');
      expect(desc).toContain('crypto');
    });

    it('should return default for unknown category', () => {
      const desc = scanner.getDescription('unknown-category');
      expect(desc).toBeTruthy();
    });
  });

  describe('getImpact', () => {
    it('should return impact for critical severity', () => {
      const impact = scanner.getImpact('critical');
      expect(impact).toContain('system');
    });

    it('should return impact for high severity', () => {
      const impact = scanner.getImpact('high');
      expect(impact).toBeTruthy();
    });

    it('should return impact for medium severity', () => {
      const impact = scanner.getImpact('medium');
      expect(impact).toBeTruthy();
    });

    it('should return impact for low severity', () => {
      const impact = scanner.getImpact('low');
      expect(impact).toBeTruthy();
    });
  });

  describe('getRemediation', () => {
    it('should provide remediation for code injection', () => {
      const remediation = scanner.getRemediation('code-injection');
      expect(remediation).toContain('eval');
    });

    it('should provide remediation for injection', () => {
      const remediation = scanner.getRemediation('injection');
      expect(remediation).toContain('parameterized');
    });

    it('should provide remediation for hardcoded secrets', () => {
      const remediation = scanner.getRemediation('hardcoded-secrets');
      expect(remediation).toContain('environment');
    });

    it('should provide remediation for weak crypto', () => {
      const remediation = scanner.getRemediation('weak-crypto');
      expect(remediation).toContain('SHA-256');
    });

    it('should provide remediation for XSS', () => {
      const remediation = scanner.getRemediation('xss');
      expect(remediation).toContain('Sanitize');
    });
  });

  describe('generateRecommendations', () => {
    it('should prioritize critical findings', () => {
      const findings = [
        { severity: 'CRITICAL', title: 'Critical Issue', lineNumber: 1 },
        { severity: 'HIGH', title: 'High Issue', lineNumber: 2 }
      ];

      const recommendations = scanner.generateRecommendations(findings);
      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toContain('IMMEDIATELY');
    });

    it('should include high priority findings', () => {
      const findings = [
        { severity: 'HIGH', title: 'High Issue', lineNumber: 1 }
      ];

      const recommendations = scanner.generateRecommendations(findings);
      expect(recommendations.some(r => r.includes('HIGH PRIORITY'))).toBe(true);
    });

    it('should return positive message for clean code', () => {
      const recommendations = scanner.generateRecommendations([]);
      expect(recommendations[0]).toContain('No critical');
    });

    it('should limit number of recommendations', () => {
      const findings = Array(20).fill(null).map((_, i) => ({
        severity: 'CRITICAL',
        title: `Issue ${i}`,
        lineNumber: i
      }));

      const recommendations = scanner.generateRecommendations(findings);
      expect(recommendations.length).toBeLessThan(10);
    });
  });

  describe('findings structure', () => {
    it('should include all required fields', () => {
      const code = 'eval(userInput)';
      const result = scanner.scan(code);
      const finding = result.findings[0];

      expect(finding).toHaveProperty('id');
      expect(finding).toHaveProperty('title');
      expect(finding).toHaveProperty('severity');
      expect(finding).toHaveProperty('category');
      expect(finding).toHaveProperty('lineNumber');
      expect(finding).toHaveProperty('code');
      expect(finding).toHaveProperty('description');
      expect(finding).toHaveProperty('impact');
      expect(finding).toHaveProperty('remediation');
      expect(finding).toHaveProperty('cwe');
    });

    it('should format finding IDs correctly', () => {
      const code = 'eval(x); eval(y); eval(z)';
      const result = scanner.scan(code);

      expect(result.findings[0].id).toMatch(/^SEC-\d{3}$/);
      expect(result.findings[1].id).toMatch(/^SEC-\d{3}$/);
    });

    it('should sort findings by severity', () => {
      const code = `
        element.innerHTML = x;
        hashlib.md5(password);
        eval(userInput);
      `;
      const result = scanner.scan(code);

      // First finding should be highest severity
      const severities = result.findings.map(f => scanner.severityWeight(f.severity));
      for (let i = 0; i < severities.length - 1; i++) {
        expect(severities[i]).toBeGreaterThanOrEqual(severities[i + 1]);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle empty code', () => {
      const result = scanner.scan('');
      expect(result.securityScore).toBe(100);
      expect(result.totalIssues).toBe(0);
    });

    it('should handle multiline code', () => {
      const code = `
        def authenticate(username, password):
            password_hash = hashlib.md5(password.encode())
            query = f"SELECT * FROM users WHERE username='{username}'"
            return execute_query(query)
      `;
      const result = scanner.scan(code);
      expect(result.findings.length).toBeGreaterThan(0);
    });

    it('should handle comments in code', () => {
      const code = '// eval is dangerous\nconst x = 1;';
      const result = scanner.scan(code);
      expect(result.securityScore).toBe(100);
    });

    it('should detect multiple vulnerabilities on same line', () => {
      const code = 'eval(x); password = "admin123"';
      const result = scanner.scan(code);
      expect(result.findings.length).toBeGreaterThan(1);
    });

    it('should handle code with special regex characters', () => {
      const code = 'const regex = /test$/;';
      const result = scanner.scan(code);
      expect(result).toHaveProperty('securityScore');
    });
  });

  describe('integration', () => {
    it('should comprehensively scan Python code', () => {
      const code = `
import hashlib
import os

DB_PASSWORD = "admin123"

def authenticate(username, password):
    password_hash = hashlib.md5(password.encode()).hexdigest()
    query = f"SELECT * FROM users WHERE username='{username}'"
    return execute_query(query)

def run_command(cmd):
    os.system(cmd)
      `.trim();

      const result = scanner.scan(code);

      expect(result.language).toBe('python');
      expect(result.totalIssues).toBeGreaterThan(3);
      expect(result.securityScore).toBeLessThan(50);
      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.issuesBySeverity.critical).toBeGreaterThan(0);
      expect(result.findings.length).toBeGreaterThan(0);
      expect(result.recommendations.length).toBeGreaterThan(0);

      // Check for specific vulnerabilities
      expect(result.findings.some(f => f.category === 'hardcoded-secrets')).toBe(true);
      expect(result.findings.some(f => f.category === 'weak-crypto')).toBe(true);
      expect(result.findings.some(f => f.category === 'injection')).toBe(true);
    });

    it('should comprehensively scan JavaScript code', () => {
      const code = `
const crypto = require('crypto');

const apiKey = "secret-key-12345";

function hashPassword(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}

function setContent(html) {
  document.getElementById('content').innerHTML = html;
}

function generateToken() {
  return Math.random().toString(36);
}
      `.trim();

      const result = scanner.scan(code);

      expect(result.language).toBe('javascript');
      expect(result.totalIssues).toBeGreaterThan(2);
      expect(result.securityScore).toBeLessThan(70);
      expect(result.findings.some(f => f.category === 'weak-crypto')).toBe(true);
      expect(result.findings.some(f => f.category === 'xss')).toBe(true);
    });

    it('should provide actionable security report', () => {
      const code = 'eval(userInput); password = "admin123"';
      const result = scanner.scan(code);

      // Should have findings with all necessary information
      result.findings.forEach(finding => {
        expect(finding.title).toBeTruthy();
        expect(finding.severity).toBeTruthy();
        expect(finding.remediation).toBeTruthy();
        expect(finding.cwe).toBeTruthy();
      });

      // Should have recommendations
      expect(result.recommendations.length).toBeGreaterThan(0);

      // Should have accurate statistics
      expect(result.totalIssues).toBe(result.findings.length);
    });
  });
});
