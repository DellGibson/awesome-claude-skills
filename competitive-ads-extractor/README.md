# Competitive Ads Extractor

Extracts and analyzes competitors' ads from ad libraries (Facebook, LinkedIn, etc.) to understand what messaging, problems, and creative approaches are working. Helps inspire and improve your own ad campaigns.

## Overview

This skill extracts your competitors' ads from ad libraries and analyzes what's working—the problems they're highlighting, use cases they're targeting, and copy/creative that's resonating.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r competitive-ads-extractor ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["competitive-ads-extractor"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### Basic Extraction

```
Extract all current ads from [Competitor Name] on Facebook Ad Library
```

```
Scrape ads from [Company] and analyze their messaging
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
