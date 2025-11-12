/**
 * API Documentation Generator
 * Extracts API endpoints from source code and generates OpenAPI/Swagger documentation
 */

class APIDocumentationGenerator {
  constructor() {
    this.supportedFrameworks = ['express', 'fastapi', 'flask', 'django', 'nestjs'];
  }

  /**
   * Main entry point - generates API documentation from code
   */
  generate(code, options = {}) {
    const framework = options.framework === 'auto'
      ? this.detectFramework(code)
      : options.framework;

    const endpoints = this.extractEndpoints(code, framework);
    const documentation = this.generateDocumentation(endpoints, options);
    const statistics = this.calculateStatistics(endpoints);
    const warnings = this.validateDocumentation(endpoints);

    return {
      endpoints,
      documentation,
      statistics,
      warnings
    };
  }

  /**
   * Detect backend framework from code patterns
   */
  detectFramework(code) {
    if (code.includes('app.get(') || code.includes('app.post(')) return 'express';
    if (code.includes('@app.route') || code.includes('Flask')) return 'flask';
    if (code.includes('@app.get') || code.includes('FastAPI')) return 'fastapi';
    if (code.includes('@Get()') || code.includes('@Controller')) return 'nestjs';
    if (code.includes('class') && code.includes('APIView')) return 'django';
    return 'express'; // default
  }

  /**
   * Extract API endpoints from code based on framework
   */
  extractEndpoints(code, framework) {
    const endpoints = [];

    switch (framework) {
      case 'express':
        endpoints.push(...this.extractExpressEndpoints(code));
        break;
      case 'fastapi':
      case 'flask':
        endpoints.push(...this.extractPythonEndpoints(code));
        break;
      case 'nestjs':
        endpoints.push(...this.extractNestJSEndpoints(code));
        break;
      default:
        endpoints.push(...this.extractExpressEndpoints(code));
    }

    return endpoints;
  }

  /**
   * Extract endpoints from Express.js code
   */
  extractExpressEndpoints(code) {
    const endpoints = [];
    const routeRegex = /app\.(get|post|put|patch|delete|options)\s*\(\s*['"`]([^'"`]+)['"`]/g;

    let match;
    while ((match = routeRegex.exec(code)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];

      // Extract function context around this route
      const routeStart = match.index;
      const functionEnd = code.indexOf('});', routeStart);
      const functionCode = code.substring(routeStart, functionEnd + 3);

      // Extract parameters from path
      const parameters = this.extractPathParameters(path);

      // Extract JSDoc comment if present
      const jsdocMatch = code.substring(Math.max(0, routeStart - 300), routeStart).match(/\/\*\*[\s\S]*?\*\//);
      const summary = jsdocMatch ? this.extractSummaryFromJSDoc(jsdocMatch[0]) : `${method} ${path}`;

      // Extract request body fields from code
      const requestBody = this.extractRequestBody(functionCode);

      endpoints.push({
        method,
        path: this.convertToOpenAPIPath(path),
        summary,
        parameters,
        requestBody,
        responses: this.inferResponses(method)
      });
    }

    return endpoints;
  }

  /**
   * Extract endpoints from Python frameworks (FastAPI, Flask)
   */
  extractPythonEndpoints(code) {
    const endpoints = [];
    const routeRegex = /@app\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/g;

    let match;
    while ((match = routeRegex.exec(code)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2];

      endpoints.push({
        method,
        path: this.convertToOpenAPIPath(path),
        summary: `${method} ${path}`,
        parameters: this.extractPathParameters(path),
        requestBody: {},
        responses: this.inferResponses(method)
      });
    }

    return endpoints;
  }

  /**
   * Extract endpoints from NestJS decorators
   */
  extractNestJSEndpoints(code) {
    const endpoints = [];
    const decoratorRegex = /@(Get|Post|Put|Patch|Delete)\s*\(\s*['"`]([^'"`]*)['"`]?\s*\)/g;

    let match;
    while ((match = decoratorRegex.exec(code)) !== null) {
      const method = match[1].toUpperCase();
      const path = match[2] || '/';

      endpoints.push({
        method,
        path: this.convertToOpenAPIPath(path),
        summary: `${method} ${path}`,
        parameters: this.extractPathParameters(path),
        requestBody: {},
        responses: this.inferResponses(method)
      });
    }

    return endpoints;
  }

  /**
   * Extract path parameters from route path
   */
  extractPathParameters(path) {
    const parameters = [];
    const paramRegex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;

    let match;
    while ((match = paramRegex.exec(path)) !== null) {
      parameters.push({
        name: match[1],
        in: 'path',
        required: true,
        type: 'string',
        description: `${match[1]} parameter`
      });
    }

    return parameters;
  }

  /**
   * Convert Express-style path to OpenAPI path format
   */
  convertToOpenAPIPath(path) {
    return path.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
  }

  /**
   * Extract summary from JSDoc comment
   */
  extractSummaryFromJSDoc(jsdoc) {
    const lines = jsdoc.split('\n');
    for (const line of lines) {
      const cleaned = line.replace(/^\s*\*\s*/, '').trim();
      if (cleaned && !cleaned.startsWith('@')) {
        return cleaned;
      }
    }
    return '';
  }

  /**
   * Extract request body fields from function code
   */
  extractRequestBody(functionCode) {
    const bodyFields = [];
    const destructureRegex = /const\s*\{\s*([^}]+)\}\s*=\s*req\.body/;
    const match = functionCode.match(destructureRegex);

    if (match) {
      const fields = match[1].split(',').map(f => f.trim());
      fields.forEach(field => {
        bodyFields.push({
          name: field,
          type: 'string',
          required: true
        });
      });
    }

    return bodyFields.length > 0 ? { fields: bodyFields } : null;
  }

  /**
   * Infer standard responses based on HTTP method
   */
  inferResponses(method) {
    const responses = {
      '200': { description: 'Successful response' }
    };

    if (method === 'POST') {
      responses['201'] = { description: 'Resource created successfully' };
    }

    if (method === 'DELETE') {
      responses['204'] = { description: 'Resource deleted successfully' };
    }

    responses['400'] = { description: 'Bad request' };
    responses['401'] = { description: 'Unauthorized' };
    responses['404'] = { description: 'Resource not found' };
    responses['500'] = { description: 'Internal server error' };

    return responses;
  }

  /**
   * Generate documentation in requested formats
   */
  generateDocumentation(endpoints, options) {
    const formats = options.outputFormats || ['openapi-yaml', 'markdown'];
    const documentation = {};

    if (formats.includes('openapi-yaml') || formats.includes('openapi-json')) {
      documentation.openapi = this.generateOpenAPI(endpoints, options);
    }

    if (formats.includes('markdown')) {
      documentation.markdown = this.generateMarkdown(endpoints, options);
    }

    if (formats.includes('postman')) {
      documentation.postman = this.generatePostmanCollection(endpoints, options);
    }

    return documentation;
  }

  /**
   * Generate OpenAPI 3.0 specification
   */
  generateOpenAPI(endpoints, options) {
    const spec = {
      openapi: '3.0.0',
      info: {
        title: options.apiTitle || 'API Documentation',
        version: options.apiVersion || '1.0.0',
        description: 'Auto-generated API documentation'
      },
      servers: [
        {
          url: options.baseUrl || 'https://api.example.com'
        }
      ],
      paths: {}
    };

    // Add security schemes if auth is specified
    if (options.authType && options.authType !== 'none') {
      spec.components = { securitySchemes: {} };

      if (options.authType === 'bearer') {
        spec.components.securitySchemes.bearerAuth = {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        };
        spec.security = [{ bearerAuth: [] }];
      } else if (options.authType === 'apikey') {
        spec.components.securitySchemes.apiKey = {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key'
        };
        spec.security = [{ apiKey: [] }];
      }
    }

    // Add endpoints to paths
    endpoints.forEach(endpoint => {
      if (!spec.paths[endpoint.path]) {
        spec.paths[endpoint.path] = {};
      }

      const operation = {
        summary: endpoint.summary,
        responses: endpoint.responses
      };

      if (endpoint.parameters && endpoint.parameters.length > 0) {
        operation.parameters = endpoint.parameters;
      }

      if (endpoint.requestBody && endpoint.requestBody.fields) {
        operation.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {}
              }
            }
          }
        };

        endpoint.requestBody.fields.forEach(field => {
          operation.requestBody.content['application/json'].schema.properties[field.name] = {
            type: field.type
          };
        });
      }

      spec.paths[endpoint.path][endpoint.method.toLowerCase()] = operation;
    });

    return JSON.stringify(spec, null, 2);
  }

  /**
   * Generate Markdown documentation
   */
  generateMarkdown(endpoints, options) {
    let markdown = `# ${options.apiTitle || 'API Documentation'}\n\n`;
    markdown += `**Version:** ${options.apiVersion || '1.0.0'}  \n`;
    markdown += `**Base URL:** ${options.baseUrl || 'https://api.example.com'}  \n\n`;

    if (options.authType && options.authType !== 'none') {
      markdown += `**Authentication:** ${options.authType}\n\n`;
    }

    markdown += `## Endpoints\n\n`;

    endpoints.forEach(endpoint => {
      markdown += `### ${endpoint.method} ${endpoint.path}\n\n`;
      markdown += `${endpoint.summary}\n\n`;

      // Parameters
      if (endpoint.parameters && endpoint.parameters.length > 0) {
        markdown += `**Parameters:**\n\n`;
        endpoint.parameters.forEach(param => {
          markdown += `- \`${param.name}\` (${param.in}${param.required ? ', required' : ''}): ${param.description}\n`;
        });
        markdown += `\n`;
      }

      // Request body
      if (endpoint.requestBody && endpoint.requestBody.fields) {
        markdown += `**Request Body:**\n\n\`\`\`json\n{\n`;
        endpoint.requestBody.fields.forEach((field, idx) => {
          markdown += `  "${field.name}": "string"${idx < endpoint.requestBody.fields.length - 1 ? ',' : ''}\n`;
        });
        markdown += `}\n\`\`\`\n\n`;
      }

      // Example curl command
      if (options.includeExamples !== false) {
        markdown += `**Example Request:**\n\n\`\`\`bash\n`;
        markdown += `curl -X ${endpoint.method} ${options.baseUrl || 'https://api.example.com'}${endpoint.path.replace(/\{([^}]+)\}/g, ':$1')}`;

        if (options.authType === 'bearer') {
          markdown += ` \\\n  -H "Authorization: Bearer YOUR_TOKEN"`;
        } else if (options.authType === 'apikey') {
          markdown += ` \\\n  -H "X-API-Key: YOUR_API_KEY"`;
        }

        if (endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') {
          markdown += ` \\\n  -H "Content-Type: application/json"`;
          if (endpoint.requestBody) {
            markdown += ` \\\n  -d '{"field":"value"}'`;
          }
        }

        markdown += `\n\`\`\`\n\n`;
      }

      markdown += `---\n\n`;
    });

    return markdown;
  }

  /**
   * Generate Postman collection
   */
  generatePostmanCollection(endpoints, options) {
    const collection = {
      info: {
        name: options.apiTitle || 'API Collection',
        description: 'Auto-generated Postman collection',
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: []
    };

    endpoints.forEach(endpoint => {
      const item = {
        name: endpoint.summary,
        request: {
          method: endpoint.method,
          header: [
            {
              key: 'Content-Type',
              value: 'application/json'
            }
          ],
          url: {
            raw: `${options.baseUrl || 'https://api.example.com'}${endpoint.path}`,
            host: [(options.baseUrl || 'https://api.example.com').replace(/^https?:\/\//, '')],
            path: endpoint.path.split('/').filter(p => p)
          }
        }
      };

      if (endpoint.requestBody) {
        item.request.body = {
          mode: 'raw',
          raw: JSON.stringify({}, null, 2)
        };
      }

      collection.item.push(item);
    });

    return collection;
  }

  /**
   * Calculate statistics about the API
   */
  calculateStatistics(endpoints) {
    const stats = {
      totalEndpoints: endpoints.length,
      endpointsByMethod: {},
      authenticatedEndpoints: endpoints.length, // Assume all need auth unless specified
      documentedParameters: 0
    };

    endpoints.forEach(endpoint => {
      stats.endpointsByMethod[endpoint.method] = (stats.endpointsByMethod[endpoint.method] || 0) + 1;
      stats.documentedParameters += (endpoint.parameters || []).length;
    });

    return stats;
  }

  /**
   * Validate documentation completeness and generate warnings
   */
  validateDocumentation(endpoints) {
    const warnings = [];

    endpoints.forEach(endpoint => {
      // Check for missing descriptions
      if (!endpoint.summary || endpoint.summary === `${endpoint.method} ${endpoint.path}`) {
        warnings.push({
          endpoint: `${endpoint.method} ${endpoint.path}`,
          severity: 'medium',
          message: 'No description provided - add JSDoc comments for better documentation'
        });
      }

      // Check for undocumented parameters
      if (endpoint.path.includes('{') && (!endpoint.parameters || endpoint.parameters.length === 0)) {
        warnings.push({
          endpoint: `${endpoint.method} ${endpoint.path}`,
          severity: 'low',
          message: 'Path parameters detected but not documented'
        });
      }

      // Check POST/PUT without request body
      if ((endpoint.method === 'POST' || endpoint.method === 'PUT') && !endpoint.requestBody) {
        warnings.push({
          endpoint: `${endpoint.method} ${endpoint.path}`,
          severity: 'low',
          message: `${endpoint.method} endpoint may need request body documentation`
        });
      }
    });

    return warnings;
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = APIDocumentationGenerator;
}

// Demo usage
if (require.main === module) {
  const generator = new APIDocumentationGenerator();

  const sampleCode = `
    /**
     * Get user by ID
     * @param {string} id - User ID
     */
    app.get('/api/users/:id', async (req, res) => {
      const { id } = req.params;
      const user = await db.users.findById(id);
      res.json(user);
    });

    /**
     * Create new user
     */
    app.post('/api/users', async (req, res) => {
      const { email, name } = req.body;
      const user = await db.users.create({ email, name });
      res.status(201).json(user);
    });
  `;

  const result = generator.generate(sampleCode, {
    framework: 'express',
    outputFormats: ['openapi-json', 'markdown'],
    apiTitle: 'User API',
    baseUrl: 'https://api.example.com',
    authType: 'bearer',
    includeExamples: true
  });

  console.log('Generated Documentation:');
  console.log(JSON.stringify(result, null, 2));
}
