/**
 * Tests for API Documentation Generator
 */

const APIDocumentationGenerator = require('../src/index');

describe('APIDocumentationGenerator', () => {
  let generator;

  beforeEach(() => {
    generator = new APIDocumentationGenerator();
  });

  describe('constructor', () => {
    it('should initialize with supported frameworks', () => {
      expect(generator.supportedFrameworks).toBeDefined();
      expect(generator.supportedFrameworks).toContain('express');
      expect(generator.supportedFrameworks).toContain('fastapi');
      expect(generator.supportedFrameworks).toContain('flask');
      expect(generator.supportedFrameworks).toContain('django');
      expect(generator.supportedFrameworks).toContain('nestjs');
    });
  });

  describe('generate', () => {
    const sampleExpressCode = `
      app.get('/api/users/:id', async (req, res) => {
        const { id } = req.params;
        res.json({ id });
      });

      app.post('/api/users', async (req, res) => {
        const { email, name } = req.body;
        res.status(201).json({ email, name });
      });
    `;

    it('should generate complete documentation', () => {
      const result = generator.generate(sampleExpressCode, {
        framework: 'express',
        outputFormats: ['openapi-json', 'markdown']
      });

      expect(result).toHaveProperty('endpoints');
      expect(result).toHaveProperty('documentation');
      expect(result).toHaveProperty('statistics');
      expect(result).toHaveProperty('warnings');
    });

    it('should extract endpoints from code', () => {
      const result = generator.generate(sampleExpressCode, { framework: 'express' });

      expect(result.endpoints.length).toBeGreaterThan(0);
      expect(result.endpoints.some(e => e.method === 'GET')).toBe(true);
      expect(result.endpoints.some(e => e.method === 'POST')).toBe(true);
    });

    it('should auto-detect framework', () => {
      const result = generator.generate(sampleExpressCode, { framework: 'auto' });

      expect(result.endpoints.length).toBeGreaterThan(0);
    });
  });

  describe('detectFramework', () => {
    it('should detect Express.js', () => {
      const code = 'app.get("/api", handler)';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('express');
    });

    it('should detect Flask', () => {
      const code = '@app.route("/api")';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('flask');
    });

    it('should detect FastAPI', () => {
      const code = '@app.get("/api")';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('fastapi');
    });

    it('should detect NestJS', () => {
      const code = '@Get() @Controller()';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('nestjs');
    });

    it('should detect Django', () => {
      const code = 'class UserView(APIView):';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('django');
    });

    it('should default to express for unknown', () => {
      const code = 'some random code';
      const framework = generator.detectFramework(code);
      expect(framework).toBe('express');
    });
  });

  describe('extractExpressEndpoints', () => {
    it('should extract GET endpoints', () => {
      const code = 'app.get("/api/users", (req, res) => {});';
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints.length).toBe(1);
      expect(endpoints[0].method).toBe('GET');
      expect(endpoints[0].path).toBe('/api/users');
    });

    it('should extract POST endpoints', () => {
      const code = 'app.post("/api/users", (req, res) => {});';
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints[0].method).toBe('POST');
    });

    it('should extract PUT endpoints', () => {
      const code = 'app.put("/api/users/:id", (req, res) => {});';
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints[0].method).toBe('PUT');
    });

    it('should extract DELETE endpoints', () => {
      const code = 'app.delete("/api/users/:id", (req, res) => {});';
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints[0].method).toBe('DELETE');
    });

    it('should extract path parameters', () => {
      const code = 'app.get("/api/users/:id", (req, res) => {});';
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints[0].parameters.length).toBeGreaterThan(0);
      expect(endpoints[0].parameters[0].name).toBe('id');
      expect(endpoints[0].parameters[0].in).toBe('path');
    });

    it('should extract request body from destructuring', () => {
      const code = `
        app.post("/api/users", (req, res) => {
          const { email, name } = req.body;
        });
      `;
      const endpoints = generator.extractExpressEndpoints(code);

      expect(endpoints[0].requestBody).toBeTruthy();
      expect(endpoints[0].requestBody.fields.length).toBe(2);
    });
  });

  describe('extractPythonEndpoints', () => {
    it('should extract Flask/FastAPI endpoints', () => {
      const code = '@app.get("/api/users")';
      const endpoints = generator.extractPythonEndpoints(code);

      expect(endpoints.length).toBe(1);
      expect(endpoints[0].method).toBe('GET');
      expect(endpoints[0].path).toBe('/api/users');
    });

    it('should extract multiple HTTP methods', () => {
      const code = `
        @app.get("/users")
        @app.post("/users")
        @app.put("/users/:id")
      `;
      const endpoints = generator.extractPythonEndpoints(code);

      expect(endpoints.length).toBe(3);
    });
  });

  describe('extractNestJSEndpoints', () => {
    it('should extract NestJS @Get decorators', () => {
      const code = '@Get("users")';
      const endpoints = generator.extractNestJSEndpoints(code);

      expect(endpoints.length).toBe(1);
      expect(endpoints[0].method).toBe('GET');
    });

    it('should handle empty decorator paths', () => {
      const code = '@Get()';
      const endpoints = generator.extractNestJSEndpoints(code);

      expect(endpoints[0].path).toBe('/');
    });
  });

  describe('extractPathParameters', () => {
    it('should extract single parameter', () => {
      const path = '/api/users/:id';
      const params = generator.extractPathParameters(path);

      expect(params.length).toBe(1);
      expect(params[0].name).toBe('id');
      expect(params[0].required).toBe(true);
    });

    it('should extract multiple parameters', () => {
      const path = '/api/users/:userId/posts/:postId';
      const params = generator.extractPathParameters(path);

      expect(params.length).toBe(2);
      expect(params[0].name).toBe('userId');
      expect(params[1].name).toBe('postId');
    });

    it('should return empty array for no parameters', () => {
      const path = '/api/users';
      const params = generator.extractPathParameters(path);

      expect(params.length).toBe(0);
    });
  });

  describe('convertToOpenAPIPath', () => {
    it('should convert Express path to OpenAPI format', () => {
      const path = '/api/users/:id';
      const converted = generator.convertToOpenAPIPath(path);

      expect(converted).toBe('/api/users/{id}');
    });

    it('should handle multiple parameters', () => {
      const path = '/api/users/:userId/posts/:postId';
      const converted = generator.convertToOpenAPIPath(path);

      expect(converted).toBe('/api/users/{userId}/posts/{postId}');
    });

    it('should not modify paths without parameters', () => {
      const path = '/api/users';
      const converted = generator.convertToOpenAPIPath(path);

      expect(converted).toBe('/api/users');
    });
  });

  describe('inferResponses', () => {
    it('should include 200 for all methods', () => {
      const responses = generator.inferResponses('GET');
      expect(responses['200']).toBeDefined();
    });

    it('should include 201 for POST', () => {
      const responses = generator.inferResponses('POST');
      expect(responses['201']).toBeDefined();
    });

    it('should include 204 for DELETE', () => {
      const responses = generator.inferResponses('DELETE');
      expect(responses['204']).toBeDefined();
    });

    it('should include error responses', () => {
      const responses = generator.inferResponses('GET');
      expect(responses['400']).toBeDefined();
      expect(responses['401']).toBeDefined();
      expect(responses['404']).toBeDefined();
      expect(responses['500']).toBeDefined();
    });
  });

  describe('generateOpenAPI', () => {
    it('should generate valid OpenAPI spec', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'Get users',
          parameters: [],
          responses: { '200': { description: 'Success' } }
        }
      ];

      const spec = generator.generateOpenAPI(endpoints, {
        apiTitle: 'Test API',
        apiVersion: '1.0.0'
      });

      const parsed = JSON.parse(spec);
      expect(parsed.openapi).toBe('3.0.0');
      expect(parsed.info.title).toBe('Test API');
      expect(parsed.info.version).toBe('1.0.0');
      expect(parsed.paths['/api/users']).toBeDefined();
    });

    it('should include authentication when specified', () => {
      const endpoints = [];
      const spec = generator.generateOpenAPI(endpoints, {
        authType: 'bearer'
      });

      const parsed = JSON.parse(spec);
      expect(parsed.components.securitySchemes.bearerAuth).toBeDefined();
      expect(parsed.security).toBeDefined();
    });

    it('should include API key auth', () => {
      const endpoints = [];
      const spec = generator.generateOpenAPI(endpoints, {
        authType: 'apikey'
      });

      const parsed = JSON.parse(spec);
      expect(parsed.components.securitySchemes.apiKey).toBeDefined();
    });

    it('should include request body in operation', () => {
      const endpoints = [
        {
          method: 'POST',
          path: '/api/users',
          summary: 'Create user',
          parameters: [],
          requestBody: {
            fields: [
              { name: 'email', type: 'string' },
              { name: 'name', type: 'string' }
            ]
          },
          responses: {}
        }
      ];

      const spec = generator.generateOpenAPI(endpoints, {});
      const parsed = JSON.parse(spec);

      expect(parsed.paths['/api/users'].post.requestBody).toBeDefined();
    });
  });

  describe('generateMarkdown', () => {
    it('should generate markdown documentation', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'Get users',
          parameters: [],
          responses: {}
        }
      ];

      const markdown = generator.generateMarkdown(endpoints, {
        apiTitle: 'Test API',
        baseUrl: 'https://api.example.com'
      });

      expect(markdown).toContain('# Test API');
      expect(markdown).toContain('### GET /api/users');
      expect(markdown).toContain('https://api.example.com');
    });

    it('should include curl examples by default', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'Get users',
          parameters: [],
          responses: {}
        }
      ];

      const markdown = generator.generateMarkdown(endpoints, {
        baseUrl: 'https://api.example.com'
      });

      expect(markdown).toContain('curl');
    });

    it('should include authentication headers', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'Get users',
          parameters: [],
          responses: {}
        }
      ];

      const markdown = generator.generateMarkdown(endpoints, {
        baseUrl: 'https://api.example.com',
        authType: 'bearer'
      });

      expect(markdown).toContain('Authorization: Bearer');
    });
  });

  describe('generatePostmanCollection', () => {
    it('should generate Postman collection', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'Get users',
          parameters: [],
          responses: {}
        }
      ];

      const collection = generator.generatePostmanCollection(endpoints, {
        apiTitle: 'Test API'
      });

      expect(collection.info.name).toBe('Test API');
      expect(collection.item.length).toBe(1);
      expect(collection.item[0].request.method).toBe('GET');
    });

    it('should include request body for POST', () => {
      const endpoints = [
        {
          method: 'POST',
          path: '/api/users',
          summary: 'Create user',
          parameters: [],
          requestBody: { fields: [] },
          responses: {}
        }
      ];

      const collection = generator.generatePostmanCollection(endpoints, {});
      expect(collection.item[0].request.body).toBeDefined();
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate endpoint statistics', () => {
      const endpoints = [
        { method: 'GET', parameters: [{ name: 'id' }] },
        { method: 'POST', parameters: [] },
        { method: 'GET', parameters: [{ name: 'userId' }] }
      ];

      const stats = generator.calculateStatistics(endpoints);

      expect(stats.totalEndpoints).toBe(3);
      expect(stats.endpointsByMethod.GET).toBe(2);
      expect(stats.endpointsByMethod.POST).toBe(1);
      expect(stats.documentedParameters).toBe(2);
    });
  });

  describe('validateDocumentation', () => {
    it('should warn about missing descriptions', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users',
          summary: 'GET /api/users',
          parameters: []
        }
      ];

      const warnings = generator.validateDocumentation(endpoints);
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings.some(w => w.message.includes('description'))).toBe(true);
    });

    it('should warn about POST without request body', () => {
      const endpoints = [
        {
          method: 'POST',
          path: '/api/users',
          summary: 'Create user',
          parameters: [],
          requestBody: null
        }
      ];

      const warnings = generator.validateDocumentation(endpoints);
      expect(warnings.some(w => w.message.includes('request body'))).toBe(true);
    });

    it('should return no warnings for well-documented API', () => {
      const endpoints = [
        {
          method: 'GET',
          path: '/api/users/{id}',
          summary: 'Get user by ID',
          parameters: [{ name: 'id' }]
        }
      ];

      const warnings = generator.validateDocumentation(endpoints);
      expect(warnings.length).toBe(0);
    });
  });

  describe('integration', () => {
    it('should handle complex Express API', () => {
      const code = `
        /**
         * Get all users
         */
        app.get('/api/v1/users', async (req, res) => {
          const users = await db.users.findAll();
          res.json(users);
        });

        /**
         * Create new user
         */
        app.post('/api/v1/users', async (req, res) => {
          const { email, name, role } = req.body;
          const user = await db.users.create({ email, name, role });
          res.status(201).json(user);
        });

        /**
         * Update user
         */
        app.put('/api/v1/users/:id', async (req, res) => {
          const { id } = req.params;
          const { email, name } = req.body;
          await db.users.update(id, { email, name });
          res.json({ success: true });
        });
      `;

      const result = generator.generate(code, {
        framework: 'express',
        outputFormats: ['openapi-json', 'markdown', 'postman'],
        apiTitle: 'User API',
        baseUrl: 'https://api.example.com',
        authType: 'bearer',
        includeExamples: true
      });

      expect(result.endpoints.length).toBe(3);
      expect(result.documentation.openapi).toBeDefined();
      expect(result.documentation.markdown).toBeDefined();
      expect(result.documentation.postman).toBeDefined();
      expect(result.statistics.totalEndpoints).toBe(3);
      expect(result.statistics.endpointsByMethod.GET).toBe(1);
      expect(result.statistics.endpointsByMethod.POST).toBe(1);
      expect(result.statistics.endpointsByMethod.PUT).toBe(1);
    });
  });
});
