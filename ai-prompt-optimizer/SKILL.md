---
name: ai-prompt-optimizer
description: Analyzes and refines user prompts for AI interactions, providing actionable feedback on clarity, conciseness, tone, and effectiveness to maximize response quality.
license: Apache-2.0
---

# AI Prompt Optimizer

Optimize your AI prompts for better results through automated analysis and refinement suggestions.

## Overview

To improve your AI interactions, use this skill to analyze prompts before submitting them. The optimizer evaluates clarity, conciseness, tone, specificity, and context completeness, then provides graded feedback and refined versions.

**Keywords**: prompt engineering, AI optimization, clarity analysis, prompt refinement, response quality, effective prompting

## When to Use This Skill

- Before submitting complex prompts to AI systems
- When responses aren't meeting expectations
- To learn prompt engineering best practices
- For team standardization of AI interactions
- When onboarding new users to AI tools

## What This Skill Does

1. **Clarity Analysis**: Evaluates ambiguity, vague terms, and structural issues
2. **Conciseness Check**: Identifies unnecessary verbosity and redundancy
3. **Tone Assessment**: Analyzes formality, directness, and appropriateness
4. **Specificity Score**: Measures concrete details vs. general statements
5. **Context Completeness**: Checks for missing background information
6. **Refinement Suggestions**: Provides improved prompt versions

## Analysis Criteria

### Clarity (0-100)
- **90-100**: Crystal clear, unambiguous
- **70-89**: Clear with minor improvements possible
- **50-69**: Somewhat clear but has ambiguities
- **Below 50**: Requires significant clarification

### Conciseness (0-100)
- **90-100**: Optimally concise
- **70-89**: Mostly concise with minor redundancy
- **50-69**: Moderately verbose
- **Below 50**: Excessively wordy

### Tone Appropriateness (0-100)
- **90-100**: Perfect for intended audience
- **70-89**: Generally appropriate
- **50-69**: Tone issues present
- **Below 50**: Inappropriate tone

### Specificity (0-100)
- **90-100**: Highly specific with concrete details
- **70-89**: Good specificity
- **50-69**: Somewhat vague
- **Below 50**: Too general

### Context Completeness (0-100)
- **90-100**: All necessary context provided
- **70-89**: Mostly complete
- **50-69**: Missing some context
- **Below 50**: Insufficient context

## How to Use

### Basic Usage

Simply provide your prompt for analysis:

```
Analyze this prompt: "Can you help me write some code?"
```

### Advanced Usage

Request specific optimization focus:

```
Optimize this prompt for technical clarity:
"I need to build a REST API that handles user authentication and stores data."

Focus areas: specificity, technical detail, security considerations
```

### Batch Analysis

Analyze multiple prompts:

```
Compare these three prompt variations and recommend the best:
1. "Write a function to sort data"
2. "Create a Python function that sorts a list of dictionaries by a specific key"
3. "Implement an efficient sorting algorithm in Python for a list of user objects,
   sorted by registration date in descending order"
```

## Example

**Input Prompt**:
```
"Can you help me with my website?"
```

**Analysis Output**:
```
📊 Prompt Analysis Results

Overall Score: 35/100 ⚠️ Needs Improvement

Breakdown:
• Clarity: 40/100 - Too vague, unclear what help is needed
• Conciseness: 95/100 - Appropriately brief
• Tone: 85/100 - Polite and appropriate
• Specificity: 15/100 - Extremely general, no details
• Context: 20/100 - Missing all relevant context

Issues Identified:
❌ No information about the website type or platform
❌ "Help" is too broad - coding, design, content, or SEO?
❌ No mention of specific problems or goals
❌ Missing technical constraints or preferences

Refined Prompt:
"I need help debugging a responsive layout issue on my React e-commerce website.
The product grid breaks on mobile devices (< 768px width). The site uses Tailwind CSS.
Can you review my component code and suggest fixes?"

Improvement: +60 points (35 → 95)

Key Changes:
✓ Specified the problem (responsive layout issue)
✓ Added platform details (React, Tailwind CSS)
✓ Defined scope (product grid on mobile)
✓ Clear request (review code, suggest fixes)
✓ Technical constraint (< 768px width)
```

## Best Practices

### ✅ Do's

- **Be Specific**: Include concrete details, numbers, and constraints
- **Provide Context**: Share relevant background information
- **State Goals Clearly**: What outcome do you want?
- **Define Constraints**: Mention limitations, preferences, tech stack
- **Use Examples**: Show sample inputs/outputs when applicable

### ❌ Don'ts

- **Avoid Vagueness**: "Make it better" → "Improve response time by 50%"
- **Don't Assume Context**: AI doesn't know your previous work
- **Skip Jargon**: Unless technical precision is needed
- **Avoid Yes/No Questions**: When you want detailed responses
- **Don't Overload**: One focused request per prompt

## Common Prompt Patterns

### Task-Based Pattern
```
Task: [What you want done]
Context: [Relevant background]
Constraints: [Limitations or requirements]
Format: [Expected output format]
```

### Problem-Solution Pattern
```
Problem: [Specific issue you're facing]
What I've Tried: [Previous attempts]
Environment: [Technical details]
Expected Outcome: [Desired result]
```

### Analysis Pattern
```
Subject: [What to analyze]
Criteria: [Evaluation standards]
Comparison: [Benchmarks or alternatives]
Deliverable: [Report format]
```

## Optimization Tips

1. **Start Broad, Then Specify**: Begin with general intent, add details iteratively
2. **Front-Load Important Info**: Put crucial context first
3. **Use Structured Formats**: Lists, sections, and clear separations
4. **Include Success Criteria**: Define what "good" looks like
5. **Test and Iterate**: Refine based on response quality

## Integration Examples

### With Code Editors
```javascript
// Before submitting to AI
const userPrompt = "Fix my sorting function";
const optimized = optimizePrompt(userPrompt);
// Returns: "Debug this JavaScript array sorting function that should sort
// user objects by lastName (ascending), then firstName (ascending).
// Currently returns incorrect order. Code: [function implementation]"
```

### With Team Workflows
```markdown
## Prompt Review Checklist
- [ ] Clarity score > 80
- [ ] Specificity score > 75
- [ ] All context provided
- [ ] Expected output format defined
- [ ] Success criteria stated
```

## Metrics and Scoring

### Overall Effectiveness Formula
```
Overall Score = (
  Clarity × 0.30 +
  Specificity × 0.25 +
  Context × 0.20 +
  Conciseness × 0.15 +
  Tone × 0.10
)
```

### Scoring Rubric
- **90-100**: Excellent - Ready to use
- **75-89**: Good - Minor tweaks recommended
- **60-74**: Fair - Needs improvement
- **Below 60**: Poor - Significant revision required

## Limitations

- Analysis is based on structural patterns, not domain expertise
- Scoring is relative and context-dependent
- Some creative or exploratory prompts may score lower despite being appropriate
- Technical jargon may be flagged as unclear even when necessary
- Brevity vs. completeness trade-offs require human judgment

## Tips

- Iterate: First analysis → refine → re-analyze for improvement tracking
- Save high-scoring prompts as templates for similar future tasks
- Use refinement suggestions as learning tools for prompt engineering
- Combine with domain expertise for best results
- Track score improvements over time to measure learning

## Common Use Cases

- Technical documentation requests
- Code generation prompts
- Data analysis queries
- Creative writing briefs
- Research and summarization tasks
- Customer support inquiries
- Educational content creation
