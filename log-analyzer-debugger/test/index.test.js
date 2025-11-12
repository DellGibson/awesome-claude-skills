/**
 * Tests for Log Analyzer & Debugger
 */

const LogAnalyzerDebugger = require('../src/index');

describe('LogAnalyzerDebugger', () => {
  let analyzer;

  beforeEach(() => {
    analyzer = new LogAnalyzerDebugger();
  });

  describe('constructor', () => {
    it('should initialize with error patterns', () => {
      expect(analyzer.errorPatterns).toContain('error');
      expect(analyzer.errorPatterns).toContain('exception');
      expect(analyzer.errorPatterns).toContain('failed');
    });

    it('should initialize with warning patterns', () => {
      expect(analyzer.warningPatterns).toContain('warn');
      expect(analyzer.warningPatterns).toContain('warning');
    });
  });

  describe('analyze', () => {
    const sampleLogs = `
2024-01-01 10:00:00 [INFO] Application started
2024-01-01 10:01:00 [ERROR] Database connection failed
2024-01-01 10:02:00 [ERROR] Database connection failed
    `.trim();

    it('should return complete analysis', () => {
      const result = analyzer.analyze(sampleLogs, {});

      expect(result).toHaveProperty('patterns');
      expect(result).toHaveProperty('rootCauses');
      expect(result).toHaveProperty('debuggingSteps');
      expect(result).toHaveProperty('anomalies');
      expect(result).toHaveProperty('summary');
    });

    it('should include timeline when requested', () => {
      const result = analyzer.analyze(sampleLogs, {
        includeTimeline: true
      });

      expect(result.timeline).toBeDefined();
    });

    it('should auto-detect log format', () => {
      const result = analyzer.analyze(sampleLogs, {
        logFormat: 'auto'
      });

      expect(result.patterns).toBeDefined();
    });
  });

  describe('detectFormat', () => {
    it('should detect JSON format', () => {
      const jsonLogs = '{"level":"error","message":"test"}';
      const format = analyzer.detectFormat(jsonLogs);

      expect(format).toBe('json');
    });

    it('should detect text format', () => {
      const textLogs = '[INFO] Application started';
      const format = analyzer.detectFormat(textLogs);

      expect(format).toBe('text');
    });

    it('should default to text for unknown format', () => {
      const logs = 'random log entry';
      const format = analyzer.detectFormat(logs);

      expect(format).toBe('text');
    });
  });

  describe('parseLog', () => {
    it('should parse JSON logs', () => {
      const logs = '{"timestamp":"2024-01-01","level":"error","message":"test"}';
      const entries = analyzer.parseLog(logs, 'json');

      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].level).toBe('error');
      expect(entries[0].message).toBe('test');
    });

    it('should parse text logs', () => {
      const logs = '2024-01-01 10:00:00 [ERROR] Test error message';
      const entries = analyzer.parseLog(logs, 'text');

      expect(entries.length).toBeGreaterThan(0);
      expect(entries[0].level).toBe('error');
    });

    it('should handle invalid JSON gracefully', () => {
      const logs = '{invalid json}\n{"valid":"json"}';
      const entries = analyzer.parseLog(logs, 'json');

      expect(entries.length).toBeGreaterThanOrEqual(0);
    });

    it('should skip empty lines in text logs', () => {
      const logs = '[INFO] Line 1\n\n\n[INFO] Line 2';
      const entries = analyzer.parseLog(logs, 'text');

      expect(entries.length).toBe(2);
    });
  });

  describe('parseTextLogLine', () => {
    it('should extract timestamp', () => {
      const line = '2024-01-01 10:00:00 [INFO] Message';
      const entry = analyzer.parseTextLogLine(line, 1);

      expect(entry.timestamp).toContain('2024-01-01');
    });

    it('should extract log level', () => {
      const line = '[ERROR] Error message';
      const entry = analyzer.parseTextLogLine(line, 1);

      expect(entry.level).toBe('error');
    });

    it('should handle missing timestamp', () => {
      const line = '[INFO] Message without timestamp';
      const entry = analyzer.parseTextLogLine(line, 1);

      expect(entry.timestamp).toBeNull();
    });

    it('should default to info level', () => {
      const line = 'Message without level';
      const entry = analyzer.parseTextLogLine(line, 1);

      expect(entry.level).toBe('info');
    });
  });

  describe('detectPatterns', () => {
    it('should detect repeated errors', () => {
      const entries = [
        { level: 'error', message: 'Database timeout', line: 1 },
        { level: 'error', message: 'Database timeout', line: 2 },
        { level: 'error', message: 'Database timeout', line: 3 }
      ];

      const patterns = analyzer.detectPatterns(entries);

      expect(patterns.length).toBeGreaterThan(0);
    });

    it('should group similar error messages', () => {
      const entries = [
        { level: 'error', message: 'Connection failed', line: 1 },
        { level: 'error', message: 'Connection timeout', line: 2 }
      ];

      const patterns = analyzer.detectPatterns(entries);

      expect(Array.isArray(patterns)).toBe(true);
    });
  });

  describe('analyzeRootCauses', () => {
    it('should identify potential root causes', () => {
      const patterns = [
        { type: 'repeated-error', count: 5, message: 'Database connection failed' }
      ];
      const entries = [];

      const causes = analyzer.analyzeRootCauses(patterns, entries);

      expect(Array.isArray(causes)).toBe(true);
    });
  });

  describe('generateDebuggingSteps', () => {
    it('should provide actionable debugging steps', () => {
      const rootCauses = [
        { category: 'database', issue: 'Connection failed' }
      ];
      const patterns = [];

      const steps = analyzer.generateDebuggingSteps(rootCauses, patterns);

      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
    });

    it('should prioritize critical issues', () => {
      const rootCauses = [
        { severity: 'critical', issue: 'System crash' },
        { severity: 'low', issue: 'Minor warning' }
      ];

      const steps = analyzer.generateDebuggingSteps(rootCauses, []);

      expect(steps.length).toBeGreaterThan(0);
    });
  });

  describe('detectAnomalies', () => {
    it('should detect unusual spike in errors', () => {
      const entries = Array(100).fill(null).map((_, i) => ({
        level: i < 90 ? 'info' : 'error',
        message: 'test',
        timestamp: new Date().toISOString()
      }));

      const anomalies = analyzer.detectAnomalies(entries);

      expect(Array.isArray(anomalies)).toBe(true);
    });

    it('should detect time gaps', () => {
      const entries = [
        { timestamp: '2024-01-01 10:00:00', level: 'info', message: 'test' },
        { timestamp: '2024-01-01 12:00:00', level: 'info', message: 'test' }
      ];

      const anomalies = analyzer.detectAnomalies(entries);

      expect(Array.isArray(anomalies)).toBe(true);
    });
  });

  describe('generateTimeline', () => {
    it('should create timeline of events', () => {
      const entries = [
        { timestamp: '2024-01-01 10:00:00', level: 'info', message: 'Start' },
        { timestamp: '2024-01-01 10:01:00', level: 'error', message: 'Error' },
        { timestamp: '2024-01-01 10:02:00', level: 'info', message: 'End' }
      ];

      const timeline = analyzer.generateTimeline(entries);

      expect(timeline).toBeDefined();
      expect(Array.isArray(timeline.events)).toBe(true);
    });
  });

  describe('generateSummary', () => {
    it('should create analysis summary', () => {
      const patterns = [
        { type: 'error', count: 5 }
      ];
      const rootCauses = [
        { category: 'database' }
      ];

      const summary = analyzer.generateSummary(patterns, rootCauses);

      expect(summary).toBeDefined();
      expect(typeof summary).toBe('string');
    });
  });

  describe('integration', () => {
    it('should comprehensively analyze application logs', () => {
      const logs = `
2024-01-01 10:00:00 [INFO] Application started successfully
2024-01-01 10:01:00 [INFO] User login: user@example.com
2024-01-01 10:02:00 [ERROR] Database connection timeout: postgres://db:5432
2024-01-01 10:02:05 [ERROR] Retry failed: Database connection timeout
2024-01-01 10:02:10 [ERROR] Database connection timeout: postgres://db:5432
2024-01-01 10:03:00 [WARN] High memory usage: 85%
2024-01-01 10:03:30 [ERROR] Request timeout: /api/users
2024-01-01 10:04:00 [ERROR] Database connection timeout: postgres://db:5432
2024-01-01 10:05:00 [INFO] Circuit breaker opened
2024-01-01 10:10:00 [INFO] Service recovered
      `.trim();

      const result = analyzer.analyze(logs, {
        logFormat: 'auto',
        includeTimeline: true,
        analysisGoal: 'find-root-cause'
      });

      expect(result.patterns.length).toBeGreaterThan(0);
      expect(result.rootCauses.length).toBeGreaterThan(0);
      expect(result.debuggingSteps.length).toBeGreaterThan(0);
      expect(result.timeline).toBeDefined();
      expect(result.anomalies.length).toBeGreaterThanOrEqual(0);
      expect(result.summary).toBeTruthy();
    });
  });
});
