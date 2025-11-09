# Recruiter Assistant

Parses résumé text and job requirements to generate candidate summaries, skills extraction, experience analysis, and job fit scoring (0-100) for efficient candidate screening.

## Overview

To accelerate your recruitment process, use this skill to parse résumés and match candidates to job requirements. The assistant extracts key information, analyzes experience relevance, and provides a quantitative fit score to help prioritize candidates.

## Setup

This skill is designed to work with Claude.ai, Claude Code, and the Claude API.

### Installation

**For Claude.ai:**
1. Click the skill icon (🧩) in your chat interface
2. Add this skill from the marketplace or upload the SKILL.md file

**For Claude Code:**
```bash
mkdir -p ~/.config/claude-code/skills/
cp -r recruiter-assistant ~/.config/claude-code/skills/
```

**For Claude API:**
```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    skills=["recruiter-assistant"],
    messages=[{"role": "user", "content": "Your prompt"}]
)
```

## Usage

Activate this skill when screening candidates or analyzing résumés.

Claude will automatically use this skill's capabilities when relevant to your task.

For detailed usage instructions, refer to [SKILL.md](./SKILL.md).

### Command Line Demo

```bash
cd recruiter-assistant
node src/index.js
```

**Sample Output:**

```
📋 CANDIDATE ANALYSIS

👤 Candidate: John Doe
📧 Email: john.doe@email.com
📍 Location: WA

🎯 OVERALL FIT SCORE: 92/100
   🌟 STRONG_HIRE

📊 SCORE BREAKDOWN

skills Match: 95/100 █████████░
experience Relevance: 90/100 █████████░
education Match: 100/100 ██████████
years Experience: 100/100 ██████████

💼 EXPERIENCE: 5 years
🎓 EDUCATION: Bachelor

🔧 SKILLS FOUND (9):
   Python, Django, React, PostgreSQL, Docker, AWS, Git, Leadership

🌟 STRENGTHS:
   • Leadership experience
   • Diverse skill set

💡 SUMMARY:
   John Doe has 5 years of experience with skills in Python, Django, React. Excellent match for the role.
```

## Inputs & Outputs

**Inputs:**
- `resumeText` (string, required): Candidate's résumé in plain text
- `jobRequirements` (object, required): Job requirements including skills, experience, education
- `roleTitle` (string, optional): Position title

**Outputs:**
- `overallFitScore` (number 0-100): Overall job fit score
- `scoreBreakdown` (object): Individual category scores
- `extractedSkills` (array): Skills found in résumé
- `yearsOfExperience` (number): Total years of professional experience
- `education` (array): Educational background
- `gaps` (array): Missing required qualifications
- `strengths` (array): Standout qualifications
- `recommendation` (enum): STRONG_HIRE | INTERVIEW | MAYBE | PASS
- `summary` (string): 2-3 sentence candidate overview

## Limitations

- Requires well-formatted résumés for accurate parsing
- May not capture all non-standard skills or experiences
- Scoring is based on keyword matching and heuristics
- Human judgment still required for final decisions
- Best used as initial screening tool, not sole hiring criterion
- Demo implementation uses simplified parsing logic

## License

Apache-2.0

## Learn More

For complete skill documentation, see [SKILL.md](./SKILL.md).
