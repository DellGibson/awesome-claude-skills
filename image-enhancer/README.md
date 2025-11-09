# Image Enhancer

Improves the quality of images, especially screenshots, by enhancing resolution, sharpness, and clarity. Perfect for preparing images for presentations, documentation, or social media posts.

## Overview

This skill takes your images and screenshots and makes them look better—sharper, clearer, and more professional.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r image-enhancer ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["image-enhancer"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

### Basic Enhancement

```
Improve the image quality of screenshot.png
```

```
Enhance all images in this folder
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
