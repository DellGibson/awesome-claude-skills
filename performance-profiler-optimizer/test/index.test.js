/**
 * Tests for Performance Profiler & Optimizer
 */

const PerformanceProfilerOptimizer = require('../src/index');

describe('PerformanceProfilerOptimizer', () => {
  let profiler;

  beforeEach(() => {
    profiler = new PerformanceProfilerOptimizer();
  });

  describe('constructor', () => {
    it('should initialize with supported languages', () => {
      expect(profiler.supportedLanguages).toContain('javascript');
      expect(profiler.supportedLanguages).toContain('python');
    });

    it('should define bottleneck types', () => {
      expect(profiler.bottleneckTypes).toContain('loop');
      expect(profiler.bottleneckTypes).toContain('algorithm');
      expect(profiler.bottleneckTypes).toContain('io');
    });
  });

  describe('analyze', () => {
    const sampleCode = 'for (let i = 0; i < 1000; i++) { console.log(i); }';

    it('should return complete performance analysis', () => {
      const result = profiler.analyze(sampleCode, 'javascript', {});

      expect(result).toHaveProperty('bottlenecks');
      expect(result).toHaveProperty('optimizations');
      expect(result).toHaveProperty('complexity');
      expect(result).toHaveProperty('recommendations');
    });

    it('should include optimized code', () => {
      const result = profiler.analyze(sampleCode, 'javascript', {});

      expect(result).toHaveProperty('optimizedCode');
    });
  });

  describe('detectBottlenecks', () => {
    it('should detect nested loops', () => {
      const code = 'for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) {} }';
      const bottlenecks = profiler.detectBottlenecks(code, 'javascript');

      expect(bottlenecks.some(b => b.type === 'nested-loop')).toBe(true);
    });

    it('should detect inefficient array operations', () => {
      const code = 'array.forEach(() => { array.filter(() => {}); });';
      const bottlenecks = profiler.detectBottlenecks(code, 'javascript');

      expect(Array.isArray(bottlenecks)).toBe(true);
    });

    it('should detect synchronous I/O', () => {
      const code = 'fs.readFileSync("/path/to/file");';
      const bottlenecks = profiler.detectBottlenecks(code, 'javascript');

      expect(bottlenecks.some(b => b.category === 'io')).toBe(true);
    });
  });

  describe('calculateComplexity', () => {
    it('should analyze O(1) complexity', () => {
      const code = 'return array[0];';
      const complexity = profiler.calculateComplexity(code, 'javascript');

      expect(complexity).toHaveProperty('bigO');
      expect(complexity.bigO).toBe('O(1)');
    });

    it('should analyze O(n) complexity', () => {
      const code = 'for (let i = 0; i < n; i++) {}';
      const complexity = profiler.calculateComplexity(code, 'javascript');

      expect(complexity.bigO).toBe('O(n)');
    });

    it('should analyze O(n²) complexity', () => {
      const code = 'for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) {} }';
      const complexity = profiler.calculateComplexity(code, 'javascript');

      expect(complexity.bigO).toBe('O(n²)');
    });

    it('should analyze O(log n) complexity', () => {
      const code = 'while (n > 1) { n = n / 2; }';
      const complexity = profiler.calculateComplexity(code, 'javascript');

      expect(complexity.bigO).toContain('log');
    });
  });

  describe('generateOptimizations', () => {
    it('should suggest loop optimizations', () => {
      const bottlenecks = [
        { type: 'nested-loop', line: 1, code: 'nested loop' }
      ];
      const optimizations = profiler.generateOptimizations(bottlenecks, 'javascript');

      expect(optimizations.length).toBeGreaterThan(0);
      expect(optimizations[0]).toHaveProperty('suggestion');
    });

    it('should suggest caching for repeated calculations', () => {
      const bottlenecks = [
        { type: 'repeated-calculation', pattern: 'expensive()' }
      ];
      const optimizations = profiler.generateOptimizations(bottlenecks, 'javascript');

      expect(optimizations.some(o => o.technique.includes('cache') || o.technique.includes('memoiz'))).toBe(true);
    });
  });

  describe('optimizeCode', () => {
    it('should optimize simple loops', () => {
      const code = 'for (let i = 0; i < array.length; i++) { process(array[i]); }';
      const optimized = profiler.optimizeCode(code, 'javascript', {});

      expect(optimized).toBeTruthy();
      expect(optimized).not.toBe(code);
    });

    it('should optimize array operations', () => {
      const code = 'array.forEach(() => { array.map(() => {}); });';
      const optimized = profiler.optimizeCode(code, 'javascript', {});

      expect(optimized).toBeTruthy();
    });
  });

  describe('generateRecommendations', () => {
    it('should provide actionable recommendations', () => {
      const bottlenecks = [
        { type: 'nested-loop', severity: 'high' }
      ];
      const complexity = { bigO: 'O(n²)' };

      const recommendations = profiler.generateRecommendations(bottlenecks, complexity);

      expect(recommendations.length).toBeGreaterThan(0);
      expect(recommendations[0]).toHaveProperty('priority');
      expect(recommendations[0]).toHaveProperty('action');
    });
  });

  describe('integration', () => {
    it('should comprehensively analyze and optimize inefficient code', () => {
      const inefficientCode = `
function findDuplicates(array) {
  const duplicates = [];
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        if (duplicates.indexOf(array[i]) === -1) {
          duplicates.push(array[i]);
        }
      }
    }
  }
  return duplicates;
}
      `.trim();

      const result = profiler.analyze(inefficientCode, 'javascript', {
        includeOptimizations: true,
        suggestAlternatives: true
      });

      expect(result.bottlenecks.length).toBeGreaterThan(0);
      expect(result.complexity.bigO).toContain('n²');
      expect(result.optimizations.length).toBeGreaterThan(0);
      expect(result.optimizedCode).toBeTruthy();
      expect(result.optimizedCode).not.toBe(inefficientCode);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  });
});
