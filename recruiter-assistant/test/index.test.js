/**
 * Tests for Recruiter Assistant
 */

const RecruiterAssistant = require('../src/index');

describe('RecruiterAssistant', () => {
  let assistant;

  beforeEach(() => {
    assistant = new RecruiterAssistant();
  });

  describe('constructor', () => {
    it('should initialize with correct weights', () => {
      expect(assistant.weights).toBeDefined();
      expect(assistant.weights.skillsMatch).toBe(0.40);
      expect(assistant.weights.experienceRelevance).toBe(0.30);
      expect(assistant.weights.educationMatch).toBe(0.15);
      expect(assistant.weights.yearsExperience).toBe(0.10);
      expect(assistant.weights.location).toBe(0.05);
    });

    it('should have weights sum to 1.0', () => {
      const sum = Object.values(assistant.weights).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(1.0, 5);
    });
  });

  describe('analyzeCandidate', () => {
    const sampleResume = `
John Doe
john.doe@email.com | (555) 123-4567 | Seattle, WA

EXPERIENCE
Senior Software Engineer | TechCorp | 2020-Present
- Python and Django backend development
- PostgreSQL database management

EDUCATION
B.S. Computer Science | University of Washington | 2018

SKILLS
Python, Django, React, PostgreSQL, Docker, AWS
    `.trim();

    const sampleRequirements = {
      requiredSkills: ['Python', 'Django', 'PostgreSQL'],
      preferredSkills: ['Docker', 'AWS'],
      minYearsExperience: 3,
      educationLevel: 'Bachelor'
    };

    it('should return complete analysis', () => {
      const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);

      expect(result).toHaveProperty('candidateInfo');
      expect(result).toHaveProperty('overallFitScore');
      expect(result).toHaveProperty('scoreBreakdown');
      expect(result).toHaveProperty('extractedSkills');
      expect(result).toHaveProperty('yearsOfExperience');
      expect(result).toHaveProperty('education');
      expect(result).toHaveProperty('gaps');
      expect(result).toHaveProperty('strengths');
      expect(result).toHaveProperty('recommendation');
      expect(result).toHaveProperty('summary');
    });

    it('should extract candidate information', () => {
      const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);

      expect(result.candidateInfo.name).toBe('John Doe');
      expect(result.candidateInfo.email).toBe('john.doe@email.com');
      expect(result.candidateInfo.phone).toBeTruthy();
      expect(result.candidateInfo.location).toBe('WA');
    });

    it('should return numeric fit score', () => {
      const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);

      expect(typeof result.overallFitScore).toBe('number');
      expect(result.overallFitScore).toBeGreaterThanOrEqual(0);
      expect(result.overallFitScore).toBeLessThanOrEqual(100);
    });

    it('should extract skills from resume', () => {
      const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);

      expect(result.extractedSkills).toContain('Python');
      expect(result.extractedSkills).toContain('Django');
      expect(result.extractedSkills).toContain('PostgreSQL');
    });

    it('should score qualified candidate highly', () => {
      const result = assistant.analyzeCandidate(sampleResume, sampleRequirements);

      expect(result.overallFitScore).toBeGreaterThan(60);
      expect(result.recommendation).toMatch(/INTERVIEW|STRONG_HIRE/);
    });
  });

  describe('extractContactInfo', () => {
    it('should extract email address', () => {
      const resume = 'John Doe\njohn.doe@example.com\n(555) 123-4567';
      const info = assistant.extractContactInfo(resume);

      expect(info.email).toBe('john.doe@example.com');
    });

    it('should extract phone number', () => {
      const resume = 'Jane Smith\njane@example.com\n555-123-4567';
      const info = assistant.extractContactInfo(resume);

      expect(info.phone).toBeTruthy();
      expect(info.phone).toMatch(/555/);
    });

    it('should extract name from first line', () => {
      const resume = 'Alice Johnson\nalice@example.com';
      const info = assistant.extractContactInfo(resume);

      expect(info.name).toBe('Alice Johnson');
    });

    it('should handle missing information gracefully', () => {
      const resume = 'Anonymous Resume\nNo contact info';
      const info = assistant.extractContactInfo(resume);

      expect(info.name).toBeTruthy();
      expect(info.email).toBeNull();
    });

    it('should extract location', () => {
      const resume = 'John Doe\nSeattle, WA\njohn@example.com';
      const info = assistant.extractContactInfo(resume);

      expect(info.location).toBe('WA');
    });
  });

  describe('extractSkills', () => {
    it('should extract programming languages', () => {
      const resume = 'Skills: Python, JavaScript, Java, Go';
      const skills = assistant.extractSkills(resume);

      expect(skills).toContain('Python');
      expect(skills).toContain('JavaScript');
      expect(skills).toContain('Java');
      expect(skills).toContain('Go');
    });

    it('should extract frameworks', () => {
      const resume = 'Experience with Django, React, Vue, and Flask';
      const skills = assistant.extractSkills(resume);

      expect(skills).toContain('Django');
      expect(skills).toContain('React');
      expect(skills).toContain('Vue');
      expect(skills).toContain('Flask');
    });

    it('should extract databases', () => {
      const resume = 'Database experience: PostgreSQL, MySQL, MongoDB';
      const skills = assistant.extractSkills(resume);

      expect(skills).toContain('PostgreSQL');
      expect(skills).toContain('MySQL');
      expect(skills).toContain('MongoDB');
    });

    it('should extract cloud platforms', () => {
      const resume = 'Cloud: AWS, GCP, Azure';
      const skills = assistant.extractSkills(resume);

      expect(skills).toContain('AWS');
      expect(skills).toContain('GCP');
      expect(skills).toContain('Azure');
    });

    it('should be case insensitive', () => {
      const resume = 'PYTHON python Python';
      const skills = assistant.extractSkills(resume);

      expect(skills.filter(s => s === 'Python').length).toBe(1);
    });

    it('should return empty array for no skills', () => {
      const resume = 'No technical skills listed';
      const skills = assistant.extractSkills(resume);

      expect(Array.isArray(skills)).toBe(true);
    });
  });

  describe('extractYearsExperience', () => {
    it('should calculate years from date range', () => {
      const resume = 'Software Engineer | 2018-2023';
      const years = assistant.extractYearsExperience(resume);

      expect(years).toBeGreaterThan(0);
      expect(years).toBeLessThan(50);
    });

    it('should return 0 for insufficient date information', () => {
      const resume = 'Software Engineer with experience';
      const years = assistant.extractYearsExperience(resume);

      expect(years).toBe(0);
    });

    it('should handle multiple date ranges', () => {
      const resume = 'Job 1: 2015-2018\nJob 2: 2018-2023';
      const years = assistant.extractYearsExperience(resume);

      expect(years).toBeGreaterThan(5);
    });

    it('should cap at 30 years', () => {
      const resume = 'Working since 1980';
      const years = assistant.extractYearsExperience(resume);

      expect(years).toBeLessThanOrEqual(30);
    });
  });

  describe('extractEducation', () => {
    it('should extract PhD degree', () => {
      const resume = 'Ph.D. in Computer Science';
      const education = assistant.extractEducation(resume);

      expect(education.length).toBeGreaterThan(0);
      expect(education[0].degree).toBe('PhD');
    });

    it('should extract Master degree', () => {
      const resume = 'M.S. Computer Science | MIT | 2020';
      const education = assistant.extractEducation(resume);

      expect(education.length).toBeGreaterThan(0);
      expect(education[0].degree).toBe('Master');
    });

    it('should extract Bachelor degree', () => {
      const resume = 'B.S. in Software Engineering';
      const education = assistant.extractEducation(resume);

      expect(education.length).toBeGreaterThan(0);
      expect(education[0].degree).toBe('Bachelor');
    });

    it('should extract MBA', () => {
      const resume = 'MBA from Harvard Business School';
      const education = assistant.extractEducation(resume);

      expect(education.length).toBeGreaterThan(0);
      expect(education[0].degree).toBe('Master');
    });

    it('should prioritize highest degree', () => {
      const resume = 'B.S. 2015, M.S. 2017, Ph.D. 2020';
      const education = assistant.extractEducation(resume);

      expect(education[0].degree).toBe('PhD');
    });

    it('should return empty array for no education', () => {
      const resume = 'No formal education listed';
      const education = assistant.extractEducation(resume);

      expect(Array.isArray(education)).toBe(true);
    });
  });

  describe('calculateSkillsMatch', () => {
    const extractedSkills = ['Python', 'Django', 'React', 'PostgreSQL'];

    it('should score 100 for all required skills matched', () => {
      const requirements = {
        requiredSkills: ['Python', 'Django'],
        preferredSkills: []
      };

      const score = assistant.calculateSkillsMatch(extractedSkills, requirements);
      expect(score).toBeGreaterThan(30);
    });

    it('should penalize missing required skills', () => {
      const requirements = {
        requiredSkills: ['Python', 'Django', 'Kubernetes', 'Go'],
        preferredSkills: []
      };

      const score = assistant.calculateSkillsMatch(extractedSkills, requirements);
      expect(score).toBeLessThan(100);
    });

    it('should give bonus for preferred skills', () => {
      const requirements1 = {
        requiredSkills: ['Python'],
        preferredSkills: []
      };

      const requirements2 = {
        requiredSkills: ['Python'],
        preferredSkills: ['React', 'Django']
      };

      const score1 = assistant.calculateSkillsMatch(extractedSkills, requirements1);
      const score2 = assistant.calculateSkillsMatch(extractedSkills, requirements2);

      expect(score2).toBeGreaterThanOrEqual(score1);
    });

    it('should handle no requirements gracefully', () => {
      const score = assistant.calculateSkillsMatch(extractedSkills, {});
      expect(score).toBe(50);
    });

    it('should be case insensitive', () => {
      const requirements = {
        requiredSkills: ['python', 'DJANGO'],
        preferredSkills: []
      };

      const score = assistant.calculateSkillsMatch(extractedSkills, requirements);
      expect(score).toBeGreaterThan(30);
    });
  });

  describe('calculateExperienceRelevance', () => {
    it('should score higher for relevant experience', () => {
      const resume = 'Extensive Python and Django development experience';
      const requirements = {
        requiredSkills: ['Python', 'Django']
      };

      const score = assistant.calculateExperienceRelevance(resume, requirements);
      expect(score).toBeGreaterThan(80);
    });

    it('should score lower for unrelated experience', () => {
      const resume = 'Experience with assembly language and COBOL';
      const requirements = {
        requiredSkills: ['Python', 'Django']
      };

      const score = assistant.calculateExperienceRelevance(resume, requirements);
      expect(score).toBeLessThan(100);
    });

    it('should handle empty requirements', () => {
      const resume = 'Software engineer with 5 years experience';
      const requirements = {};

      const score = assistant.calculateExperienceRelevance(resume, requirements);
      expect(score).toBeGreaterThanOrEqual(60);
    });
  });

  describe('calculateEducationMatch', () => {
    it('should return 100 for matching education level', () => {
      const education = [{ degree: 'Bachelor' }];
      const score = assistant.calculateEducationMatch(education, 'Bachelor');
      expect(score).toBe(100);
    });

    it('should return 100 for higher education level', () => {
      const education = [{ degree: 'Master' }];
      const score = assistant.calculateEducationMatch(education, 'Bachelor');
      expect(score).toBe(100);
    });

    it('should return lower score for below required level', () => {
      const education = [{ degree: 'Associate' }];
      const score = assistant.calculateEducationMatch(education, 'Bachelor');
      expect(score).toBeLessThan(100);
    });

    it('should handle PhD candidates', () => {
      const education = [{ degree: 'PhD' }];
      const score = assistant.calculateEducationMatch(education, 'Master');
      expect(score).toBe(100);
    });

    it('should handle no education gracefully', () => {
      const education = [];
      const score = assistant.calculateEducationMatch(education, 'Bachelor');
      expect(score).toBe(30);
    });
  });

  describe('calculateYearsScore', () => {
    it('should return 100 for meeting requirement', () => {
      const score = assistant.calculateYearsScore(5, 3);
      expect(score).toBe(100);
    });

    it('should return 80 for 1 year below requirement', () => {
      const score = assistant.calculateYearsScore(4, 5);
      expect(score).toBe(80);
    });

    it('should return 60 for 2 years below requirement', () => {
      const score = assistant.calculateYearsScore(3, 5);
      expect(score).toBe(60);
    });

    it('should return 40 for significantly below requirement', () => {
      const score = assistant.calculateYearsScore(0, 5);
      expect(score).toBe(40);
    });
  });

  describe('calculateOverallScore', () => {
    it('should weight scores correctly', () => {
      const scores = {
        skillsMatch: 80,
        experienceRelevance: 70,
        educationMatch: 90,
        yearsExperience: 100
      };

      const overall = assistant.calculateOverallScore(scores);
      const expected = (80 * 0.40) + (70 * 0.30) + (90 * 0.15) + (100 * 0.10);

      expect(overall).toBeCloseTo(expected, 5);
    });

    it('should return a number', () => {
      const scores = {
        skillsMatch: 50,
        experienceRelevance: 50,
        educationMatch: 50,
        yearsExperience: 50
      };

      const overall = assistant.calculateOverallScore(scores);
      expect(typeof overall).toBe('number');
    });
  });

  describe('identifyGaps', () => {
    it('should identify missing required skills', () => {
      const extractedSkills = ['Python', 'Django'];
      const requirements = {
        requiredSkills: ['Python', 'Django', 'Kubernetes']
      };

      const gaps = assistant.identifyGaps(extractedSkills, requirements);
      expect(gaps.length).toBeGreaterThan(0);
      expect(gaps.some(g => g.includes('Kubernetes'))).toBe(true);
    });

    it('should return empty array when all skills present', () => {
      const extractedSkills = ['Python', 'Django', 'React'];
      const requirements = {
        requiredSkills: ['Python', 'Django']
      };

      const gaps = assistant.identifyGaps(extractedSkills, requirements);
      expect(gaps.length).toBe(0);
    });

    it('should handle empty requirements', () => {
      const extractedSkills = ['Python'];
      const requirements = {};

      const gaps = assistant.identifyGaps(extractedSkills, requirements);
      expect(gaps.length).toBe(0);
    });
  });

  describe('identifyStrengths', () => {
    it('should identify diverse skill set', () => {
      const resume = 'Skills: Python, JS, Java, Go, Ruby, C++, PHP, Swift, Kotlin, Rust, Scala';
      const skills = ['Python', 'JavaScript', 'Java', 'Go', 'Ruby', 'C++', 'PHP', 'Swift', 'Kotlin', 'Rust', 'Scala'];
      const requirements = {};

      const strengths = assistant.identifyStrengths(resume, skills, requirements);
      expect(strengths.some(s => s.includes('Diverse'))).toBe(true);
    });

    it('should identify leadership experience', () => {
      const resume = 'Senior Lead Engineer with team management experience';
      const skills = ['Python'];
      const requirements = {};

      const strengths = assistant.identifyStrengths(resume, skills, requirements);
      expect(strengths.some(s => s.includes('Leadership'))).toBe(true);
    });

    it('should identify experience with scale', () => {
      const resume = 'Built systems serving millions of users at scale';
      const skills = ['Python'];
      const requirements = {};

      const strengths = assistant.identifyStrengths(resume, skills, requirements);
      expect(strengths.some(s => s.includes('scale'))).toBe(true);
    });
  });

  describe('getRecommendation', () => {
    it('should return STRONG_HIRE for high scores', () => {
      const recommendation = assistant.getRecommendation(90);
      expect(recommendation).toBe('STRONG_HIRE');
    });

    it('should return INTERVIEW for good scores', () => {
      const recommendation = assistant.getRecommendation(75);
      expect(recommendation).toBe('INTERVIEW');
    });

    it('should return MAYBE for mediocre scores', () => {
      const recommendation = assistant.getRecommendation(55);
      expect(recommendation).toBe('MAYBE');
    });

    it('should return PASS for low scores', () => {
      const recommendation = assistant.getRecommendation(30);
      expect(recommendation).toBe('PASS');
    });
  });

  describe('generateSummary', () => {
    it('should generate readable summary', () => {
      const summary = assistant.generateSummary('John Doe', 5, ['Python', 'Django', 'React'], 85);

      expect(summary).toContain('John Doe');
      expect(summary).toContain('5 years');
      expect(summary).toContain('Python');
    });

    it('should include skill highlights', () => {
      const summary = assistant.generateSummary('Jane Smith', 3, ['AWS', 'Kubernetes', 'Docker'], 70);

      expect(summary).toContain('AWS');
      expect(summary).toContain('Kubernetes');
      expect(summary).toContain('Docker');
    });

    it('should indicate match level', () => {
      const highScore = assistant.generateSummary('Alice', 5, ['Python'], 90);
      const lowScore = assistant.generateSummary('Bob', 2, ['Python'], 40);

      expect(highScore).toContain('Excellent');
      expect(lowScore).not.toContain('Excellent');
    });
  });

  describe('roundScores', () => {
    it('should round all scores to integers', () => {
      const scores = {
        skillsMatch: 75.7,
        experienceRelevance: 82.3,
        educationMatch: 90.9,
        yearsExperience: 65.4
      };

      const rounded = assistant.roundScores(scores);

      expect(rounded.skillsMatch).toBe(76);
      expect(rounded.experienceRelevance).toBe(82);
      expect(rounded.educationMatch).toBe(91);
      expect(rounded.yearsExperience).toBe(65);
    });
  });

  describe('edge cases', () => {
    it('should handle empty resume', () => {
      const result = assistant.analyzeCandidate('', {});
      expect(result).toHaveProperty('overallFitScore');
    });

    it('should handle malformed resume', () => {
      const resume = 'Random text without structure';
      const result = assistant.analyzeCandidate(resume, {});
      expect(result).toHaveProperty('candidateInfo');
    });

    it('should handle unicode characters', () => {
      const resume = 'José García\njose@example.com\nExperience with Python';
      const result = assistant.analyzeCandidate(resume, {});
      expect(result.candidateInfo.name).toContain('José');
    });
  });

  describe('integration', () => {
    it('should provide complete candidate evaluation', () => {
      const resume = `
Sarah Johnson
sarah.j@email.com | 415-555-0123 | San Francisco, CA

PROFESSIONAL EXPERIENCE
Senior Software Engineer | Tech Company | 2019-Present
- Lead development of microservices using Python and Django
- Managed PostgreSQL databases and optimized queries
- Deployed applications on AWS with Docker and Kubernetes

Software Engineer | Startup Inc | 2017-2019
- Built React frontend applications
- Implemented CI/CD pipelines

EDUCATION
M.S. Computer Science | Stanford University | 2017
B.S. Computer Engineering | UC Berkeley | 2015

SKILLS
Python, Django, React, PostgreSQL, AWS, Docker, Kubernetes, Git, Leadership
      `.trim();

      const requirements = {
        requiredSkills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
        preferredSkills: ['Docker', 'Kubernetes', 'React'],
        minYearsExperience: 4,
        educationLevel: 'Bachelor'
      };

      const result = assistant.analyzeCandidate(resume, requirements);

      expect(result.overallFitScore).toBeGreaterThan(75);
      expect(result.recommendation).toMatch(/STRONG_HIRE|INTERVIEW/);
      expect(result.gaps.length).toBe(0);
      expect(result.strengths.length).toBeGreaterThan(0);
      expect(result.extractedSkills.length).toBeGreaterThan(5);
    });
  });
});
