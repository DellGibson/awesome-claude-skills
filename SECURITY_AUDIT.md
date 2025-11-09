# Security Audit Report
**Generated:** November 9, 2025
**Repository:** awesome-claude-skills

## Executive Summary

**Files Scanned:** 193
**Total Findings:** 108
- 🔴 Critical: 0
- 🟠 High: 10
- 🟡 Medium: 98
- 🟢 Low: 0

## Findings by Category

### Insecure Network

**Total:** 95 finding(s)

| File | Line | Severity | Description | Context |
|------|------|----------|-------------|---------|
| `algorithmic-art/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `algorithmic-art/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `artifacts-builder/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `artifacts-builder/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `brand-guidelines/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `brand-guidelines/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `canvas-design/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `canvas-design/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 166 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 167 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 187 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 188 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 189 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 231 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 465 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 477 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 478 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml.md` | 479 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 70 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 71 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 75 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 78 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 81 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 89 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 90 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 91 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 92 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 93 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 94 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 95 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 96 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 97 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 98 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 99 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 100 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 101 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 102 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/base.py` | 103 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/docx.py` | 18 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/pptx.py` | 15 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/ooxml/scripts/validation/redlining.py` | 19 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 95 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 104 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 113 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 445 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 985 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 1219 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 1224 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 1229 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/docx/scripts/document.py` | 1234 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/html2pptx.md` | 122 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml.md` | 237 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml.md` | 321 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml.md` | 322 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml.md` | 327 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml.md` | 328 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 70 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 71 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 75 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 78 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 81 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 89 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 90 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 91 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 92 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 93 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 94 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 95 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 96 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 97 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 98 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 99 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 100 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 101 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 102 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/base.py` | 103 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/docx.py` | 18 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/pptx.py` | 15 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/ooxml/scripts/validation/redlining.py` | 19 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/scripts/inventory.py` | 168 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/scripts/rearrange.py` | 105 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/pptx/scripts/rearrange.py` | 116 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `document-skills/xlsx/recalc.py` | 37 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `internal-comms/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `internal-comms/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `mcp-builder/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `mcp-builder/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `skill-creator/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `skill-creator/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `slack-gif-creator/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `slack-gif-creator/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `theme-factory/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `theme-factory/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `webapp-testing/LICENSE.txt` | 4 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
| `webapp-testing/LICENSE.txt` | 196 | 🟡 MEDIUM | Insecure HTTP | `http://...` |
### Secrets

**Total:** 3 finding(s)

| File | Line | Severity | Description | Context |
|------|------|----------|-------------|---------|
| `mcp-builder/reference/evaluation.md` | 457 | 🟡 MEDIUM | Bearer Token | `Bearer token123...` |
| `mcp-builder/reference/evaluation.md` | 470 | 🟡 MEDIUM | Bearer Token | `Bearer token123...` |
| `mcp-builder/scripts/evaluation.py` | 315 | 🟡 MEDIUM | Bearer Token | `Bearer token...` |
### Unsafe Code

**Total:** 1 finding(s)

| File | Line | Severity | Description | Context |
|------|------|----------|-------------|---------|
| `algorithmic-art/templates/generator_template.js` | 133 | 🟠 HIGH | exec() usage | `exec(...` |
### Weak Crypto

**Total:** 9 finding(s)

| File | Line | Severity | Description | Context |
|------|------|----------|-------------|---------|
| `canvas-design/SKILL.md` | 15 | 🟠 HIGH | Weak cipher | `DES...` |
| `canvas-design/SKILL.md` | 82 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 13 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 36 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 51 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 203 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 208 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 360 | 🟠 HIGH | Weak cipher | `DES...` |
| `mcp-builder/reference/evaluation.md` | 362 | 🟠 HIGH | Weak cipher | `DES...` |

## Recommendations

### 🔴 Immediate Actions Required

1. **Review all CRITICAL and HIGH severity findings immediately**
2. **Remove or rotate any exposed credentials**
3. **Fix unsafe code patterns before deployment**

### Security Best Practices

#### Secrets Management
- Use environment variables for sensitive data
- Never commit credentials to version control
- Use secret management tools (e.g., AWS Secrets Manager, HashiCorp Vault)
- Rotate credentials regularly

#### Code Security
- Avoid `eval()` and `exec()` - use safer alternatives
- Use parameterized queries to prevent SQL injection
- Validate and sanitize all user inputs
- Enable SSL/TLS verification for all network requests

#### Cryptography
- Use SHA-256 or stronger for hashing
- Use `secrets` module for cryptographic randomness in Python
- Avoid deprecated ciphers (DES, RC4, MD5, SHA1)

## Automated Scanning

### Recommended Tools

**Python:**
- `bandit`: AST-based security linter
- `safety`: Checks dependencies for known vulnerabilities
- `pip-audit`: Audits Python dependencies

**JavaScript/TypeScript:**
- `npm audit`: Built-in npm vulnerability scanner
- `snyk`: Comprehensive security scanning
- `eslint-plugin-security`: ESLint security rules

**Multi-language:**
- `gitleaks`: Scan for secrets in git history
- `truffleHog`: Find secrets committed to repos
- `semgrep`: Static analysis for multiple languages

### CI/CD Integration

```yaml
# .github/workflows/security.yml
name: Security Scan
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Bandit
        run: pip install bandit && bandit -r . -f json -o bandit-report.json
      - name: Run Gitleaks
        uses: gitleaks/gitleaks-action@v2
```

## Conclusion

Found 108 potential security issue(s). Review each finding and implement recommended fixes. Prioritize CRITICAL and HIGH severity items.

---

**Last Updated:** November 9, 2025
**Next Review:** Quarterly or upon code changes
**Scan Type:** Automated static analysis
