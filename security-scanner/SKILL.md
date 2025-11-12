---
name: security-scanner
description: Scans JavaScript and Python source code for common security vulnerabilities including insecure patterns (eval, exec), weak cryptography, hardcoded credentials, and injection risks with severity ratings.
license: Apache-2.0
---

# Security Scanner

Identify security vulnerabilities in your code before they reach production.

## Overview

To improve code security, use this skill to automatically scan JavaScript and Python files for common vulnerabilities. The scanner detects insecure patterns, weak cryptography, hardcoded secrets, injection risks, and provides actionable remediation guidance.

**Keywords**: security, vulnerability scanning, code analysis, SAST, security audit, DevSecOps, static analysis, security testing

## When to Use This Skill

- Before committing code to version control
- During code reviews and PR checks
- As part of CI/CD security gates
- When auditing legacy codebases
- Before deploying to production
- For security training and awareness
- Compliance and security certification prep

## What This Skill Does

1. **Pattern Detection**: Identifies dangerous functions and patterns
2. **Cryptography Analysis**: Finds weak or deprecated crypto usage
3. **Secrets Detection**: Locates hardcoded credentials and API keys
4. **Injection Risk Analysis**: Identifies SQL, command, and XSS vulnerabilities
5. **Severity Rating**: Classifies findings as CRITICAL, HIGH, MEDIUM, LOW
6. **Remediation Guidance**: Provides fix recommendations
7. **Security Score**: Generates overall security rating (0-100)

## Vulnerability Categories

### Critical Severity

**Code Execution Risks:**
- `eval()` usage (JavaScript/Python)
- `exec()` usage (Python)
- `Function()` constructor (JavaScript)
- Deserialization of untrusted data

**Hardcoded Secrets:**
- API keys and tokens
- Database credentials
- Private keys and certificates
- AWS/Azure/GCP credentials

**Injection Vulnerabilities:**
- SQL injection (string concatenation)
- Command injection (`os.system`, `shell=True`)
- LDAP injection
- XML injection

### High Severity

**Weak Cryptography:**
- MD5 hashing
- SHA-1 hashing
- DES/3DES encryption
- Weak random number generation

**Insecure Configurations:**
- SSL/TLS verification disabled
- Debug mode in production
- Permissive CORS settings
- Insecure deserialization

### Medium Severity

**Path Traversal:**
- Unvalidated file paths
- Directory listing enabled
- Symlink following

**Information Disclosure:**
- Stack traces exposed
- Verbose error messages
- Debug information in responses

### Low Severity

**Code Quality:**
- Commented-out sensitive code
- TODO comments with security implications
- Deprecated security functions

## How to Use

### Basic File Scan

```
Scan this Python file for security issues:

[Paste code]
```

### Multi-File Analysis

```
Analyze these files for security vulnerabilities:

File: auth.py
[Code]

File: database.js
[Code]

Prioritize by severity and suggest fixes.
```

### Focused Scan

```
Check this code specifically for:
- SQL injection vulnerabilities
- Hardcoded credentials
- Weak cryptography

[Code]
```

## Example

**Input**:

```python
import hashlib
import os

# Database configuration
DB_PASSWORD = "admin123"  # TODO: move to env vars
DB_HOST = "localhost"

def authenticate_user(username, password):
    # Hash password with MD5
    password_hash = hashlib.md5(password.encode()).hexdigest()

    # Check against database
    query = f"SELECT * FROM users WHERE username='{username}' AND password='{password_hash}'"
    result = execute_query(query)

    return result is not None

def run_system_command(cmd):
    # Execute system command
    os.system(cmd)

def get_user_data(user_id):
    # Fetch user data
    eval(f"get_user_{user_id}()")
```

**Output**:

```
🔒 SECURITY SCAN RESULTS

Overall Security Score: 25/100 ❌ CRITICAL ISSUES FOUND

Files Scanned: 1
Total Issues: 6
  🔴 Critical: 3
  🟠 High: 2
  🟡 Medium: 1
  🟢 Low: 0

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔴 CRITICAL ISSUES (3)

1. Hardcoded Credentials
   Line 6: DB_PASSWORD = "admin123"
   Severity: CRITICAL
   Risk: Database password exposed in source code
   Impact: Unauthorized database access, data breach
   CWE: CWE-798 (Use of Hard-coded Credentials)

   Remediation:
   ✓ Move credentials to environment variables
   ✓ Use secrets management (HashiCorp Vault, AWS Secrets Manager)
   ✓ Never commit credentials to version control

   Example Fix:
   ```python
   import os
   DB_PASSWORD = os.environ.get('DB_PASSWORD')
   if not DB_PASSWORD:
       raise ValueError("DB_PASSWORD environment variable not set")
   ```

2. SQL Injection Vulnerability
   Line 13: query = f"SELECT * FROM users WHERE username='{username}'..."
   Severity: CRITICAL
   Risk: SQL injection attack possible
   Impact: Data breach, data manipulation, authentication bypass
   CWE: CWE-89 (SQL Injection)

   Remediation:
   ✓ Use parameterized queries
   ✓ Never concatenate user input into SQL
   ✓ Use ORM with automatic escaping

   Example Fix:
   ```python
   query = "SELECT * FROM users WHERE username=? AND password=?"
   result = execute_query(query, (username, password_hash))
   ```

3. Code Injection via eval()
   Line 23: eval(f"get_user_{user_id}()")
   Severity: CRITICAL
   Risk: Arbitrary code execution
   Impact: Complete system compromise, data theft, malware installation
   CWE: CWE-95 (Improper Neutralization of Directives in Code)

   Remediation:
   ✓ NEVER use eval() with user input
   ✓ Use safe alternatives (getattr, dictionaries)
   ✓ Validate and sanitize all inputs

   Example Fix:
   ```python
   user_functions = {
       'admin': get_user_admin,
       'regular': get_user_regular
   }
   func = user_functions.get(user_id)
   if func:
       func()
   ```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟠 HIGH SEVERITY ISSUES (2)

4. Weak Cryptography: MD5 Hashing
   Line 11: hashlib.md5(password.encode())
   Severity: HIGH
   Risk: Password hashes can be easily cracked
   Impact: User account compromise
   CWE: CWE-327 (Use of Broken Cryptography)

   Remediation:
   ✓ Use bcrypt, scrypt, or Argon2 for password hashing
   ✓ Add salt to prevent rainbow table attacks
   ✓ Use work factor to slow down brute force

   Example Fix:
   ```python
   import bcrypt
   password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
   ```

5. Command Injection Risk
   Line 19: os.system(cmd)
   Severity: HIGH
   Risk: Command injection if user input used
   Impact: Arbitrary command execution on server
   CWE: CWE-78 (OS Command Injection)

   Remediation:
   ✓ Use subprocess with argument list (not shell=True)
   ✓ Validate and whitelist allowed commands
   ✓ Avoid shell execution when possible

   Example Fix:
   ```python
   import subprocess
   subprocess.run(['ls', '-la'], check=True)  # Safe
   ```

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟡 MEDIUM SEVERITY ISSUES (1)

6. Insecure TODO Comment
   Line 6: # TODO: move to env vars
   Severity: MEDIUM
   Risk: Known security debt documented but not fixed
   Impact: Potential oversight in production deployment

   Remediation:
   ✓ Create ticket to track security improvements
   ✓ Set deadline for remediation
   ✓ Add to pre-production checklist

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 VULNERABILITY BREAKDOWN

Category Distribution:
  • Code Injection: 1 (CRITICAL)
  • SQL Injection: 1 (CRITICAL)
  • Hardcoded Secrets: 1 (CRITICAL)
  • Weak Crypto: 1 (HIGH)
  • Command Injection: 1 (HIGH)
  • Code Quality: 1 (MEDIUM)

Security Best Practices Violated:
  ❌ Input validation
  ❌ Secure credential storage
  ❌ Parameterized queries
  ❌ Strong cryptography
  ❌ Safe command execution

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ IMMEDIATE ACTIONS REQUIRED

1. Remove hardcoded password (Line 6) - CRITICAL
2. Fix SQL injection (Line 13) - CRITICAL
3. Remove eval() usage (Line 23) - CRITICAL
4. Upgrade to bcrypt for passwords (Line 11) - HIGH
5. Secure command execution (Line 19) - HIGH

Estimated Remediation Time: 2-3 hours
Risk Level: CRITICAL - DO NOT DEPLOY

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 RESOURCES

OWASP Top 10: https://owasp.org/Top10/
CWE Database: https://cwe.mitre.org/
Secure Coding Guide: https://www.securecoding.cert.org/
```

## Detection Patterns

### JavaScript Patterns

**Critical:**
- `eval(userInput)`
- `Function(userInput)`
- `setTimeout(userInput, ...)`
- `innerHTML = userInput` (XSS)

**High:**
- `Math.random()` for crypto
- Weak crypto libraries
- `dangerouslySetInnerHTML`

### Python Patterns

**Critical:**
- `eval()`, `exec()`, `compile()`
- `pickle.loads()` on untrusted data
- SQL string concatenation
- `os.system()`, `subprocess.call(..., shell=True)`

**High:**
- `hashlib.md5()`, `hashlib.sha1()`
- `random.random()` for security
- `yaml.load()` without SafeLoader

## Security Scoring

```
Security Score = 100 - (
  (Critical × 30) +
  (High × 15) +
  (Medium × 5) +
  (Low × 1)
)
```

**Score Interpretation:**
- 90-100: Excellent security posture
- 75-89: Good, minor improvements needed
- 50-74: Fair, important fixes required
- 25-49: Poor, significant vulnerabilities present
- 0-24: Critical, immediate action required

## Integration Examples

### Pre-commit Hook

```bash
#!/bin/bash
python security_scanner.py --files $(git diff --cached --name-only)
if [ $? -ne 0 ]; then
    echo "Security issues found. Commit blocked."
    exit 1
fi
```

### CI/CD Pipeline

```yaml
security-scan:
  script:
    - npm install -g security-scanner
    - security-scanner scan --path ./src --fail-on critical
```

## Limitations

- Pattern-based detection (may have false positives/negatives)
- Does not execute code (static analysis only)
- May miss context-dependent vulnerabilities
- Requires manual review for complex cases
- Not a replacement for comprehensive security testing
- Should be combined with DAST, penetration testing, and code review

## Best Practices

1. **Run Early and Often**: Scan during development, not just before deployment
2. **Fix Critical First**: Prioritize by severity and exploitability
3. **Educate Team**: Use findings as learning opportunities
4. **Track Metrics**: Monitor security debt over time
5. **Automate**: Integrate into CI/CD pipeline
6. **Combine Tools**: Use multiple scanners for better coverage
7. **Stay Updated**: Keep vulnerability patterns current

## Common Use Cases

- Pre-commit security checks
- Automated code review
- Security debt tracking
- Developer security training
- Compliance reporting
- Legacy code audits
- Third-party library assessment
