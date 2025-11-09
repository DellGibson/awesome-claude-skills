# Video Downloader

Downloads videos from YouTube and other platforms for offline viewing, editing, or archival. Handles various formats and quality options.

## Overview

This skill downloads videos from YouTube and other platforms directly to your computer.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r video-downloader ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["video-downloader"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### Basic Download

```
Download this YouTube video: https://youtube.com/watch?v=...
```

```
Download this video in 1080p quality
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
