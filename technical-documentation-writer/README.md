# Technical Documentation Writer

Generate comprehensive technical documentation including README files, architecture docs, API references, and getting started guides from code and project structure.

## Features

- **README Generation**: Complete project documentation
- **Architecture Docs**: System design with Mermaid diagrams
- **API References**: Endpoint documentation
- **Getting Started**: Installation and setup guides
- **Contributing**: Guidelines for contributors
- **Auto-Detection**: Analyzes project structure

## Installation

### Claude.ai

Upload or reference `technical-documentation-writer` skill in Claude.ai.

### Claude Code

Install via Skills > Install Skill > `technical-documentation-writer`.

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")
response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["technical-documentation-writer"],
    messages=[{"role": "user", "content": "Generate README for my project"}]
)
```

## Usage

Ask Claude:
> "Generate a comprehensive README for my project with installation instructions, usage examples, and API documentation"

Output includes complete markdown documentation ready to use.

## Best Practices

- Include project description
- Add realistic code examples
- Use badges for CI/CD status
- Include contribution guidelines
- Add architecture diagrams
- Document all APIs

## Related Skills

- **api-documentation-generator**: Detailed API docs
- **database-schema-designer**: Database documentation
- **code-refactoring-assistant**: Code quality docs

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
