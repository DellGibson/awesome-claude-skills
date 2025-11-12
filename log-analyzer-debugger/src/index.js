/**
 * Log Analyzer & Debugger
 * Analyzes log files and detects patterns, errors, and root causes
 */

class LogAnalyzerDebugger {
  constructor() {
    this.errorPatterns = ['error', 'exception', 'failed', 'timeout', 'crash'];
    this.warningPatterns = ['warn', 'warning', 'deprecated'];
  }

  /**
   * Main entry point - analyzes logs and provides debugging insights
   */
  analyze(logs, options = {}) {
    const logFormat = options.logFormat === 'auto' ? this.detectFormat(logs) : options.logFormat;
    const entries = this.parseLogslog(logs, logFormat);
    const patterns = this.detectPatterns(entries, options.analysisGoal);
    const rootCauses = this.analyzeRootCauses(patterns, entries);
    const debuggingSteps = this.generateDebuggingSteps(rootCauses, patterns);
    const timeline = options.includeTimeline ? this.generateTimeline(entries) : null;
    const anomalies = this.detectAnomalies(entries);

    return {
      patterns,
      rootCauses,
      debuggingSteps,
      timeline,
      anomalies,
      summary: this.generateSummary(patterns, rootCauses)
    };
  }

  /**
   * Detect log format
   */
  detectFormat(logs) {
    if (logs.trim().startsWith('{')) return 'json';
    if (logs.includes('[INFO]') || logs.includes('[ERROR]')) return 'text';
    return 'text';
  }

  /**
   * Parse log entries
   */
  parseLog(logs, format) {
    const entries = [];

    if (format === 'json') {
      logs.split('\n').forEach((line, idx) => {
        try {
          const entry = JSON.parse(line);
          entries.push({
            timestamp: entry.timestamp || new Date().toISOString(),
            level: entry.level || 'info',
            message: entry.message || '',
            line: idx + 1
          });
        } catch (e) {
          // Skip invalid JSON
        }
      });
    } else {
      logs.split('\n').forEach((line, idx) => {
        if (line.trim()) {
          entries.push(this.parseTextLogLine(line, idx + 1));
        }
      });
    }

    return entries;
  }

  /**
   * Parse text log line
   */
  parseTextLogLine(line, lineNum) {
    const timestampMatch = line.match(/^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})/);
    const levelMatch = line.match(/\[(INFO|WARN|ERROR|DEBUG|FATAL)\]/i);

    return {
      timestamp: timestampMatch ? timestampMatch[1] : null,
      level: levelMatch ? levelMatch[1].toLowerCase() : 'info',
      message: line,
      line: lineNum
    };
  }

  /**
   * Detect error and warning patterns
   */
  detectPatterns(entries, goal) {
    const patterns = [];
    const messageCount = {};

    entries.forEach(entry => {
      const level = entry.level.toLowerCase();
      const message = entry.message.toLowerCase();

      // Count similar messages
      const key = this.normalizeMessage(message);
      messageCount[key] = (messageCount[key] || 0) + 1;

      // Detect error patterns
      if (level === 'error' || level === 'fatal') {
        this.errorPatterns.forEach(pattern => {
          if (message.includes(pattern)) {
            patterns.push({
              type: 'error',
              pattern: pattern,
              message: entry.message,
              timestamp: entry.timestamp,
              line: entry.line,
              severity: level === 'fatal' ? 'critical' : 'high'
            });
          }
        });
      }

      // Detect warning patterns
      if (level === 'warn' || level === 'warning') {
        patterns.push({
          type: 'warning',
          message: entry.message,
          timestamp: entry.timestamp,
          line: entry.line,
          severity: 'medium'
        });
      }
    });

    // Identify recurring patterns
    Object.entries(messageCount).forEach(([key, count]) => {
      if (count > 2) {
        patterns.push({
          type: 'recurring',
          pattern: key,
          count: count,
          severity: 'high',
          message: `Pattern repeated ${count} times`
        });
      }
    });

    return patterns;
  }

  /**
   * Analyze root causes
   */
  analyzeRootCauses(patterns, entries) {
    const causes = [];

    // Database issues
    const dbErrors = patterns.filter(p =>
      p.message && (
        p.message.toLowerCase().includes('database') ||
        p.message.toLowerCase().includes('connection') ||
        p.message.toLowerCase().includes('timeout')
      )
    );

    if (dbErrors.length > 0) {
      causes.push({
        cause: 'Database connectivity issues',
        confidence: 'high',
        evidence: [
          `${dbErrors.length} database-related errors`,
          'Connection timeouts detected',
          'Possible network or database overload'
        ],
        recommendation: 'Check database server status and connection pool settings'
      });
    }

    // Authentication issues
    const authErrors = patterns.filter(p =>
      p.message && (
        p.message.toLowerCase().includes('unauthorized') ||
        p.message.toLowerCase().includes('authentication') ||
        p.message.toLowerCase().includes('401')
      )
    );

    if (authErrors.length > 0) {
      causes.push({
        cause: 'Authentication failures',
        confidence: 'high',
        evidence: [
          `${authErrors.length} authentication errors`,
          'Possible token expiration or invalid credentials'
        ],
        recommendation: 'Verify authentication tokens and credential configuration'
      });
    }

    // Performance issues
    const slowOps = patterns.filter(p =>
      p.message && (
        p.message.toLowerCase().includes('slow') ||
        p.message.toLowerCase().includes('timeout') ||
        p.message.toLowerCase().includes('performance')
      )
    );

    if (slowOps.length > 0) {
      causes.push({
        cause: 'Performance degradation',
        confidence: 'medium',
        evidence: [
          `${slowOps.length} slow operations detected`,
          'Possible resource constraints or inefficient queries'
        ],
        recommendation: 'Profile application performance and optimize slow operations'
      });
    }

    // Generic errors if no specific cause found
    if (causes.length === 0 && patterns.length > 0) {
      causes.push({
        cause: 'Multiple errors detected',
        confidence: 'low',
        evidence: [`${patterns.length} total errors in logs`],
        recommendation: 'Review error messages for specific issues'
      });
    }

    return causes;
  }

  /**
   * Generate debugging steps
   */
  generateDebuggingSteps(rootCauses, patterns) {
    const steps = [];

    steps.push('1. Review the identified error patterns and their frequency');
    steps.push('2. Check system resources (CPU, memory, disk, network)');

    rootCauses.forEach((cause, idx) => {
      steps.push(`${idx + 3}. ${cause.recommendation}`);
    });

    steps.push(`${steps.length + 1}. Enable detailed logging for problematic components`);
    steps.push(`${steps.length + 1}. Set up monitoring and alerting for recurring issues`);

    return steps;
  }

  /**
   * Generate Mermaid timeline diagram
   */
  generateTimeline(entries) {
    let diagram = 'sequenceDiagram\n';
    diagram += '    participant User\n';
    diagram += '    participant App\n';
    diagram += '    participant Database\n\n';

    entries.slice(0, 10).forEach(entry => {
      const level = entry.level.toUpperCase();
      const msg = entry.message.substring(0, 50);

      if (entry.message.toLowerCase().includes('database')) {
        diagram += `    App->>Database: ${msg}\n`;
        if (level === 'ERROR') {
          diagram += `    Database-->>App: Error\n`;
        }
      } else if (level === 'ERROR' || level === 'FATAL') {
        diagram += `    Note over App: ${level}: ${msg}\n`;
      } else {
        diagram += `    Note right of App: ${msg}\n`;
      }
    });

    return diagram;
  }

  /**
   * Detect anomalies in log patterns
   */
  detectAnomalies(entries) {
    const anomalies = [];

    // Detect error spikes
    const errorsByMinute = {};
    entries.forEach(entry => {
      if (entry.level === 'error' && entry.timestamp) {
        const minute = entry.timestamp.substring(0, 16);
        errorsByMinute[minute] = (errorsByMinute[minute] || 0) + 1;
      }
    });

    const avgErrors = Object.values(errorsByMinute).reduce((a, b) => a + b, 0) / Object.keys(errorsByMinute).length || 0;

    Object.entries(errorsByMinute).forEach(([minute, count]) => {
      if (count > avgErrors * 3) {
        anomalies.push({
          type: 'error-spike',
          timestamp: minute,
          count: count,
          description: `Unusual error spike: ${count} errors (avg: ${avgErrors.toFixed(1)})`
        });
      }
    });

    return anomalies;
  }

  /**
   * Generate summary
   */
  generateSummary(patterns, rootCauses) {
    const errorCount = patterns.filter(p => p.type === 'error').length;
    const warningCount = patterns.filter(p => p.type === 'warning').length;

    return {
      totalErrors: errorCount,
      totalWarnings: warningCount,
      criticalIssues: rootCauses.filter(c => c.confidence === 'high').length,
      recommendation: rootCauses.length > 0 ? rootCauses[0].recommendation : 'No critical issues detected'
    };
  }

  /**
   * Normalize message for pattern matching
   */
  normalizeMessage(message) {
    return message
      .replace(/\d+/g, 'N')
      .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, 'UUID')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, 'IP')
      .substring(0, 100);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LogAnalyzerDebugger;
}

// Demo
if (require.main === module) {
  const analyzer = new LogAnalyzerDebugger();

  const sampleLogs = `
2025-01-15 10:30:15 [INFO] Server started
2025-01-15 10:30:25 [ERROR] Failed to fetch user data: Connection timeout
2025-01-15 10:30:30 [ERROR] Failed to fetch user data: Connection timeout
2025-01-15 10:30:40 [ERROR] Database connection lost
2025-01-15 10:30:45 [FATAL] Application crashed
  `;

  const result = analyzer.analyze(sampleLogs, {
    logFormat: 'auto',
    analysisGoal: 'general',
    includeTimeline: true
  });

  console.log('=== Analysis Results ===');
  console.log(JSON.stringify(result, null, 2));
}
