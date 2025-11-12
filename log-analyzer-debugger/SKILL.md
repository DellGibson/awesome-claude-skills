---
name: log-analyzer-debugger
description: Analyzes log files and stack traces to detect error patterns, anomalies, and performance issues with root cause suggestions and timeline visualization using Mermaid
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - logging
  - debugging
  - monitoring
  - troubleshooting
  - diagnostics
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Log Analyzer & Debugger

Automatically analyze log files, stack traces, and error patterns to identify root causes and debugging steps. Creates timeline visualizations, detects anomalies, and provides actionable recommendations for fixing issues.

## What It Does

1. **Parses Log Files** - Handles text, JSON, syslog formats
2. **Detects Patterns** - Identifies recurring errors and anomalies
3. **Analyzes Stack Traces** - Pinpoints failure locations
4. **Timeline Visualization** - Creates Mermaid sequence diagrams
5. **Root Cause Analysis** - Suggests probable causes
6. **Debugging Steps** - Provides actionable troubleshooting guide
7. **Performance Insights** - Identifies slow operations

## Key Features

- **Multi-Format**: Text logs, JSON, structured logging
- **Error Detection**: 404s, 500s, exceptions, timeouts
- **Pattern Recognition**: Recurring issues, cascading failures
- **Stack Trace Analysis**: Full trace parsing with line numbers
- **Anomaly Detection**: Unusual patterns, spikes, drops
- **Timeline Diagrams**: Visual Mermaid charts
- **Recommendations**: Specific debugging steps

## When to Use

- Debug production issues
- Analyze application failures
- Find performance bottlenecks
- Identify recurring errors
- Understand system behavior
- Troubleshoot crashes

## Example Usage

### Input: Application Logs

```
2025-01-15 10:30:15 [INFO] Server started on port 3000
2025-01-15 10:30:20 [INFO] Database connected
2025-01-15 10:30:25 [ERROR] Failed to fetch user data: Connection timeout
2025-01-15 10:30:30 [ERROR] Failed to fetch user data: Connection timeout
2025-01-15 10:30:35 [WARN] Retry attempt 1/3
2025-01-15 10:30:40 [ERROR] Database connection lost
2025-01-15 10:30:45 [FATAL] Application crashed
```

### Output

#### Detected Patterns

1. **Recurring Error** (3 occurrences)
   - Pattern: "Connection timeout"
   - First seen: 10:30:25
   - Frequency: Every 5 seconds

2. **Cascading Failure**
   - Database timeout → Connection lost → App crashed
   - Timeline: 15 seconds

#### Root Causes

1. **Database connectivity issues** (Confidence: High)
   - Evidence: Multiple timeouts, connection lost
   - Likely cause: Network issue or database overload

2. **Missing error handling** (Confidence: Medium)
   - Evidence: No recovery after timeouts
   - Impact: Cascading failure

#### Debugging Steps

1. Check database server status and load
2. Verify network connectivity
3. Review database connection pool settings
4. Add retry logic with exponential backoff
5. Implement circuit breaker pattern

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## License

Apache-2.0
