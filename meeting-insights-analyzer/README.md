# Meeting Insights Analyzer

Analyzes meeting transcripts and recordings to uncover behavioral patterns, communication insights, and actionable feedback. Identifies when you avoid conflict, use filler words, dominate conversations, or miss opportunities to listen. Perfect for professionals seeking to improve their communication and leadership skills.

## Overview

This skill transforms your meeting transcripts into actionable insights about your communication patterns, helping you become a more effective communicator and leader.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r meeting-insights-analyzer ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["meeting-insights-analyzer"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### Basic Setup

1. Download your meeting transcripts to a folder (e.g., `~/meetings/`)
2. Navigate to that folder in Claude Code
3. Ask for the analysis you want

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
