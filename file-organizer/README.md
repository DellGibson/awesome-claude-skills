# File Organizer

Intelligently organizes your files and folders across your computer by understanding context, finding duplicates, suggesting better structures, and automating cleanup tasks. Reduces cognitive load and keeps your digital workspace tidy without manual effort.

## Overview

This skill acts as your personal organization assistant, helping you maintain a clean, logical file structure across your computer without the mental overhead of constant manual organization.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r file-organizer ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["file-organizer"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### From Your Home Directory

```
cd ~
```

Then run Claude Code and ask for help:

```
Help me organize my Downloads folder
```

```
Find duplicate files in my Documents folder
```

```
Review my project directories and suggest improvements
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
