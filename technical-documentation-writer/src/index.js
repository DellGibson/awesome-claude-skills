/**
 * Technical Documentation Writer
 * Generates comprehensive technical documentation
 */

class TechnicalDocumentationWriter {
  constructor() {
    this.docTypes = ['readme', 'architecture', 'api-reference', 'getting-started', 'contributing'];
  }

  /**
   * Generate documentation
   */
  generate(projectName, options = {}) {
    const docs = {};

    if (options.docType === 'all' || options.docType === 'readme') {
      docs.readme = this.generateREADME(projectName, options);
    }

    if (options.docType === 'all' || options.docType === 'architecture') {
      docs.architecture = this.generateArchitecture(projectName, options);
    }

    if (options.docType === 'all' || options.docType === 'api-reference') {
      docs.apiReference = this.generateAPIReference(projectName, options);
    }

    if (options.docType === 'all' || options.docType === 'contributing') {
      docs.contributing = this.generateContributing(projectName, options);
    }

    return docs;
  }

  /**
   * Generate README.md
   */
  generateREADME(projectName, options) {
    const description = options.description || 'A great project';

    let readme = `# ${projectName}\n\n`;
    readme += `${description}\n\n`;

    // Badges
    readme += `![CI](https://github.com/user/${projectName}/workflows/CI/badge.svg) `;
    readme += `![License](https://img.shields.io/badge/license-MIT-blue.svg)\n\n`;

    // Features
    readme += `## Features\n\n`;
    readme += `- Easy to use\n`;
    readme += `- Fast and reliable\n`;
    readme += `- Well documented\n\n`;

    // Installation
    readme += `## Installation\n\n`;
    readme += `\`\`\`bash\n`;
    readme += `npm install ${projectName}\n`;
    readme += `\`\`\`\n\n`;

    // Usage
    readme += `## Usage\n\n`;
    if (options.includeExamples !== false) {
      readme += `\`\`\`javascript\n`;
      readme += `const ${this.toCamelCase(projectName)} = require('${projectName}');\n\n`;
      readme += `// Initialize\n`;
      readme += `const instance = new ${this.toPascalCase(projectName)}();\n\n`;
      readme += `// Use it\n`;
      readme += `const result = instance.doSomething();\n`;
      readme += `console.log(result);\n`;
      readme += `\`\`\`\n\n`;
    }

    // API Reference
    readme += `## API Reference\n\n`;
    readme += `See [API.md](./API.md) for detailed API documentation.\n\n`;

    // Contributing
    readme += `## Contributing\n\n`;
    readme += `Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md).\n\n`;

    // License
    readme += `## License\n\n`;
    readme += `MIT\n`;

    return readme;
  }

  /**
   * Generate architecture documentation
   */
  generateArchitecture(projectName, options) {
    let doc = `# ${projectName} Architecture\n\n`;

    doc += `## Overview\n\n`;
    doc += `This document describes the architecture and design decisions.\n\n`;

    // System diagram
    if (options.includeDiagrams !== false) {
      doc += `## System Architecture\n\n`;
      doc += `\`\`\`mermaid\n`;
      doc += `graph TD\n`;
      doc += `    A[Client] --> B[API Gateway]\n`;
      doc += `    B --> C[Application Server]\n`;
      doc += `    C --> D[Database]\n`;
      doc += `    C --> E[Cache]\n`;
      doc += `\`\`\`\n\n`;
    }

    doc += `## Components\n\n`;
    doc += `### API Layer\n\n`;
    doc += `Handles HTTP requests and responses.\n\n`;

    doc += `### Business Logic\n\n`;
    doc += `Core application logic and domain models.\n\n`;

    doc += `### Data Layer\n\n`;
    doc += `Database access and persistence.\n\n`;

    doc += `## Design Patterns\n\n`;
    doc += `- **MVC**: Model-View-Controller pattern\n`;
    doc += `- **Repository**: Data access abstraction\n`;
    doc += `- **Dependency Injection**: Loose coupling\n\n`;

    return doc;
  }

  /**
   * Generate API reference
   */
  generateAPIReference(projectName, options) {
    let doc = `# ${projectName} API Reference\n\n`;

    doc += `## Endpoints\n\n`;

    doc += `### GET /api/resource\n\n`;
    doc += `Get a list of resources.\n\n`;
    doc += `**Response:**\n\n`;
    doc += `\`\`\`json\n`;
    doc += `{\n`;
    doc += `  "data": [],\n`;
    doc += `  "total": 0\n`;
    doc += `}\n`;
    doc += `\`\`\`\n\n`;

    doc += `### POST /api/resource\n\n`;
    doc += `Create a new resource.\n\n`;
    doc += `**Request Body:**\n\n`;
    doc += `\`\`\`json\n`;
    doc += `{\n`;
    doc += `  "name": "Resource Name",\n`;
    doc += `  "value": "Some value"\n`;
    doc += `}\n`;
    doc += `\`\`\`\n\n`;

    return doc;
  }

  /**
   * Generate contributing guidelines
   */
  generateContributing(projectName, options) {
    let doc = `# Contributing to ${projectName}\n\n`;

    doc += `Thank you for your interest in contributing!\n\n`;

    doc += `## Getting Started\n\n`;
    doc += `1. Fork the repository\n`;
    doc += `2. Clone your fork\n`;
    doc += `3. Create a feature branch\n`;
    doc += `4. Make your changes\n`;
    doc += `5. Submit a pull request\n\n`;

    doc += `## Development Setup\n\n`;
    doc += `\`\`\`bash\n`;
    doc += `npm install\n`;
    doc += `npm test\n`;
    doc += `\`\`\`\n\n`;

    doc += `## Code Style\n\n`;
    doc += `- Follow existing code style\n`;
    doc += `- Run linters before committing\n`;
    doc += `- Add tests for new features\n\n`;

    doc += `## Pull Request Process\n\n`;
    doc += `1. Update documentation\n`;
    doc += `2. Add tests\n`;
    doc += `3. Ensure CI passes\n`;
    doc += `4. Request review\n\n`;

    return doc;
  }

  /**
   * Helper: Convert to camelCase
   */
  toCamelCase(str) {
    return str.replace(/[-_]([a-z])/g, (g) => g[1].toUpperCase()).replace(/^[A-Z]/, (c) => c.toLowerCase());
  }

  /**
   * Helper: Convert to PascalCase
   */
  toPascalCase(str) {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TechnicalDocumentationWriter;
}

// Demo
if (require.main === module) {
  const writer = new TechnicalDocumentationWriter();

  const docs = writer.generate('awesome-api', {
    description: 'A REST API for awesome things',
    docType: 'all',
    includeDiagrams: true,
    includeExamples: true
  });

  console.log('=== README.md ===');
  console.log(docs.readme);
  console.log('\n=== ARCHITECTURE.md ===');
  console.log(docs.architecture);
}
