# Security Scanner

Scans JavaScript and Python source code for common security vulnerabilities including insecure patterns (eval, exec), weak cryptography, hardcoded credentials, and injection risks with severity ratings.

## Overview

To improve code security, use this skill to automatically scan JavaScript and Python files for common vulnerabilities. The scanner detects insecure patterns, weak cryptography, hardcoded secrets, injection risks, and provides actionable remediation guidance.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r security-scanner ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["security-scanner"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

Activate this skill when performing security audits or code reviews.

Claude will automatically use this skill's capabilities when relevant to your task.

For detailed usage instructions, refer to [SKILL.md](./SKILL.md).

### Command Line Demo

```bash
cd security-scanner
node src/index.js
```

**Sample Output:**

```
🔒 SECURITY SCAN RESULTS

Overall Security Score: 25/100 🔴 Critical
Language: python

Total Issues: 4
  🔴 Critical: 2
  🟠 High: 2
  🟡 Medium: 0
  🟢 Low: 0

Risk Level: 🔴 CRITICAL

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 FINDINGS

1. 🔴 Hardcoded password
   Severity: CRITICAL | CWE: CWE-798
   Line 5: DB_PASSWORD = "admin123"
   Impact: Complete system compromise, data breach, or unauthorized access
   Fix: Move credentials to environment variables or secrets management

2. 🔴 SQL injection vulnerability
   Severity: CRITICAL | CWE: CWE-89
   Line 9: query = f"SELECT * FROM users WHERE username='{username}'"
   Impact: Complete system compromise, data breach, or unauthorized access
   Fix: Use parameterized queries and input validation

3. 🟠 Weak cryptography: MD5
   Severity: HIGH | CWE: CWE-327
   Line 8: password_hash = hashlib.md5(password.encode()).hexdigest()
   Impact: Significant security weakness that could lead to exploitation
   Fix: Use strong cryptographic algorithms (e.g., SHA-256, bcrypt)

4. 🟠 Command injection risk
   Severity: HIGH | CWE: CWE-78
   Line 13: os.system(cmd)
   Impact: Significant security weakness that could lead to exploitation
   Fix: Use parameterized queries and input validation

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 RECOMMENDATIONS

1. FIX IMMEDIATELY: Hardcoded password (Line 5)
2. FIX IMMEDIATELY: SQL injection vulnerability (Line 9)
3. HIGH PRIORITY: Weak cryptography: MD5 (Line 8)
4. HIGH PRIORITY: Command injection risk (Line 13)
```

## Inputs & Outputs

**Inputs:**
- `code` (string, required): Source code to scan
- `language` (string, optional): Programming language (javascript, python, auto)
- `severityThreshold` (string, optional): Minimum severity to report
- `focusAreas` (array, optional): Specific vulnerability types to check

**Outputs:**
- `securityScore` (number 0-100): Overall security score
- `totalIssues` (number): Total vulnerabilities found
- `issuesBySeverity` (object): Count by severity level
- `findings` (array): Detailed vulnerability reports
- `riskLevel` (enum): Overall risk assessment
- `recommendations` (array): Prioritized action items

## Limitations

- Pattern-based detection (may have false positives/negatives)
- Static analysis only (does not execute code)
- May miss context-dependent vulnerabilities
- Requires manual review for complex cases
- Not a replacement for comprehensive security testing
- Should be combined with DAST, penetration testing, and code review
- Demo implementation uses simplified pattern matching

## License

Apache-2.0

## Learn More

For complete skill documentation, see [SKILL.md](./SKILL.md).
