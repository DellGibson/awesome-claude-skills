#!/usr/bin/env node
/**
 * AI Prompt Optimizer - Demo Implementation
 * Analyzes prompts and provides optimization feedback
 */

class PromptOptimizer {
  constructor() {
    this.weights = {
      clarity: 0.30,
      specificity: 0.25,
      context: 0.20,
      conciseness: 0.15,
      tone: 0.10
    };
  }

  /**
   * Analyze a prompt and return optimization feedback
   * @param {string} prompt - The prompt to analyze
   * @param {object} options - Analysis options
   * @returns {object} Analysis results with scores and suggestions
   */
  analyze(prompt, options = {}) {
    const scores = {
      clarity: this.analyzeClarity(prompt),
      conciseness: this.analyzeConciseness(prompt),
      tone: this.analyzeTone(prompt),
      specificity: this.analyzeSpecificity(prompt),
      context: this.analyzeContext(prompt)
    };

    const overallScore = this.calculateOverallScore(scores);
    const issues = this.identifyIssues(prompt, scores);
    const refinedPrompt = this.generateRefinedPrompt(prompt, issues);
    const improvements = this.listImprovements(prompt, refinedPrompt);

    const refinedScores = {
      clarity: Math.min(100, scores.clarity + 20),
      conciseness: Math.min(100, scores.conciseness + 10),
      tone: scores.tone,
      specificity: Math.min(100, scores.specificity + 30),
      context: Math.min(100, scores.context + 25)
    };
    const refinedOverallScore = this.calculateOverallScore(refinedScores);

    return {
      overallScore: Math.round(overallScore),
      scores: this.roundScores(scores),
      issues,
      refinedPrompt,
      improvements,
      scoreImprovement: Math.round(refinedOverallScore - overallScore)
    };
  }

  analyzeClarity(prompt) {
    let score = 70;

    // Check for question words that may indicate ambiguity
    const vagueTerms = ['something', 'anything', 'stuff', 'things', 'somehow', 'kind of', 'sort of'];
    const vagueCount = vagueTerms.filter(term => prompt.toLowerCase().includes(term)).length;
    score -= vagueCount * 15;

    // Penalize very short prompts (likely too vague)
    if (prompt.split(' ').length < 5) score -= 30;

    // Reward prompts with specific verbs
    const specificVerbs = ['create', 'analyze', 'implement', 'debug', 'optimize', 'refactor'];
    const hasSpecificVerb = specificVerbs.some(verb => prompt.toLowerCase().includes(verb));
    if (hasSpecificVerb) score += 10;

    // Check for question marks (questions are usually clearer)
    if (prompt.includes('?')) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  analyzeConciseness(prompt) {
    const wordCount = prompt.split(/\s+/).length;
    let score = 100;

    // Optimal range: 10-50 words
    if (wordCount < 10) {
      score -= (10 - wordCount) * 2; // Too short
    } else if (wordCount > 50) {
      score -= (wordCount - 50) * 1; // Too long
    }

    // Penalize redundant phrases
    const redundantPhrases = ['in order to', 'due to the fact that', 'at this point in time'];
    const redundancyCount = redundantPhrases.filter(phrase =>
      prompt.toLowerCase().includes(phrase)
    ).length;
    score -= redundancyCount * 10;

    return Math.max(0, Math.min(100, score));
  }

  analyzeTone(prompt) {
    let score = 80;

    // Check for politeness markers
    const politeMarkers = ['please', 'could you', 'would you', 'thank'];
    const hasPolite = politeMarkers.some(marker => prompt.toLowerCase().includes(marker));
    if (hasPolite) score += 10;

    // Penalize aggressive language
    const aggressiveMarkers = ['must', 'need to', 'have to', 'asap', 'urgent', '!!!'];
    const aggressiveCount = aggressiveMarkers.filter(marker =>
      prompt.toLowerCase().includes(marker)
    ).length;
    score -= aggressiveCount * 15;

    return Math.max(0, Math.min(100, score));
  }

  analyzeSpecificity(prompt) {
    let score = 50;

    // Reward numbers and specific measurements
    const hasNumbers = /\d+/.test(prompt);
    if (hasNumbers) score += 15;

    // Reward technical terms or specific domain language
    const technicalTerms = ['function', 'api', 'database', 'algorithm', 'component',
                           'method', 'class', 'array', 'object', 'string'];
    const techCount = technicalTerms.filter(term => prompt.toLowerCase().includes(term)).length;
    score += techCount * 10;

    // Penalize generic terms
    const genericTerms = ['help', 'fix', 'do', 'make', 'get', 'thing'];
    const genericCount = genericTerms.filter(term => prompt.toLowerCase().includes(term)).length;
    score -= genericCount * 8;

    // Reward presence of examples or formats
    if (prompt.includes('example') || prompt.includes('format')) score += 10;

    return Math.max(0, Math.min(100, score));
  }

  analyzeContext(prompt) {
    let score = 40;

    const wordCount = prompt.split(/\s+/).length;

    // Longer prompts likely have more context
    if (wordCount > 20) score += 20;
    if (wordCount > 40) score += 15;

    // Check for context indicators
    const contextIndicators = ['because', 'since', 'background', 'currently',
                               'previously', 'environment', 'using', 'platform'];
    const contextCount = contextIndicators.filter(indicator =>
      prompt.toLowerCase().includes(indicator)
    ).length;
    score += contextCount * 10;

    // Check for constraints or requirements
    if (prompt.toLowerCase().includes('require') ||
        prompt.toLowerCase().includes('constraint') ||
        prompt.toLowerCase().includes('must')) {
      score += 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  calculateOverallScore(scores) {
    return (
      scores.clarity * this.weights.clarity +
      scores.specificity * this.weights.specificity +
      scores.context * this.weights.context +
      scores.conciseness * this.weights.conciseness +
      scores.tone * this.weights.tone
    );
  }

  identifyIssues(prompt, scores) {
    const issues = [];

    if (scores.clarity < 60) {
      issues.push({
        severity: 'critical',
        category: 'clarity',
        message: 'Prompt contains ambiguous or vague language',
        suggestion: 'Use specific verbs and avoid words like "something", "stuff", "things"'
      });
    }

    if (scores.specificity < 50) {
      issues.push({
        severity: 'critical',
        category: 'specificity',
        message: 'Prompt lacks specific details',
        suggestion: 'Include technical details, numbers, formats, or concrete examples'
      });
    }

    if (scores.context < 50) {
      issues.push({
        severity: 'warning',
        category: 'context',
        message: 'Insufficient background information provided',
        suggestion: 'Add context about your environment, constraints, or previous attempts'
      });
    }

    if (scores.conciseness < 60) {
      issues.push({
        severity: 'warning',
        category: 'conciseness',
        message: 'Prompt could be more concise',
        suggestion: 'Remove redundant phrases and focus on essential information'
      });
    }

    if (scores.tone < 60) {
      issues.push({
        severity: 'info',
        category: 'tone',
        message: 'Tone could be improved',
        suggestion: 'Consider a more polite or professional tone'
      });
    }

    return issues;
  }

  generateRefinedPrompt(prompt, issues) {
    // This is a simplified demonstration
    // In production, this would use more sophisticated NLP

    let refined = prompt.trim();

    // Add context if missing
    if (issues.some(i => i.category === 'context')) {
      refined = `Context: [Add relevant background information]\n${refined}`;
    }

    // Add specificity if missing
    if (issues.some(i => i.category === 'specificity')) {
      refined = refined.replace(/help|fix|do/, 'implement a specific solution to');
    }

    // Add example structure if very vague
    if (refined.split(' ').length < 10) {
      refined = `${refined}\n\nPlease include:\n- Specific requirements\n- Technical constraints\n- Expected output format`;
    }

    return refined;
  }

  listImprovements(original, refined) {
    const improvements = [];

    if (refined.includes('Context:')) {
      improvements.push('Added context section');
    }

    if (refined.includes('implement')) {
      improvements.push('Replaced vague verbs with specific actions');
    }

    if (refined.includes('requirements') || refined.includes('constraints')) {
      improvements.push('Added structure for requirements and constraints');
    }

    if (refined.length > original.length * 1.3) {
      improvements.push('Expanded with additional detail');
    }

    if (improvements.length === 0) {
      improvements.push('Prompt structure preserved with minor refinements');
    }

    return improvements;
  }

  roundScores(scores) {
    const rounded = {};
    for (const [key, value] of Object.entries(scores)) {
      rounded[key] = Math.round(value);
    }
    return rounded;
  }

  formatOutput(result) {
    console.log('\n📊 Prompt Analysis Results\n');
    console.log(`Overall Score: ${result.overallScore}/100 ${this.getScoreEmoji(result.overallScore)}\n`);

    console.log('Breakdown:');
    for (const [category, score] of Object.entries(result.scores)) {
      const bar = this.createBar(score);
      console.log(`  ${category.charAt(0).toUpperCase() + category.slice(1)}: ${score}/100 ${bar}`);
    }

    if (result.issues.length > 0) {
      console.log('\nIssues Identified:');
      result.issues.forEach(issue => {
        const icon = {critical: '❌', warning: '⚠️', info: 'ℹ️'}[issue.severity];
        console.log(`  ${icon} ${issue.message}`);
        console.log(`     💡 ${issue.suggestion}`);
      });
    }

    console.log('\nRefined Prompt:');
    console.log(`  "${result.refinedPrompt}"`);

    console.log(`\nImprovement: ${result.scoreImprovement > 0 ? '+' : ''}${result.scoreImprovement} points`);

    if (result.improvements.length > 0) {
      console.log('\nKey Changes:');
      result.improvements.forEach(imp => console.log(`  ✓ ${imp}`));
    }

    console.log('');
  }

  getScoreEmoji(score) {
    if (score >= 90) return '🌟 Excellent';
    if (score >= 75) return '✅ Good';
    if (score >= 60) return '⚠️ Fair';
    return '❌ Needs Improvement';
  }

  createBar(score) {
    const filled = Math.round(score / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  }
}

// CLI Interface
if (require.main === module) {
  const prompt = process.argv.slice(2).join(' ') || 'Can you help me with my code?';

  const optimizer = new PromptOptimizer();
  const result = optimizer.analyze(prompt);
  optimizer.formatOutput(result);
}

module.exports = PromptOptimizer;
