# Skill Creator

Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.

## Overview

This skill provides guidance for creating effective skills.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r skill-creator ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["skill-creator"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

Activate this skill when working on tasks related to skill-creator.

Claude will automatically use this skill's capabilities when relevant to your task.

For detailed usage instructions, refer to [SKILL.md](./SKILL.md).

## Inputs & Outputs

**Inputs:** Varies based on task requirements (see SKILL.md for details)

**Outputs:** Processed results according to skill specifications

## Limitations

- Requires appropriate environment setup (see Setup section)
- Performance depends on input complexity
- Refer to SKILL.md for specific constraints

## License

Complete terms in LICENSE.txt

## Learn More

For complete skill documentation, see [SKILL.md](./SKILL.md).
