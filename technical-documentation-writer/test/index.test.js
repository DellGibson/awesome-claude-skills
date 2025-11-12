/**
 * Tests for Technical Documentation Writer
 */

const TechnicalDocumentationWriter = require('../src/index');

describe('TechnicalDocumentationWriter', () => {
  let writer;

  beforeEach(() => {
    writer = new TechnicalDocumentationWriter();
  });

  describe('constructor', () => {
    it('should initialize with supported documentation types', () => {
      expect(writer.documentationTypes).toContain('readme');
      expect(writer.documentationTypes).toContain('api-reference');
      expect(writer.documentationTypes).toContain('architecture');
      expect(writer.documentationTypes).toContain('setup-guide');
    });
  });

  describe('generate', () => {
    const sampleProject = {
      name: 'TestProject',
      description: 'A test project',
      language: 'nodejs'
    };

    it('should generate complete documentation', () => {
      const result = writer.generate(sampleProject, 'readme', {});

      expect(result).toHaveProperty('documentation');
      expect(result).toHaveProperty('sections');
      expect(result).toHaveProperty('metadata');
    });

    it('should generate README documentation', () => {
      const result = writer.generate(sampleProject, 'readme', {});

      expect(result.documentation).toContain('# TestProject');
      expect(result.documentation).toContain('## Installation');
      expect(result.documentation).toContain('## Usage');
    });

    it('should generate API reference', () => {
      const result = writer.generate(sampleProject, 'api-reference', {
        endpoints: [{ method: 'GET', path: '/api/users' }]
      });

      expect(result.documentation).toContain('API');
    });

    it('should generate architecture documentation', () => {
      const result = writer.generate(sampleProject, 'architecture', {});

      expect(result.documentation).toContain('Architecture');
    });
  });

  describe('generateREADME', () => {
    it('should include project title and description', () => {
      const project = { name: 'MyProject', description: 'Test description' };
      const readme = writer.generateREADME(project, {});

      expect(readme).toContain('# MyProject');
      expect(readme).toContain('Test description');
    });

    it('should include installation section', () => {
      const project = { name: 'Test', language: 'nodejs' };
      const readme = writer.generateREADME(project, {});

      expect(readme).toContain('## Installation');
      expect(readme).toContain('npm install');
    });

    it('should include usage examples', () => {
      const project = { name: 'Test' };
      const readme = writer.generateREADME(project, { includeExamples: true });

      expect(readme).toContain('## Usage');
    });

    it('should include badges when requested', () => {
      const project = { name: 'Test', repository: 'github.com/user/repo' };
      const readme = writer.generateREADME(project, { includeBadges: true });

      expect(readme).toMatch(/badge/i);
    });
  });

  describe('generateAPIReference', () => {
    it('should document API endpoints', () => {
      const endpoints = [
        { method: 'GET', path: '/api/users', description: 'Get all users' }
      ];
      const docs = writer.generateAPIReference(endpoints, {});

      expect(docs).toContain('GET');
      expect(docs).toContain('/api/users');
    });

    it('should include request/response examples', () => {
      const endpoints = [
        {
          method: 'POST',
          path: '/api/users',
          requestBody: { email: 'string', name: 'string' }
        }
      ];
      const docs = writer.generateAPIReference(endpoints, {
        includeExamples: true
      });

      expect(docs).toBeTruthy();
    });
  });

  describe('generateArchitectureDoc', () => {
    it('should describe system architecture', () => {
      const project = { name: 'Test', architecture: 'microservices' };
      const docs = writer.generateArchitectureDoc(project, {});

      expect(docs).toContain('Architecture');
    });

    it('should include diagrams when requested', () => {
      const project = { name: 'Test' };
      const docs = writer.generateArchitectureDoc(project, {
        includeDiagrams: true
      });

      expect(docs).toBeTruthy();
    });
  });

  describe('generateSetupGuide', () => {
    it('should provide step-by-step setup instructions', () => {
      const project = { name: 'Test', language: 'nodejs' };
      const guide = writer.generateSetupGuide(project, {});

      expect(guide).toContain('Setup');
      expect(guide).toContain('Prerequisites');
    });

    it('should include environment configuration', () => {
      const project = { name: 'Test', envVars: ['API_KEY', 'DATABASE_URL'] };
      const guide = writer.generateSetupGuide(project, {});

      expect(guide).toContain('environment');
    });
  });

  describe('generateSections', () => {
    it('should create structured documentation sections', () => {
      const sections = writer.generateSections('readme', {
        project: { name: 'Test' }
      });

      expect(Array.isArray(sections)).toBe(true);
      expect(sections.length).toBeGreaterThan(0);
    });
  });

  describe('generateMetadata', () => {
    it('should include documentation metadata', () => {
      const metadata = writer.generateMetadata('readme', {});

      expect(metadata).toHaveProperty('type');
      expect(metadata).toHaveProperty('generatedAt');
    });
  });

  describe('integration', () => {
    it('should generate comprehensive README for Node.js project', () => {
      const project = {
        name: 'awesome-api',
        description: 'A REST API for managing users',
        language: 'nodejs',
        version: '1.0.0',
        author: 'Developer',
        repository: 'github.com/user/awesome-api',
        license: 'MIT',
        dependencies: ['express', 'mongoose', 'joi'],
        features: ['User management', 'Authentication', 'Rate limiting']
      };

      const result = writer.generate(project, 'readme', {
        includeBadges: true,
        includeExamples: true,
        includeTOC: true,
        includeContributing: true
      });

      expect(result.documentation).toContain('# awesome-api');
      expect(result.documentation).toContain('## Installation');
      expect(result.documentation).toContain('## Usage');
      expect(result.documentation).toContain('## Features');
      expect(result.documentation).toContain('## License');
      expect(result.sections.length).toBeGreaterThan(5);
      expect(result.metadata.type).toBe('readme');
    });
  });
});
