/**
 * Tests for AI Prompt Optimizer
 */

const PromptOptimizer = require('../src/index');

describe('PromptOptimizer', () => {
  let optimizer;

  beforeEach(() => {
    optimizer = new PromptOptimizer();
  });

  describe('constructor', () => {
    it('should initialize with correct weights', () => {
      expect(optimizer.weights).toBeDefined();
      expect(optimizer.weights.clarity).toBe(0.30);
      expect(optimizer.weights.specificity).toBe(0.25);
      expect(optimizer.weights.context).toBe(0.20);
      expect(optimizer.weights.conciseness).toBe(0.15);
      expect(optimizer.weights.tone).toBe(0.10);
    });

    it('should have weights sum to 1.0', () => {
      const sum = Object.values(optimizer.weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });

  describe('analyze', () => {
    it('should analyze a basic prompt', () => {
      const prompt = 'Can you help me with my code?';
      const result = optimizer.analyze(prompt);

      expect(result).toHaveProperty('overallScore');
      expect(result).toHaveProperty('scores');
      expect(result).toHaveProperty('issues');
      expect(result).toHaveProperty('refinedPrompt');
      expect(result).toHaveProperty('improvements');
      expect(result).toHaveProperty('scoreImprovement');
    });

    it('should return numeric overall score', () => {
      const prompt = 'Create a function to validate email addresses';
      const result = optimizer.analyze(prompt);

      expect(typeof result.overallScore).toBe('number');
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
      expect(result.overallScore).toBeLessThanOrEqual(100);
    });

    it('should score a good prompt higher than a vague one', () => {
      const vaguePrompt = 'help me with stuff';
      const goodPrompt = 'Create a Python function to validate email addresses using regex patterns';

      const vagueResult = optimizer.analyze(vaguePrompt);
      const goodResult = optimizer.analyze(goodPrompt);

      expect(goodResult.overallScore).toBeGreaterThan(vagueResult.overallScore);
    });

    it('should return all score categories', () => {
      const prompt = 'Test prompt';
      const result = optimizer.analyze(prompt);

      expect(result.scores).toHaveProperty('clarity');
      expect(result.scores).toHaveProperty('conciseness');
      expect(result.scores).toHaveProperty('tone');
      expect(result.scores).toHaveProperty('specificity');
      expect(result.scores).toHaveProperty('context');
    });
  });

  describe('analyzeClarity', () => {
    it('should penalize vague terms', () => {
      const vaguePrompt = 'Can you do something with this stuff?';
      const clearPrompt = 'Can you create a function for this task?';

      const vagueScore = optimizer.analyzeClarity(vaguePrompt);
      const clearScore = optimizer.analyzeClarity(clearPrompt);

      expect(clearScore).toBeGreaterThan(vagueScore);
    });

    it('should reward specific verbs', () => {
      const withoutVerb = 'I need help with my code';
      const withVerb = 'Analyze my code and create a refactored version';

      const scoreWithout = optimizer.analyzeClarity(withoutVerb);
      const scoreWith = optimizer.analyzeClarity(withVerb);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should penalize very short prompts', () => {
      const shortPrompt = 'help';
      const longerPrompt = 'Please help me understand this function';

      const shortScore = optimizer.analyzeClarity(shortPrompt);
      const longerScore = optimizer.analyzeClarity(longerPrompt);

      expect(longerScore).toBeGreaterThan(shortScore);
    });

    it('should reward questions with question marks', () => {
      const withoutQuestion = 'I need to know how this works';
      const withQuestion = 'How does this work?';

      const scoreWithout = optimizer.analyzeClarity(withoutQuestion);
      const scoreWith = optimizer.analyzeClarity(withQuestion);

      expect(scoreWith).toBeGreaterThanOrEqual(scoreWithout);
    });

    it('should return score between 0 and 100', () => {
      const score = optimizer.analyzeClarity('test prompt');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeConciseness', () => {
    it('should penalize very short prompts', () => {
      const shortPrompt = 'help';
      const score = optimizer.analyzeConciseness(shortPrompt);
      expect(score).toBeLessThan(100);
    });

    it('should penalize very long prompts', () => {
      const longPrompt = 'word '.repeat(100);
      const score = optimizer.analyzeConciseness(longPrompt);
      expect(score).toBeLessThan(100);
    });

    it('should reward optimal length prompts', () => {
      const optimalPrompt = 'Create a function that validates email addresses using regex patterns with proper error handling';
      const score = optimizer.analyzeConciseness(optimalPrompt);
      expect(score).toBeGreaterThan(80);
    });

    it('should penalize redundant phrases', () => {
      const redundant = 'In order to do this task, due to the fact that I need help';
      const concise = 'To do this task because I need help';

      const redundantScore = optimizer.analyzeConciseness(redundant);
      const conciseScore = optimizer.analyzeConciseness(concise);

      expect(conciseScore).toBeGreaterThan(redundantScore);
    });
  });

  describe('analyzeTone', () => {
    it('should reward polite language', () => {
      const polite = 'Could you please help me with this?';
      const neutral = 'Help me with this';

      const politeScore = optimizer.analyzeTone(polite);
      const neutralScore = optimizer.analyzeTone(neutral);

      expect(politeScore).toBeGreaterThan(neutralScore);
    });

    it('should penalize aggressive language', () => {
      const aggressive = 'I need this ASAP!!! You must do this now!!!';
      const calm = 'I would like help with this when possible';

      const aggressiveScore = optimizer.analyzeTone(aggressive);
      const calmScore = optimizer.analyzeTone(calm);

      expect(calmScore).toBeGreaterThan(aggressiveScore);
    });

    it('should return score between 0 and 100', () => {
      const score = optimizer.analyzeTone('test prompt');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });
  });

  describe('analyzeSpecificity', () => {
    it('should reward numbers and measurements', () => {
      const withNumbers = 'Create a function that handles 100 requests per second';
      const withoutNumbers = 'Create a function that handles many requests';

      const scoreWith = optimizer.analyzeSpecificity(withNumbers);
      const scoreWithout = optimizer.analyzeSpecificity(withoutNumbers);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should reward technical terms', () => {
      const technical = 'Implement a function with proper error handling for the API endpoint';
      const generic = 'Make something that works for the thing';

      const technicalScore = optimizer.analyzeSpecificity(technical);
      const genericScore = optimizer.analyzeSpecificity(generic);

      expect(technicalScore).toBeGreaterThan(genericScore);
    });

    it('should reward examples and formats', () => {
      const withExample = 'Create a function, for example, one that validates emails';
      const withoutExample = 'Create a validation function';

      const scoreWith = optimizer.analyzeSpecificity(withExample);
      const scoreWithout = optimizer.analyzeSpecificity(withoutExample);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should penalize generic terms', () => {
      const generic = 'help me fix this thing';
      const specific = 'debug the authentication module';

      const genericScore = optimizer.analyzeSpecificity(generic);
      const specificScore = optimizer.analyzeSpecificity(specific);

      expect(specificScore).toBeGreaterThan(genericScore);
    });
  });

  describe('analyzeContext', () => {
    it('should reward longer prompts with more context', () => {
      const short = 'Create a function';
      const long = 'Create a function because I am currently using Node.js in my production environment and need to handle user authentication since we previously used a different system';

      const shortScore = optimizer.analyzeContext(short);
      const longScore = optimizer.analyzeContext(long);

      expect(longScore).toBeGreaterThan(shortScore);
    });

    it('should reward context indicators', () => {
      const withContext = 'Because my current system uses MySQL, I need to create a migration script';
      const withoutContext = 'Create a migration script';

      const scoreWith = optimizer.analyzeContext(withContext);
      const scoreWithout = optimizer.analyzeContext(withoutContext);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });

    it('should reward constraints and requirements', () => {
      const withConstraints = 'Create a function that must handle 1000 requests per second';
      const withoutConstraints = 'Create a function';

      const scoreWith = optimizer.analyzeContext(withConstraints);
      const scoreWithout = optimizer.analyzeContext(withoutConstraints);

      expect(scoreWith).toBeGreaterThan(scoreWithout);
    });
  });

  describe('calculateOverallScore', () => {
    it('should weight scores correctly', () => {
      const scores = {
        clarity: 80,
        specificity: 70,
        context: 60,
        conciseness: 90,
        tone: 85
      };

      const overall = optimizer.calculateOverallScore(scores);
      const expected = (80 * 0.30) + (70 * 0.25) + (60 * 0.20) + (90 * 0.15) + (85 * 0.10);

      expect(overall).toBeCloseTo(expected, 5);
    });

    it('should return a number', () => {
      const scores = {
        clarity: 50,
        specificity: 50,
        context: 50,
        conciseness: 50,
        tone: 50
      };

      const overall = optimizer.calculateOverallScore(scores);
      expect(typeof overall).toBe('number');
    });
  });

  describe('identifyIssues', () => {
    it('should identify clarity issues', () => {
      const scores = {
        clarity: 40,
        specificity: 70,
        context: 70,
        conciseness: 70,
        tone: 70
      };

      const prompt = 'test';
      const issues = optimizer.identifyIssues(prompt, scores);

      expect(issues.length).toBeGreaterThan(0);
      expect(issues.some(i => i.category === 'clarity')).toBe(true);
    });

    it('should identify specificity issues', () => {
      const scores = {
        clarity: 70,
        specificity: 40,
        context: 70,
        conciseness: 70,
        tone: 70
      };

      const prompt = 'test';
      const issues = optimizer.identifyIssues(prompt, scores);

      expect(issues.some(i => i.category === 'specificity')).toBe(true);
    });

    it('should return empty array for good scores', () => {
      const scores = {
        clarity: 90,
        specificity: 90,
        context: 90,
        conciseness: 90,
        tone: 90
      };

      const prompt = 'test';
      const issues = optimizer.identifyIssues(prompt, scores);

      expect(issues.length).toBe(0);
    });

    it('should include severity levels', () => {
      const scores = {
        clarity: 40,
        specificity: 40,
        context: 40,
        conciseness: 40,
        tone: 40
      };

      const prompt = 'test';
      const issues = optimizer.identifyIssues(prompt, scores);

      issues.forEach(issue => {
        expect(issue).toHaveProperty('severity');
        expect(['critical', 'warning', 'info']).toContain(issue.severity);
      });
    });
  });

  describe('generateRefinedPrompt', () => {
    it('should return a string', () => {
      const prompt = 'help';
      const issues = [];
      const refined = optimizer.generateRefinedPrompt(prompt, issues);

      expect(typeof refined).toBe('string');
    });

    it('should add context when missing', () => {
      const prompt = 'Create a function';
      const issues = [{ category: 'context' }];
      const refined = optimizer.generateRefinedPrompt(prompt, issues);

      expect(refined).toContain('Context:');
    });

    it('should enhance specificity when missing', () => {
      const prompt = 'help me fix this';
      const issues = [{ category: 'specificity' }];
      const refined = optimizer.generateRefinedPrompt(prompt, issues);

      expect(refined).toContain('implement');
    });

    it('should add structure for very short prompts', () => {
      const prompt = 'help';
      const issues = [];
      const refined = optimizer.generateRefinedPrompt(prompt, issues);

      expect(refined.length).toBeGreaterThan(prompt.length);
    });
  });

  describe('roundScores', () => {
    it('should round all scores to integers', () => {
      const scores = {
        clarity: 75.7,
        specificity: 82.3,
        context: 90.9,
        conciseness: 65.4,
        tone: 88.1
      };

      const rounded = optimizer.roundScores(scores);

      expect(rounded.clarity).toBe(76);
      expect(rounded.specificity).toBe(82);
      expect(rounded.context).toBe(91);
      expect(rounded.conciseness).toBe(65);
      expect(rounded.tone).toBe(88);
    });
  });

  describe('getScoreEmoji', () => {
    it('should return Excellent for high scores', () => {
      const result = optimizer.getScoreEmoji(95);
      expect(result).toContain('Excellent');
    });

    it('should return Good for medium-high scores', () => {
      const result = optimizer.getScoreEmoji(80);
      expect(result).toContain('Good');
    });

    it('should return Fair for medium scores', () => {
      const result = optimizer.getScoreEmoji(65);
      expect(result).toContain('Fair');
    });

    it('should return Needs Improvement for low scores', () => {
      const result = optimizer.getScoreEmoji(40);
      expect(result).toContain('Needs Improvement');
    });
  });

  describe('createBar', () => {
    it('should create a bar visualization', () => {
      const bar = optimizer.createBar(50);
      expect(typeof bar).toBe('string');
      expect(bar.length).toBeGreaterThan(0);
    });

    it('should have correct length', () => {
      const bar = optimizer.createBar(50);
      expect(bar.length).toBe(10);
    });

    it('should show full bar for 100', () => {
      const bar = optimizer.createBar(100);
      expect(bar).toBe('██████████');
    });

    it('should show empty bar for 0', () => {
      const bar = optimizer.createBar(0);
      expect(bar).toBe('░░░░░░░░░░');
    });
  });

  describe('edge cases', () => {
    it('should handle empty string', () => {
      const result = optimizer.analyze('');
      expect(result).toHaveProperty('overallScore');
      expect(result.overallScore).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long prompts', () => {
      const longPrompt = 'word '.repeat(500);
      const result = optimizer.analyze(longPrompt);
      expect(result).toHaveProperty('overallScore');
    });

    it('should handle special characters', () => {
      const prompt = 'Create a function with symbols: !@#$%^&*()';
      const result = optimizer.analyze(prompt);
      expect(result).toHaveProperty('overallScore');
    });

    it('should handle unicode characters', () => {
      const prompt = 'Create a función para validar emojis 🚀✨';
      const result = optimizer.analyze(prompt);
      expect(result).toHaveProperty('overallScore');
    });
  });

  describe('integration', () => {
    it('should provide actionable improvements', () => {
      const prompt = 'help with stuff';
      const result = optimizer.analyze(prompt);

      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.improvements.length).toBeGreaterThan(0);
      expect(result.refinedPrompt.length).toBeGreaterThan(prompt.length);
    });

    it('should improve score with refined prompt', () => {
      const prompt = 'fix my code';
      const result = optimizer.analyze(prompt);

      expect(result.scoreImprovement).toBeGreaterThan(0);
    });

    it('should maintain score for already good prompts', () => {
      const prompt = 'Create a Python function to validate email addresses using regex, ensuring it handles edge cases like international domains and returns clear error messages';
      const result = optimizer.analyze(prompt);

      expect(result.overallScore).toBeGreaterThan(70);
    });
  });
});
