# Log Analyzer & Debugger

Analyze log files, stack traces, and error patterns to identify root causes and get actionable debugging steps. Creates timeline visualizations and detects anomalies automatically.

## Features

- **Pattern Detection**: Recurring errors, cascading failures
- **Root Cause Analysis**: Identifies probable causes with confidence levels
- **Timeline Visualization**: Mermaid sequence diagrams
- **Debugging Steps**: Actionable troubleshooting guide
- **Anomaly Detection**: Unusual spikes and patterns
- **Multi-Format**: Text logs, JSON, syslog

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Upload or reference `log-analyzer-debugger` skill
3. Use for log analysis tasks

### Claude Code

1. Navigate to Skills > Install Skill
2. Select `log-analyzer-debugger`
3. Activate in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["log-analyzer-debugger"],
    messages=[{"role": "user", "content": "Analyze these logs: [paste logs]"}]
)
```

## Usage

Ask Claude:
> "Analyze these logs and find the root cause of the errors: [paste logs]"

Output includes:
1. **Error Patterns** - Detected issues with severity
2. **Root Causes** - Probable causes with confidence
3. **Debugging Steps** - Actionable troubleshooting guide
4. **Timeline** - Visual Mermaid diagram
5. **Anomalies** - Unusual patterns

## Best Practices

- Include timestamps in logs
- Use structured logging (JSON)
- Include context (user IDs, request IDs)
- Log at appropriate levels
- Add correlation IDs for distributed systems

## Related Skills

- **performance-profiler-optimizer**: Optimize slow operations
- **code-refactoring-assistant**: Improve error handling
- **ci-cd-pipeline-generator**: Add logging to pipelines

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
