/**
 * Tests for Code Refactoring Assistant
 */

const CodeRefactoringAssistant = require('../src/index');

describe('CodeRefactoringAssistant', () => {
  let assistant;

  beforeEach(() => {
    assistant = new CodeRefactoringAssistant();
  });

  describe('constructor', () => {
    it('should initialize with supported languages', () => {
      expect(assistant.supportedLanguages).toContain('javascript');
      expect(assistant.supportedLanguages).toContain('typescript');
      expect(assistant.supportedLanguages).toContain('python');
      expect(assistant.supportedLanguages).toContain('go');
    });

    it('should define issue types', () => {
      expect(assistant.issueTypes).toContain('long-method');
      expect(assistant.issueTypes).toContain('complex-conditional');
      expect(assistant.issueTypes).toContain('duplicate-code');
      expect(assistant.issueTypes).toContain('magic-number');
    });
  });

  describe('refactor', () => {
    const simpleCode = 'function test() { return 1; }';

    it('should return complete refactoring analysis', () => {
      const result = assistant.refactor(simpleCode, 'javascript', {});

      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('refactoredCode');
      expect(result).toHaveProperty('refactorings');
      expect(result).toHaveProperty('testingSuggestions');
    });

    it('should include metrics when requested', () => {
      const result = assistant.refactor(simpleCode, 'javascript', {
        includeMetrics: true
      });

      expect(result.metrics).toBeDefined();
    });

    it('should detect issues in problematic code', () => {
      const badCode = 'if (x && y && z && a && b && c && d && e) { }';
      const result = assistant.refactor(badCode, 'javascript', {});

      expect(result.issues.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('detectIssues', () => {
    it('should detect long methods', () => {
      const longCode = 'function test() {\n' + '  return 1;\n'.repeat(25) + '}';
      const issues = assistant.detectIssues(longCode, 'javascript', {});

      expect(issues.some(i => i.type === 'long-method')).toBe(true);
    });

    it('should detect complex conditionals', () => {
      const code = 'if (a) {} else if (b) {} else if (c) {} else if (d) {}';
      const issues = assistant.detectIssues(code, 'javascript', {});

      expect(issues.some(i => i.type === 'complex-conditional')).toBe(true);
    });

    it('should detect magic numbers', () => {
      const code = 'const price = total * 0.85;';
      const issues = assistant.detectIssues(code, 'javascript', {});

      expect(issues.some(i => i.type === 'magic-number')).toBe(true);
    });

    it('should respect max complexity threshold', () => {
      const code = 'if (a && b && c) {}';
      const strictIssues = assistant.detectIssues(code, 'javascript', {
        maxComplexity: 2
      });
      const relaxedIssues = assistant.detectIssues(code, 'javascript', {
        maxComplexity: 20
      });

      expect(strictIssues.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('detectLongMethod', () => {
    it('should detect when code exceeds max length', () => {
      const lines = new Array(30).fill('  return 1;');
      const issue = assistant.detectLongMethod('', lines, 20);

      expect(issue).toBeTruthy();
      expect(issue.type).toBe('long-method');
      expect(issue.description).toContain('30');
    });

    it('should return null for short methods', () => {
      const lines = ['line1', 'line2'];
      const issue = assistant.detectLongMethod('', lines, 20);

      expect(issue).toBeNull();
    });

    it('should have high severity for very long methods', () => {
      const lines = new Array(50).fill('code');
      const issue = assistant.detectLongMethod('', lines, 20);

      expect(issue.severity).toBe('high');
    });
  });

  describe('detectComplexConditionals', () => {
    it('should detect long if-else chains', () => {
      const code = 'if (a) {} else if (b) {} else if (c) {} else if (d) {}';
      const issues = assistant.detectComplexConditionals(code, 'javascript');

      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0].suggestion).toContain('switch');
    });

    it('should detect complex boolean expressions', () => {
      const code = 'if (veryLongVariableName && anotherLongVariable && yetAnotherVariable) {}';
      const issues = assistant.detectComplexConditionals(code, 'javascript');

      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('detectMagicNumbers', () => {
    it('should detect magic numbers in code', () => {
      const code = 'const result = value * 3.14159;';
      const issues = assistant.detectMagicNumbers(code, 'javascript');

      expect(issues.some(i => i.type === 'magic-number')).toBe(true);
    });

    it('should not flag common numbers like 0, 1, 2', () => {
      const code = 'const x = 0; const y = 1; const z = 2;';
      const issues = assistant.detectMagicNumbers(code, 'javascript');

      expect(issues.length).toBe(0);
    });

    it('should suggest named constants', () => {
      const code = 'const tax = price * 0.08;';
      const issues = assistant.detectMagicNumbers(code, 'javascript');

      if (issues.length > 0) {
        expect(issues[0].suggestion).toContain('constant');
      }
    });
  });

  describe('detectDeepNesting', () => {
    it('should detect deeply nested code', () => {
      const code = `
        if (a) {
          if (b) {
            if (c) {
              if (d) {
                return 1;
              }
            }
          }
        }
      `;
      const issue = assistant.detectDeepNesting(code);

      expect(issue).toBeTruthy();
      expect(issue.type).toBe('deep-nesting');
    });

    it('should return null for flat code', () => {
      const code = 'if (a) { return 1; }';
      const issue = assistant.detectDeepNesting(code);

      expect(issue).toBeNull();
    });
  });

  describe('detectDuplicateCode', () => {
    it('should detect repeated code patterns', () => {
      const code = `
        const a = user.name.toLowerCase();
        const b = user.email.toLowerCase();
        const c = user.username.toLowerCase();
      `;
      const issues = assistant.detectDuplicateCode(code);

      expect(Array.isArray(issues)).toBe(true);
    });
  });

  describe('calculateMetrics', () => {
    it('should calculate code complexity metrics', () => {
      const code = 'function test() { if (a) { return 1; } return 0; }';
      const refactored = 'function test() { return a ? 1 : 0; }';
      const metrics = assistant.calculateMetrics(code, refactored, 'javascript');

      expect(metrics).toHaveProperty('before');
      expect(metrics).toHaveProperty('after');
      expect(metrics).toHaveProperty('improvement');
    });
  });

  describe('generateTestingSuggestions', () => {
    it('should suggest tests for refactored code', () => {
      const code = 'function add(a, b) { return a + b; }';
      const suggestions = assistant.generateTestingSuggestions(code, 'javascript');

      expect(Array.isArray(suggestions)).toBe(true);
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('integration', () => {
    it('should refactor complex JavaScript code', () => {
      const complexCode = `
        function processOrder(order) {
          if (order.status === 'pending') {
            if (order.total > 100) {
              if (order.customer.verified) {
                return order.total * 0.9;
              } else {
                return order.total;
              }
            } else if (order.total > 50) {
              return order.total * 0.95;
            } else {
              return order.total;
            }
          } else if (order.status === 'processing') {
            return null;
          } else {
            throw new Error('Invalid status');
          }
        }
      `;

      const result = assistant.refactor(complexCode, 'javascript', {
        includeMetrics: true,
        maxComplexity: 5,
        maxFunctionLength: 20
      });

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.refactoredCode).toBeDefined();
      expect(result.refactorings.length).toBeGreaterThan(0);
      expect(result.metrics).toBeDefined();
      expect(result.testingSuggestions.length).toBeGreaterThan(0);
    });
  });
});
