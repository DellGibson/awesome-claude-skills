# Ai Prompt Optimizer

Analyzes and refines user prompts for AI interactions, providing actionable feedback on clarity, conciseness, tone, and effectiveness to maximize response quality.

## Overview

To improve your AI interactions, use this skill to analyze prompts before submitting them. The optimizer evaluates clarity, conciseness, tone, specificity, and context completeness, then provides graded feedback and refined versions.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r ai-prompt-optimizer ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["ai-prompt-optimizer"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

Activate this skill when working on tasks related to ai-prompt-optimizer.

Claude will automatically use this skill's capabilities when relevant to your task.

For detailed usage instructions, refer to [SKILL.md](./SKILL.md).

### Command Line Demo

The skill includes a demonstration implementation:

```bash
cd ai-prompt-optimizer
node src/index.js "Can you help me write some code?"
```

**Sample Output:**

```
📊 Prompt Analysis Results

Overall Score: 32/100 ❌ Needs Improvement

Breakdown:
  Clarity: 35/100 ███░░░░░░░
  Conciseness: 90/100 █████████░
  Tone: 80/100 ████████░░
  Specificity: 10/100 █░░░░░░░░░
  Context: 5/100 ░░░░░░░░░░

Issues Identified:
  ❌ Prompt lacks specific details
     💡 Include technical details, numbers, formats, or concrete examples
  ⚠️ Insufficient background information provided
     💡 Add context about your environment, constraints, or previous attempts

Refined Prompt:
  "Context: [Add relevant background information]
implement a specific solution to you help me write some code?

Please include:
- Specific requirements
- Technical constraints
- Expected output format"

Improvement: +63 points

Key Changes:
  ✓ Added context section
  ✓ Replaced vague verbs with specific actions
  ✓ Added structure for requirements and constraints
  ✓ Expanded with additional detail
```

### Better Example

```bash
node src/index.js "Create a Python function that validates email addresses using regex"
```

**Output:**

```
📊 Prompt Analysis Results

Overall Score: 78/100 ✅ Good

Breakdown:
  Clarity: 85/100 ████████░░
  Conciseness: 95/100 █████████░
  Tone: 70/100 ███████░░░
  Specificity: 80/100 ████████░░
  Context: 55/100 █████░░░░░

Issues Identified:
  ⚠️ Insufficient background information provided
     💡 Add context about your environment, constraints, or previous attempts

Refined Prompt:
  "Create a Python function that validates email addresses using regex

Please include:
- Specific requirements
- Technical constraints
- Expected output format"

Improvement: +17 points

Key Changes:
  ✓ Added structure for requirements and constraints
  ✓ Expanded with additional detail
```

## Inputs & Outputs

**Inputs:**
- `prompt` (string, required): The prompt text to analyze
- `focusAreas` (array, optional): Specific areas to focus on
- `targetAudience` (string, optional): Intended audience type
- `detailLevel` (string, optional): Analysis detail level

**Outputs:**
- `overallScore` (number 0-100): Overall effectiveness score
- `scores` (object): Individual category scores
- `issues` (array): Identified problems with severity levels
- `refinedPrompt` (string): Optimized version
- `improvements` (array): List of key changes made
- `scoreImprovement` (number): Points gained

## Limitations

- Analysis is based on structural patterns, not domain expertise
- Scoring is relative and context-dependent
- Some creative or exploratory prompts may score lower despite being appropriate
- Technical jargon may be flagged as unclear even when necessary
- Brevity vs. completeness trade-offs require human judgment
- Demo implementation uses simplified heuristics

## License

Apache-2.0

## Learn More

For complete skill documentation, see [SKILL.md](./SKILL.md).
