#!/usr/bin/env node
/**
 * Recruiter Assistant - Demo Implementation
 * Parses résumés and calculates job fit scores
 */

class RecruiterAssistant {
  constructor() {
    this.weights = {
      skillsMatch: 0.40,
      experienceRelevance: 0.30,
      educationMatch: 0.15,
      yearsExperience: 0.10,
      location: 0.05
    };
  }

  /**
   * Analyze a candidate's résumé against job requirements
   * @param {string} resumeText - The résumé text
   * @param {object} jobRequirements - Job requirements object
   * @returns {object} Analysis results with scores and recommendations
   */
  analyzeCandidate(resumeText, jobRequirements) {
    const candidateInfo = this.extractContactInfo(resumeText);
    const extractedSkills = this.extractSkills(resumeText);
    const yearsOfExperience = this.extractYearsExperience(resumeText);
    const education = this.extractEducation(resumeText);

    const scores = {
      skillsMatch: this.calculateSkillsMatch(extractedSkills, jobRequirements),
      experienceRelevance: this.calculateExperienceRelevance(resumeText, jobRequirements),
      educationMatch: this.calculateEducationMatch(education, jobRequirements.educationLevel || 'Bachelor'),
      yearsExperience: this.calculateYearsScore(yearsOfExperience, jobRequirements.minYearsExperience || 0)
    };

    const overallFitScore = this.calculateOverallScore(scores);
    const gaps = this.identifyGaps(extractedSkills, jobRequirements);
    const strengths = this.identifyStrengths(resumeText, extractedSkills, jobRequirements);
    const recommendation = this.getRecommendation(overallFitScore);
    const summary = this.generateSummary(candidateInfo.name, yearsOfExperience, extractedSkills, overallFitScore);

    return {
      candidateInfo,
      overallFitScore: Math.round(overallFitScore),
      scoreBreakdown: this.roundScores(scores),
      extractedSkills,
      yearsOfExperience,
      education,
      gaps,
      strengths,
      recommendation,
      summary
    };
  }

  extractContactInfo(resumeText) {
    const emailMatch = resumeText.match(/[\w.-]+@[\w.-]+\.\w+/);
    const phoneMatch = resumeText.match(/\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    const lines = resumeText.split('\n');
    const name = lines[0].trim();

    return {
      name: name || 'Unknown',
      email: emailMatch ? emailMatch[0] : null,
      phone: phoneMatch ? phoneMatch[0] : null,
      location: this.extractLocation(resumeText)
    };
  }

  extractLocation(resumeText) {
    const states = ['CA', 'NY', 'TX', 'WA', 'IL', 'MA', 'CO', 'OR', 'FL'];
    for (const state of states) {
      if (resumeText.includes(state)) {
        return state;
      }
    }
    return null;
  }

  extractSkills(resumeText) {
    const commonSkills = [
      'Python', 'JavaScript', 'Java', 'C++', 'Ruby', 'Go', 'TypeScript',
      'Django', 'Flask', 'React', 'Angular', 'Vue', 'Node.js', 'Express',
      'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis',
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure',
      'Git', 'CI/CD', 'Jenkins', 'GitLab',
      'Leadership', 'Communication', 'Teamwork', 'Problem-solving'
    ];

    const foundSkills = [];
    const lowerText = resumeText.toLowerCase();

    for (const skill of commonSkills) {
      if (lowerText.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }

    return foundSkills;
  }

  extractYearsExperience(resumeText) {
    const yearMatches = resumeText.match(/\d{4}/g);
    if (!yearMatches || yearMatches.length < 2) return 0;

    const years = yearMatches.map(y => parseInt(y)).sort();
    const currentYear = new Date().getFullYear();
    const earliestYear = Math.min(...years);

    return Math.min(currentYear - earliestYear, 30); // Cap at 30 years
  }

  extractEducation(resumeText) {
    const education = [];
    const degreePatterns = [
      { pattern: /Ph\.?D\.?|Doctorate/i, level: 'PhD' },
      { pattern: /Master|M\.S\.|M\.A\.|MBA/i, level: 'Master' },
      { pattern: /Bachelor|B\.S\.|B\.A\./i, level: 'Bachelor' },
      { pattern: /Associate|A\.S\.|A\.A\./i, level: 'Associate' }
    ];

    for (const { pattern, level } of degreePatterns) {
      if (pattern.test(resumeText)) {
        education.push({ degree: level, institution: 'Unknown', year: null });
        break; // Take highest degree found
      }
    }

    return education;
  }

  calculateSkillsMatch(extractedSkills, jobRequirements) {
    if (!jobRequirements.requiredSkills) return 50;

    const requiredSkills = jobRequirements.requiredSkills || [];
    const preferredSkills = jobRequirements.preferredSkills || [];

    let score = 0;
    let matched = 0;

    // Required skills (critical)
    for (const required of requiredSkills) {
      const hasSkill = extractedSkills.some(skill =>
        skill.toLowerCase() === required.toLowerCase()
      );
      if (hasSkill) {
        score += 20;
        matched++;
      }
    }

    // Preferred skills (bonus)
    for (const preferred of preferredSkills) {
      const hasSkill = extractedSkills.some(skill =>
        skill.toLowerCase() === preferred.toLowerCase()
      );
      if (hasSkill) {
        score += 10;
      }
    }

    // Penalty for missing required skills
    const missingRequired = requiredSkills.length - matched;
    score -= missingRequired * 15;

    return Math.max(0, Math.min(100, score));
  }

  calculateExperienceRelevance(resumeText, jobRequirements) {
    let score = 60; // Base score

    const keywords = jobRequirements.requiredSkills || [];
    const lowerText = resumeText.toLowerCase();

    // Check for keyword mentions in experience section
    let mentionCount = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        mentionCount++;
      }
    }

    score += (mentionCount / Math.max(keywords.length, 1)) * 40;

    return Math.min(100, score);
  }

  calculateEducationMatch(education, requiredLevel) {
    if (education.length === 0) return 30;

    const levels = {
      'High School': 1,
      'Associate': 2,
      'Bachelor': 3,
      'Master': 4,
      'PhD': 5
    };

    const candidateLevel = levels[education[0].degree] || 0;
    const requiredLevelNum = levels[requiredLevel] || 3;

    if (candidateLevel >= requiredLevelNum) {
      return 100;
    } else if (candidateLevel === requiredLevelNum - 1) {
      return 60;
    } else {
      return 30;
    }
  }

  calculateYearsScore(yearsOfExperience, minRequired) {
    if (yearsOfExperience >= minRequired) return 100;
    if (yearsOfExperience >= minRequired - 1) return 80;
    if (yearsOfExperience >= minRequired - 2) return 60;
    return 40;
  }

  calculateOverallScore(scores) {
    return (
      scores.skillsMatch * this.weights.skillsMatch +
      scores.experienceRelevance * this.weights.experienceRelevance +
      scores.educationMatch * this.weights.educationMatch +
      scores.yearsExperience * this.weights.yearsExperience
    );
  }

  identifyGaps(extractedSkills, jobRequirements) {
    const gaps = [];
    const requiredSkills = jobRequirements.requiredSkills || [];

    for (const required of requiredSkills) {
      const hasSkill = extractedSkills.some(skill =>
        skill.toLowerCase() === required.toLowerCase()
      );
      if (!hasSkill) {
        gaps.push(`Missing required skill: ${required}`);
      }
    }

    return gaps;
  }

  identifyStrengths(resumeText, extractedSkills, jobRequirements) {
    const strengths = [];

    if (extractedSkills.length > 10) {
      strengths.push('Diverse skill set');
    }

    if (resumeText.toLowerCase().includes('lead') || resumeText.toLowerCase().includes('senior')) {
      strengths.push('Leadership experience');
    }

    if (resumeText.toLowerCase().includes('scale') || resumeText.toLowerCase().includes('million')) {
      strengths.push('Experience with scale');
    }

    return strengths;
  }

  getRecommendation(score) {
    if (score >= 85) return 'STRONG_HIRE';
    if (score >= 70) return 'INTERVIEW';
    if (score >= 50) return 'MAYBE';
    return 'PASS';
  }

  generateSummary(name, years, skills, score) {
    const skillsList = skills.slice(0, 3).join(', ');
    const level = score >= 85 ? 'Excellent' : score >= 70 ? 'Strong' : 'Adequate';

    return `${name} has ${years} years of experience with skills in ${skillsList}. ${level} match for the role.`;
  }

  roundScores(scores) {
    const rounded = {};
    for (const [key, value] of Object.entries(scores)) {
      rounded[key] = Math.round(value);
    }
    return rounded;
  }

  formatOutput(result) {
    console.log('\n📋 CANDIDATE ANALYSIS\n');
    console.log(`👤 Candidate: ${result.candidateInfo.name}`);
    if (result.candidateInfo.email) console.log(`📧 Email: ${result.candidateInfo.email}`);
    if (result.candidateInfo.location) console.log(`📍 Location: ${result.candidateInfo.location}`);

    console.log(`\n🎯 OVERALL FIT SCORE: ${result.overallFitScore}/100`);
    console.log(`   ${this.getRecommendationIcon(result.recommendation)} ${result.recommendation}\n`);

    console.log('📊 SCORE BREAKDOWN\n');
    for (const [category, score] of Object.entries(result.scoreBreakdown)) {
      const bar = this.createBar(score);
      const label = category.replace(/([A-Z])/g, ' $1').trim();
      console.log(`${label}: ${score}/100 ${bar}`);
    }

    console.log(`\n💼 EXPERIENCE: ${result.yearsOfExperience} years`);
    console.log(`🎓 EDUCATION: ${result.education.length > 0 ? result.education[0].degree : 'Not specified'}`);

    console.log(`\n🔧 SKILLS FOUND (${result.extractedSkills.length}):`);
    console.log(`   ${result.extractedSkills.join(', ')}`);

    if (result.gaps.length > 0) {
      console.log('\n⚠️ GAPS:');
      result.gaps.forEach(gap => console.log(`   • ${gap}`));
    }

    if (result.strengths.length > 0) {
      console.log('\n🌟 STRENGTHS:');
      result.strengths.forEach(strength => console.log(`   • ${strength}`));
    }

    console.log(`\n💡 SUMMARY:\n   ${result.summary}\n`);
  }

  getRecommendationIcon(recommendation) {
    const icons = {
      STRONG_HIRE: '🌟',
      INTERVIEW: '✅',
      MAYBE: '🤔',
      PASS: '❌'
    };
    return icons[recommendation] || '❓';
  }

  createBar(score) {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// CLI Interface
if (require.main === module) {
  const sampleResume = `
John Doe
john.doe@email.com | (555) 123-4567 | Seattle, WA

EXPERIENCE
Senior Software Engineer | TechCorp | 2020-Present
- Python and Django backend development
- PostgreSQL database management
- Led team of 3 engineers

Software Engineer | StartupXYZ | 2018-2020
- Built React applications
- Worked with AWS and Docker

EDUCATION
B.S. Computer Science | University of Washington | 2018

SKILLS
Python, Django, React, PostgreSQL, Docker, AWS, Git, Leadership
  `.trim();

  const sampleRequirements = {
    requiredSkills: ['Python', 'Django', 'PostgreSQL'],
    preferredSkills: ['Docker', 'AWS', 'React'],
    minYearsExperience: 3,
    educationLevel: 'Bachelor'
  };

  const assistant = new RecruiterAssistant();
  const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);
  assistant.formatOutput(result);
}

module.exports = RecruiterAssistant;
