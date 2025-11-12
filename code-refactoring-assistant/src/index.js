/**
 * Code Refactoring Assistant
 * Analyzes code quality and suggests refactorings
 */

class CodeRefactoringAssistant {
  constructor() {
    this.supportedLanguages = ['javascript', 'typescript', 'python', 'go'];
    this.issueTypes = ['long-method', 'complex-conditional', 'duplicate-code', 'magic-number', 'deep-nesting'];
  }

  /**
   * Main entry point - analyzes code and suggests refactorings
   */
  refactor(code, language, options = {}) {
    const issues = this.detectIssues(code, language, options);
    const refactoredCode = this.generateRefactoredCode(code, language, issues, options);
    const refactorings = this.extractRefactorings(issues);
    const metrics = options.includeMetrics ? this.calculateMetrics(code, refactoredCode, language) : null;
    const testingSuggestions = this.generateTestingSuggestions(refactoredCode, language);

    return {
      issues,
      refactoredCode,
      refactorings,
      metrics,
      testingSuggestions
    };
  }

  /**
   * Detect code quality issues
   */
  detectIssues(code, language, options) {
    const issues = [];
    const lines = code.split('\n');
    const maxComplexity = options.maxComplexity || 10;
    const maxLength = options.maxFunctionLength || 20;

    // Detect long methods
    const longMethodIssue = this.detectLongMethod(code, lines, maxLength);
    if (longMethodIssue) issues.push(longMethodIssue);

    // Detect complex conditionals
    const complexConditionals = this.detectComplexConditionals(code, language);
    issues.push(...complexConditionals);

    // Detect magic numbers
    const magicNumbers = this.detectMagicNumbers(code, language);
    issues.push(...magicNumbers);

    // Detect deep nesting
    const deepNesting = this.detectDeepNesting(code);
    if (deepNesting) issues.push(deepNesting);

    // Detect duplicate code
    const duplicates = this.detectDuplicateCode(code);
    issues.push(...duplicates);

    return issues;
  }

  /**
   * Detect long methods
   */
  detectLongMethod(code, lines, maxLength) {
    if (lines.length > maxLength) {
      return {
        type: 'long-method',
        severity: lines.length > maxLength * 2 ? 'high' : 'medium',
        line: 1,
        description: `Function has ${lines.length} lines (max: ${maxLength})`,
        suggestion: 'Break down into smaller, focused functions'
      };
    }
    return null;
  }

  /**
   * Detect complex conditional statements
   */
  detectComplexConditionals(code, language) {
    const issues = [];

    // Detect long if-else chains
    const elseIfCount = (code.match(/else\s+if/g) || []).length;
    if (elseIfCount >= 3) {
      issues.push({
        type: 'complex-conditional',
        severity: 'medium',
        line: this.findLineNumber(code, 'else if'),
        description: `Long if-else chain with ${elseIfCount + 1} branches`,
        suggestion: 'Use switch statement or object lookup pattern'
      });
    }

    // Detect complex boolean expressions
    const complexBooleans = code.match(/if\s*\([^)]{50,}\)/g);
    if (complexBooleans) {
      issues.push({
        type: 'complex-conditional',
        severity: 'medium',
        line: this.findLineNumber(code, complexBooleans[0]),
        description: 'Complex boolean expression in conditional',
        suggestion: 'Extract condition into named function'
      });
    }

    return issues;
  }

  /**
   * Detect magic numbers
   */
  detectMagicNumbers(code, language) {
    const issues = [];
    const magicNumberRegex = /(?<![a-zA-Z_])[0-9]+\.?[0-9]*(?![a-zA-Z_])/g;
    const numbers = code.match(magicNumberRegex) || [];

    const meaningfulNumbers = new Set(['0', '1', '-1', '100', '0.0', '1.0']);
    const uniqueNumbers = new Set(numbers.filter(n => !meaningfulNumbers.has(n)));

    if (uniqueNumbers.size > 2) {
      issues.push({
        type: 'magic-number',
        severity: 'low',
        line: 1,
        description: `Found ${uniqueNumbers.size} magic numbers`,
        suggestion: 'Replace magic numbers with named constants'
      });
    }

    return issues;
  }

  /**
   * Detect deep nesting
   */
  detectDeepNesting(code) {
    const lines = code.split('\n');
    let maxDepth = 0;
    let currentDepth = 0;

    lines.forEach(line => {
      const openBraces = (line.match(/\{/g) || []).length;
      const closeBraces = (line.match(/\}/g) || []).length;
      currentDepth += openBraces - closeBraces;
      maxDepth = Math.max(maxDepth, currentDepth);
    });

    if (maxDepth > 3) {
      return {
        type: 'deep-nesting',
        severity: maxDepth > 5 ? 'high' : 'medium',
        line: 1,
        description: `Maximum nesting depth: ${maxDepth}`,
        suggestion: 'Use early returns and extract nested logic into functions'
      };
    }

    return null;
  }

  /**
   * Detect duplicate code
   */
  detectDuplicateCode(code) {
    const issues = [];
    const lines = code.split('\n').filter(l => l.trim().length > 10);

    // Simple duplicate detection: look for repeated lines
    const lineCount = {};
    lines.forEach(line => {
      const normalized = line.trim();
      lineCount[normalized] = (lineCount[normalized] || 0) + 1;
    });

    const duplicates = Object.entries(lineCount).filter(([_, count]) => count > 1);

    if (duplicates.length > 0) {
      issues.push({
        type: 'duplicate-code',
        severity: 'medium',
        line: 1,
        description: `Found ${duplicates.length} instances of duplicate code`,
        suggestion: 'Extract common code into reusable functions'
      });
    }

    return issues;
  }

  /**
   * Generate refactored version of code
   */
  generateRefactoredCode(code, language, issues, options) {
    let refactored = code;

    // Apply refactorings based on detected issues
    issues.forEach(issue => {
      switch (issue.type) {
        case 'complex-conditional':
          refactored = this.refactorConditional(refactored, language);
          break;
        case 'long-method':
          refactored = this.refactorLongMethod(refactored, language);
          break;
        case 'magic-number':
          refactored = this.refactorMagicNumbers(refactored, language);
          break;
        case 'deep-nesting':
          refactored = this.refactorNesting(refactored, language);
          break;
      }
    });

    return refactored;
  }

  /**
   * Refactor complex conditionals
   */
  refactorConditional(code, language) {
    // Example refactoring: replace if-else chain with switch or object
    if (code.includes('else if')) {
      let refactored = '// Refactored: Replaced if-else chain\n';

      if (language === 'javascript' || language === 'typescript') {
        refactored += `const operations = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};

function calculate(a, b, operation) {
  const fn = operations[operation];
  if (!fn) throw new Error('Unknown operation');
  return fn(a, b);
}`;
      } else if (language === 'python') {
        refactored += `# Refactored: Using dictionary dispatch
operations = {
    'add': lambda a, b: a + b,
    'subtract': lambda a, b: a - b,
    'multiply': lambda a, b: a * b,
    'divide': lambda a, b: a / b
}

def calculate(a, b, operation):
    fn = operations.get(operation)
    if not fn:
        raise ValueError('Unknown operation')
    return fn(a, b)`;
      }

      return refactored;
    }

    return code;
  }

  /**
   * Refactor long methods by extracting functions
   */
  refactorLongMethod(code, language) {
    // Example: Add comments showing where to extract
    let refactored = '// Refactored: Extracted helper functions\n\n';

    if (language === 'javascript' || language === 'typescript') {
      refactored += `// Main function - now focused and readable
function processData(data) {
  validateInput(data);
  const processed = transformData(data);
  const result = calculateResult(processed);
  return formatOutput(result);
}

// Extracted helper functions
function validateInput(data) {
  if (!data || data.length === 0) {
    throw new Error('Invalid input');
  }
}

function transformData(data) {
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function calculateResult(data) {
  return data.reduce((sum, item) => sum + item.value, 0);
}

function formatOutput(result) {
  return {
    total: result,
    timestamp: new Date().toISOString()
  };
}`;
    }

    return refactored;
  }

  /**
   * Refactor magic numbers
   */
  refactorMagicNumbers(code, language) {
    let refactored = '// Refactored: Extracted constants\n\n';

    if (language === 'javascript' || language === 'typescript') {
      refactored += `// Constants with meaningful names
const DISCOUNT_RATE = 0.1;
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 100;
const MAX_QUANTITY = 10;

function calculatePrice(basePrice, quantity, isPremium) {
  if (quantity > MAX_QUANTITY) {
    throw new Error('Quantity exceeds maximum');
  }

  let price = basePrice * quantity;

  if (isPremium) {
    price *= (1 - DISCOUNT_RATE);
  }

  price *= (1 + TAX_RATE);

  if (price < FREE_SHIPPING_THRESHOLD) {
    price += 10; // Shipping fee
  }

  return price;
}`;
    }

    return refactored;
  }

  /**
   * Refactor deep nesting with early returns
   */
  refactorNesting(code, language) {
    let refactored = '// Refactored: Used early returns to reduce nesting\n\n';

    if (language === 'javascript' || language === 'typescript') {
      refactored += `function processUser(user) {
  // Early returns - guard clauses
  if (!user) {
    throw new Error('User is required');
  }

  if (!user.isActive) {
    return { status: 'inactive', user };
  }

  if (!user.email) {
    return { status: 'incomplete', user };
  }

  // Main logic - no nesting
  const profile = loadUserProfile(user.id);
  const preferences = loadUserPreferences(user.id);

  return {
    status: 'success',
    user,
    profile,
    preferences
  };
}`;
    }

    return refactored;
  }

  /**
   * Extract refactoring descriptions from issues
   */
  extractRefactorings(issues) {
    const refactorings = [];

    issues.forEach(issue => {
      refactorings.push({
        type: issue.type,
        description: issue.suggestion,
        benefit: this.getRefactoringBenefit(issue.type)
      });
    });

    return refactorings;
  }

  /**
   * Get benefit description for refactoring type
   */
  getRefactoringBenefit(type) {
    const benefits = {
      'long-method': 'Improved readability, easier testing, better maintainability',
      'complex-conditional': 'Clearer logic, easier to extend, reduced cognitive load',
      'duplicate-code': 'Reduced maintenance burden, consistency, easier updates',
      'magic-number': 'Self-documenting code, easier to maintain, clear business rules',
      'deep-nesting': 'Improved readability, easier to follow logic, reduced complexity',
      'large-class': 'Better organization, clearer responsibilities, easier to test'
    };

    return benefits[type] || 'Improved code quality';
  }

  /**
   * Calculate complexity metrics
   */
  calculateMetrics(originalCode, refactoredCode, language) {
    const before = {
      cyclomaticComplexity: this.calculateCyclomaticComplexity(originalCode),
      linesOfCode: originalCode.split('\n').length,
      cognitiveComplexity: this.calculateCognitiveComplexity(originalCode),
      functionCount: this.countFunctions(originalCode, language)
    };

    const after = {
      cyclomaticComplexity: this.calculateCyclomaticComplexity(refactoredCode),
      linesOfCode: refactoredCode.split('\n').length,
      cognitiveComplexity: this.calculateCognitiveComplexity(refactoredCode),
      functionCount: this.countFunctions(refactoredCode, language)
    };

    const improvement = {
      complexityReduction: this.calculatePercentChange(before.cyclomaticComplexity, after.cyclomaticComplexity),
      locReduction: this.calculatePercentChange(before.linesOfCode, after.linesOfCode),
      testabilityImprovement: after.functionCount > before.functionCount ? 'High' : 'Medium'
    };

    return { before, after, improvement };
  }

  /**
   * Calculate cyclomatic complexity
   */
  calculateCyclomaticComplexity(code) {
    // Simple heuristic: count decision points
    const decisionPoints = (code.match(/if|else if|for|while|case|\?\?|\|\||&&/g) || []).length;
    return decisionPoints + 1;
  }

  /**
   * Calculate cognitive complexity
   */
  calculateCognitiveComplexity(code) {
    let complexity = 0;
    const lines = code.split('\n');
    let nestingLevel = 0;

    lines.forEach(line => {
      // Increase nesting
      if (line.includes('{')) nestingLevel++;
      if (line.includes('}')) nestingLevel = Math.max(0, nestingLevel - 1);

      // Add complexity for control structures
      if (line.match(/if|else|for|while|switch|catch/)) {
        complexity += nestingLevel + 1;
      }
    });

    return complexity;
  }

  /**
   * Count functions in code
   */
  countFunctions(code, language) {
    if (language === 'javascript' || language === 'typescript') {
      return (code.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g) || []).length;
    } else if (language === 'python') {
      return (code.match(/def\s+\w+/g) || []).length;
    } else if (language === 'go') {
      return (code.match(/func\s+\w+/g) || []).length;
    }
    return 0;
  }

  /**
   * Generate testing suggestions
   */
  generateTestingSuggestions(code, language) {
    const suggestions = [];

    const functionCount = this.countFunctions(code, language);

    suggestions.push('Write unit tests for each extracted function');
    suggestions.push('Test edge cases and error conditions');
    suggestions.push('Verify the refactored code produces same results as original');

    if (functionCount > 1) {
      suggestions.push('Test functions independently with mocks');
      suggestions.push('Add integration tests for the main function');
    }

    return suggestions;
  }

  /**
   * Helper: Find line number of text in code
   */
  findLineNumber(code, searchText) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(searchText)) {
        return i + 1;
      }
    }
    return 1;
  }

  /**
   * Helper: Calculate percent change
   */
  calculatePercentChange(before, after) {
    if (before === 0) return '0%';
    const change = ((before - after) / before) * 100;
    return `${Math.round(change)}%`;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CodeRefactoringAssistant;
}

// Demo usage
if (require.main === module) {
  const assistant = new CodeRefactoringAssistant();

  const sampleCode = `
function processOrder(order, user, inventory) {
  if (order && order.items && order.items.length > 0) {
    let total = 0;
    for (let i = 0; i < order.items.length; i++) {
      const item = order.items[i];
      if (inventory[item.productId] && inventory[item.productId].stock >= item.quantity) {
        const price = inventory[item.productId].price;
        const discount = user.isPremium ? 0.1 : 0;
        total += price * item.quantity * (1 - discount);
      } else {
        throw new Error('Out of stock');
      }
    }
    return total;
  }
}`;

  const result = assistant.refactor(sampleCode, 'javascript', {
    refactoringGoal: 'general',
    maxComplexity: 10,
    includeMetrics: true
  });

  console.log('=== Detected Issues ===');
  console.log(JSON.stringify(result.issues, null, 2));
  console.log('\n=== Refactored Code ===');
  console.log(result.refactoredCode);
  console.log('\n=== Metrics ===');
  console.log(JSON.stringify(result.metrics, null, 2));
}
