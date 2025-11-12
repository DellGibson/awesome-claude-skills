---
name: dependency-upgrade-assistant
description: Checks for outdated dependencies, reports security vulnerabilities (CVEs), suggests upgrade strategies for package.json, requirements.txt, and Cargo.toml
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: productivity-organization
tags:
  - dependencies
  - security
  - updates
  - npm
  - pip
  - cargo
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Dependency Upgrade Assistant

Automatically check for outdated dependencies, identify security vulnerabilities, and get upgrade recommendations with migration guides for npm, pip, and cargo projects.

## What It Does

1. **Checks Outdated Packages** - Identifies available updates
2. **Security Scanning** - Reports known CVEs
3. **Breaking Changes** - Warns about major version bumps
4. **Upgrade Strategy** - Suggests safe upgrade paths
5. **Migration Guide** - Provides upgrade instructions
6. **Compatibility Check** - Verifies version compatibility

## Key Features

- **Multi-Platform**: npm, pip, cargo, composer
- **CVE Detection**: Security vulnerability scanning
- **Semver Analysis**: Major, minor, patch classification
- **Breaking Changes**: Identifies risky upgrades
- **Batch Updates**: Group compatible upgrades
- **Migration Guides**: Step-by-step upgrade instructions

## When to Use

- Regular dependency maintenance
- Security patch updates
- Before major releases
- Fixing vulnerabilities
- Modernizing dependencies

## Example Output

### Outdated Dependencies

```
Package: lodash
Current: 4.17.20
Latest: 4.17.21
Type: patch
Security: 1 CVE (CVE-2021-23337)
Recommendation: Upgrade immediately (security fix)

Package: react
Current: 17.0.2
Latest: 18.2.0
Type: major
Breaking Changes: Yes
Recommendation: Review migration guide before upgrading
```

### Upgrade Strategy

```
Phase 1 - Security Fixes (Immediate):
- lodash: 4.17.20 → 4.17.21 (CVE fix)
- axios: 0.21.1 → 0.21.4 (CVE fix)

Phase 2 - Minor Updates (Low Risk):
- express: 4.17.1 → 4.18.2
- dotenv: 10.0.0 → 16.0.3

Phase 3 - Major Updates (Review Required):
- react: 17.0.2 → 18.2.0 (breaking changes)
- jest: 27.0.0 → 29.0.0 (review docs)
```

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## License

Apache-2.0
