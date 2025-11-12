---
name: recruiter-assistant
description: Parses résumé text and job requirements to generate candidate summaries, skills extraction, experience analysis, and job fit scoring (0-100) for efficient candidate screening.
license: Apache-2.0
---

# Recruiter Assistant

Streamline candidate screening with automated résumé analysis and job fit scoring.

## Overview

To accelerate your recruitment process, use this skill to parse résumés and match candidates to job requirements. The assistant extracts key information, analyzes experience relevance, and provides a quantitative fit score to help prioritize candidates.

**Keywords**: recruitment, résumé parsing, candidate screening, ATS, job matching, skills extraction, hiring automation, talent acquisition

## When to Use This Skill

- Initial résumé screening for job openings
- Bulk candidate evaluation and ranking
- Skills gap analysis between candidates and roles
- Quick candidate summaries for hiring managers
- Standardizing candidate assessment criteria
- Building candidate pipelines efficiently

## What This Skill Does

1. **Information Extraction**: Parses contact info, education, experience, skills
2. **Skills Categorization**: Groups technical, soft, and domain skills
3. **Experience Analysis**: Calculates total years and relevance to role
4. **Education Matching**: Verifies degree requirements
5. **Fit Scoring**: Generates 0-100 match score with breakdowns
6. **Gap Identification**: Highlights missing required qualifications
7. **Candidate Summary**: Creates concise 2-3 sentence overviews

## Scoring Methodology

### Overall Fit Score (0-100)

```
Fit Score = (
  Skills Match × 0.40 +
  Experience Relevance × 0.30 +
  Education Match × 0.15 +
  Years of Experience × 0.10 +
  Location/Availability × 0.05
)
```

### Component Scoring

**Skills Match (0-100)**
- Required skills present: +20 points each
- Preferred skills present: +10 points each
- Advanced/expert level in key skills: +5 bonus points each
- Penalized for missing critical required skills

**Experience Relevance (0-100)**
- Directly relevant role: 100 points
- Similar industry/function: 70-90 points
- Transferable experience: 40-60 points
- Unrelated background: 0-30 points

**Education Match (0-100)**
- Exceeds requirements: 100 points
- Meets exactly: 85 points
- One level below: 60 points
- Unmet education requirement: 30 points
- Compensating experience: +20 points

**Years of Experience (0-100)**
- At or above requirement: 100 points
- 1 year below: 80 points
- 2 years below: 60 points
- 3+ years below: 40 points or less

## How to Use

### Basic Usage

Provide résumé text and job requirements:

```
Analyze this candidate:

Résumé:
[Paste résumé text]

Job Requirements:
- 3+ years Python development
- Experience with Django and React
- Bachelor's in Computer Science
- Strong SQL skills
```

### Advanced Usage with Detailed Requirements

```
Screen this candidate against our Senior Backend Engineer role:

Candidate Résumé:
[Paste résumé]

Job Requirements:
Required Skills:
- Python (expert level)
- Django or Flask
- PostgreSQL/MySQL
- RESTful API design
- Git version control

Preferred Skills:
- Docker/Kubernetes
- AWS/GCP experience
- CI/CD pipelines
- Microservices architecture

Experience:
- Minimum 5 years backend development
- Minimum 2 years team leadership

Education:
- Bachelor's degree in CS or related field

Location: Remote (US time zones)
```

### Batch Comparison

```
Compare these three candidates for the same role and rank them:

Candidate 1:
[Résumé 1]

Candidate 2:
[Résumé 2]

Candidate 3:
[Résumé 3]

Job Requirements:
[Requirements]

Provide rankings with justification.
```

## Example

**Input**:

```
Résumé:
Sarah Chen
sarah.chen@email.com | (555) 123-4567 | Seattle, WA

EXPERIENCE
Senior Software Engineer | TechCorp Inc | 2020-Present
- Led development of Python/Django backend services
- Designed and implemented RESTful APIs serving 1M+ users
- Managed PostgreSQL databases and optimized query performance
- Mentored team of 3 junior engineers

Software Engineer | StartupXYZ | 2018-2020
- Built React frontend applications
- Developed Flask-based microservices
- Implemented CI/CD with Jenkins and Docker

EDUCATION
B.S. Computer Science | University of Washington | 2018
GPA: 3.7/4.0

SKILLS
Languages: Python, JavaScript, SQL
Frameworks: Django, Flask, React
Tools: Git, Docker, PostgreSQL, AWS
Soft Skills: Team leadership, code review, technical mentorship

Job Requirements:
- 3+ years Python backend development
- Django or Flask experience
- SQL database management
- Bachelor's in CS or related
- Team collaboration skills
```

**Output**:

```
📋 CANDIDATE ANALYSIS

👤 Candidate: Sarah Chen
📧 Contact: sarah.chen@email.com
📍 Location: Seattle, WA

🎯 OVERALL FIT SCORE: 92/100
   ⭐ Strong Match - Highly Recommended

📊 SCORE BREAKDOWN

Skills Match: 95/100 ⭐⭐⭐⭐⭐
✅ Python (Expert level - 5 years)
✅ Django (Senior level - 3+ years)
✅ Flask (Mid level - 2 years)
✅ SQL/PostgreSQL (Strong experience)
✅ Git version control
⭐ Bonus: Team leadership experience

Experience Relevance: 95/100 ⭐⭐⭐⭐⭐
✅ 5 years total backend development
✅ 3+ years in Python/Django (exceeds requirement)
✅ Direct experience with all required technologies
✅ Scale experience (1M+ users)
⭐ Leadership experience (bonus for senior roles)

Education Match: 100/100 ⭐⭐⭐⭐⭐
✅ B.S. Computer Science (meets requirement)
✅ Reputable university
✅ Strong GPA (3.7/4.0)

Years of Experience: 90/100 ⭐⭐⭐⭐⭐
✅ 5 years total (exceeds 3+ requirement)
✅ Progressive career growth

🎓 EDUCATION
B.S. Computer Science, University of Washington (2018)
Status: Meets requirement ✅

💼 EXPERIENCE SUMMARY
• 5 years total software engineering
• 3+ years Python/Django backend development
• 2 years team leadership
• Experience scaling systems to 1M+ users

🔧 TECHNICAL SKILLS
Required (all present):
✅ Python (Expert - 5 years)
✅ Django (Senior - 3 years)
✅ SQL/PostgreSQL (Strong)
✅ Backend development (5 years)

Additional strengths:
• Flask framework
• React frontend
• CI/CD (Jenkins, Docker)
• AWS cloud platform
• API design & implementation

🌟 STANDOUT QUALIFICATIONS
1. Exceeds experience requirement (5 vs 3 years)
2. Leadership experience mentoring engineers
3. Proven ability to scale systems (1M+ users)
4. Full-stack capabilities (React + backend)
5. Modern DevOps practices (Docker, CI/CD)

⚠️ GAPS/CONSIDERATIONS
None - candidate exceeds all stated requirements

💡 RECOMMENDATION
STRONG HIRE - Candidate significantly exceeds requirements with 5 years of
directly relevant Python/Django experience, proven leadership skills, and
experience scaling production systems. Excellent match for roles requiring
both technical depth and team collaboration.

Suggested Interview Focus:
• System design and architecture decisions
• Leadership and mentorship approach
• Specific Django optimization techniques
• AWS infrastructure experience

Next Steps: Schedule technical interview immediately
Priority: HIGH
