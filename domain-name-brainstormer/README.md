# Domain Name Brainstormer

Generates creative domain name ideas for your project and checks availability across multiple TLDs (.com, .io, .dev, .ai, etc.). Saves hours of brainstorming and manual checking.

## Overview

This skill helps you find the perfect domain name for your project by generating creative options and checking what's actually available to register.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r domain-name-brainstormer ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["domain-name-brainstormer"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### Basic Brainstorming

```
I'm building a project management tool for remote teams. 
Suggest domain names.
```

```
Help me brainstorm domain names for a personal finance app
```

## Inputs & Outputs

**Inputs:** Varies based on task requirements (see SKILL.md for details)

**Outputs:** Processed results according to skill specifications

## Limitations

- Requires appropriate environment setup (see Setup section)
- Performance depends on input complexity
- Refer to SKILL.md for specific constraints

## License

See LICENSE.txt

## Learn More

For complete skill documentation, see [SKILL.md](./SKILL.md).
