---
name: technical-documentation-writer
description: Generates comprehensive technical documentation including README files, architecture docs, API references, and getting started guides from code and project structure
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: communication-writing
tags:
  - documentation
  - readme
  - technical-writing
  - markdown
  - architecture
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# Technical Documentation Writer

Automatically generate professional technical documentation from code, project structure, and specifications. Creates README files, architecture diagrams, API references, and getting started guides.

## What It Does

1. **Generates README.md** - Complete project documentation
2. **Architecture Docs** - System design and component diagrams
3. **API References** - Endpoint documentation with examples
4. **Getting Started** - Installation and setup guides
5. **Contribution Guidelines** - CONTRIBUTING.md files
6. **Code Documentation** - Inline comment suggestions

## Key Features

- **Auto-Detection**: Analyzes project structure
- **Multi-Section**: Overview, features, installation, usage, API, contributing
- **Code Examples**: Realistic usage examples
- **Diagrams**: Mermaid architecture diagrams
- **Badges**: CI/CD, version, license badges
- **TOC**: Automatic table of contents

## When to Use

- Create README for new projects
- Document existing codebases
- Generate API documentation
- Write architecture guides
- Create contributing guidelines

## Example Output

```markdown
# Project Name

Professional project documentation with clear structure, code examples, and diagrams.

## Features

- Feature 1
- Feature 2

## Installation

\`\`\`bash
npm install project-name
\`\`\`

## Usage

\`\`\`javascript
const project = require('project-name');
project.doSomething();
\`\`\`

## API Reference

### `doSomething(options)`

Does something useful.

## Contributing

Pull requests welcome!

## License

MIT
```

## Installation

Available in Claude.ai, Claude Code, and Claude API.

## License

Apache-2.0
