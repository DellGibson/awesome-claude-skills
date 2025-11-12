/**
 * Performance Profiler & Optimizer
 * Analyzes code performance and suggests optimizations
 */

class PerformanceProfilerOptimizer {
  constructor() {
    this.languages = ['javascript', 'python'];
  }

  /**
   * Analyze code performance
   */
  analyze(code, language, options = {}) {
    const bottlenecks = this.detectBottlenecks(code, language);
    const complexity = this.calculateComplexity(code, language);
    const optimizedCode = this.generateOptimizedCode(code, language, bottlenecks);
    const optimizedComplexity = this.calculateComplexity(optimizedCode, language);
    const improvements = this.calculateImprovements(complexity, optimizedComplexity);
    const suggestions = this.generateSuggestions(bottlenecks);

    return {
      bottlenecks,
      complexity,
      optimizedCode,
      optimizedComplexity,
      improvements,
      suggestions
    };
  }

  /**
   * Detect performance bottlenecks
   */
  detectBottlenecks(code, language) {
    const bottlenecks = [];

    // Nested loops
    const nestedLoopDepth = this.detectNestedLoops(code);
    if (nestedLoopDepth >= 2) {
      bottlenecks.push({
        type: 'nested-loop',
        description: `${nestedLoopDepth}-level nested loops detected`,
        severity: nestedLoopDepth > 2 ? 'critical' : 'high',
        line: this.findPattern(code, 'for')
      });
    }

    // Array operations in loops
    if (code.match(/for.*{[\s\S]*?(indexOf|includes|find)\(/)) {
      bottlenecks.push({
        type: 'inefficient-search',
        description: 'Array search in loop (consider using Set or Map)',
        severity: 'medium',
        line: this.findPattern(code, 'indexOf')
      });
    }

    // Repeated calculations
    if (code.match(/for.*{[\s\S]*?\.length/g)?.length > 1) {
      bottlenecks.push({
        type: 'repeated-calculation',
        description: 'Repeated array length calculation in loop',
        severity: 'low',
        line: this.findPattern(code, '.length')
      });
    }

    return bottlenecks;
  }

  /**
   * Detect nested loops depth
   */
  detectNestedLoops(code) {
    let maxDepth = 0;
    let currentDepth = 0;
    const lines = code.split('\n');

    lines.forEach(line => {
      if (line.match(/for\s*\(|while\s*\(/)) {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      }
      if (line.includes('}')) {
        currentDepth = Math.max(0, currentDepth - 1);
      }
    });

    return maxDepth;
  }

  /**
   * Calculate Big O complexity
   */
  calculateComplexity(code, language) {
    const nestedDepth = this.detectNestedLoops(code);

    let timeComplexity = 'O(1)';
    if (nestedDepth === 1) timeComplexity = 'O(n)';
    else if (nestedDepth === 2) timeComplexity = 'O(n²)';
    else if (nestedDepth >= 3) timeComplexity = 'O(n³)';

    // Check for divide and conquer patterns
    if (code.includes('Math.floor') && code.includes('/2')) {
      timeComplexity = 'O(log n)';
    }

    // Space complexity
    let spaceComplexity = 'O(1)';
    if (code.match(/new\s+(Array|Set|Map|Object)/g)?.length > 0) {
      spaceComplexity = 'O(n)';
    }

    return {
      time: timeComplexity,
      space: spaceComplexity
    };
  }

  /**
   * Generate optimized version
   */
  generateOptimizedCode(code, language, bottlenecks) {
    let optimized = '// Optimized version\n\n';

    if (bottlenecks.some(b => b.type === 'nested-loop')) {
      if (language === 'javascript') {
        optimized += `// Use hash map instead of nested loops
function optimizedFunction(arr) {
  const map = new Map();

  // Single pass to build map
  arr.forEach(item => {
    map.set(item.key, item);
  });

  // Single pass to process
  return arr.map(item => {
    const related = map.get(item.relatedKey);
    return { ...item, related };
  });
}
// Time: O(n), improved from O(n²)`;
      } else if (language === 'python') {
        optimized += `# Use dictionary instead of nested loops
def optimized_function(arr):
    # Single pass to build dictionary
    lookup = {item['key']: item for item in arr}

    # Single pass to process
    return [
        {**item, 'related': lookup.get(item['related_key'])}
        for item in arr
    ]
# Time: O(n), improved from O(n²)`;
      }
    } else {
      optimized += code + '\n\n// No major optimizations needed';
    }

    return optimized;
  }

  /**
   * Calculate improvements
   */
  calculateImprovements(before, after) {
    return {
      timeImprovement: `${before.time} → ${after.time}`,
      spaceImprovement: before.space === after.space ? 'No change' : `${before.space} → ${after.space}`,
      estimatedSpeedup: this.estimateSpeedup(before.time, after.time)
    };
  }

  /**
   * Estimate speedup ratio
   */
  estimateSpeedup(before, after) {
    const complexity = {
      'O(1)': 1,
      'O(log n)': 10,
      'O(n)': 100,
      'O(n log n)': 150,
      'O(n²)': 10000,
      'O(n³)': 1000000
    };

    const beforeValue = complexity[before] || 100;
    const afterValue = complexity[after] || 100;

    if (beforeValue > afterValue) {
      return `${Math.round(beforeValue / afterValue)}x faster`;
    }
    return 'Same performance';
  }

  /**
   * Generate optimization suggestions
   */
  generateSuggestions(bottlenecks) {
    const suggestions = [];

    bottlenecks.forEach(bottleneck => {
      switch (bottleneck.type) {
        case 'nested-loop':
          suggestions.push('Replace nested loops with hash map/dictionary for O(n) lookup');
          break;
        case 'inefficient-search':
          suggestions.push('Use Set or Map for O(1) lookup instead of array search');
          break;
        case 'repeated-calculation':
          suggestions.push('Cache repeated calculations outside the loop');
          break;
      }
    });

    return suggestions;
  }

  /**
   * Helper: Find pattern line number
   */
  findPattern(code, pattern) {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(pattern)) {
        return i + 1;
      }
    }
    return 1;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceProfilerOptimizer;
}

// Demo
if (require.main === module) {
  const profiler = new PerformanceProfilerOptimizer();

  const sampleCode = `
function findDuplicates(arr) {
  const duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`;

  const result = profiler.analyze(sampleCode, 'javascript');

  console.log('=== Performance Analysis ===');
  console.log(JSON.stringify(result, null, 2));
}
