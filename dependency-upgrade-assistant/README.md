# Dependency Upgrade Assistant

Check for outdated dependencies, identify security vulnerabilities (CVEs), and get safe upgrade strategies for npm, pip, and cargo projects.

## Features

- **Outdated Detection**: Identifies available updates
- **Security Scanning**: Reports known CVEs
- **Semver Analysis**: Major, minor, patch classification
- **Upgrade Strategy**: Phased update recommendations
- **Migration Guides**: Step-by-step instructions
- **Multi-Platform**: npm, pip, cargo

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## Usage

Ask Claude:
> "Check my package.json for outdated dependencies and security vulnerabilities: [paste file]"

Output includes:
1. **Outdated List** - All updates available
2. **Security Issues** - CVEs with severity
3. **Upgrade Strategy** - Phased approach
4. **Migration Guide** - Update instructions

## Best Practices

- Update security patches immediately
- Group minor updates together
- Test major updates separately
- Read changelogs before major updates
- Use lock files (package-lock.json)

## Related Skills

- **ci-cd-pipeline-generator**: Automate dependency checks
- **security-scanner**: Additional security scanning

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
