---
name: api-documentation-generator
description: Automatically generates comprehensive API documentation from source code including OpenAPI/Swagger specifications, interactive docs, and example requests for REST APIs
version: 1.0.0
author: ComposioHQ
license: Apache-2.0
category: development
tags:
  - api
  - documentation
  - openapi
  - swagger
  - rest
  - backend
platforms:
  - claude-desktop
  - claude-web
  - claude-api
---

# API Documentation Generator

Automatically generate comprehensive, professional API documentation from your source code. This skill analyzes API endpoint definitions in popular backend frameworks (Express, FastAPI, Django, Flask, NestJS) and produces complete OpenAPI 3.0 specifications, interactive Markdown documentation, and example requests.

## What It Does

The API Documentation Generator skill:

1. **Analyzes API Code** - Parses route handlers, decorators, and endpoint definitions
2. **Extracts Metadata** - Identifies HTTP methods, paths, parameters, request bodies, and responses
3. **Generates OpenAPI Spec** - Creates valid OpenAPI 3.0 / Swagger JSON specifications
4. **Produces Markdown Docs** - Writes human-readable API reference documentation
5. **Creates Examples** - Generates realistic request/response examples with curl commands
6. **Exports Collections** - Optionally creates Postman collection JSON

## Key Features

- **Multi-Framework Support**: Express.js, FastAPI, Flask, Django REST Framework, NestJS
- **OpenAPI 3.0 Compliant**: Industry-standard specification format
- **Authentication Documentation**: Captures API key, Bearer token, OAuth requirements
- **Parameter Extraction**: Path params, query strings, headers, request bodies
- **Response Schemas**: Documents success and error response structures
- **Rate Limiting Info**: Identifies and documents rate limit configurations
- **Interactive Examples**: Curl commands and code snippets for testing

## When to Use This Skill

Use the API Documentation Generator when you need to:

- Document a REST API automatically from source code
- Create OpenAPI specifications for API gateways
- Generate interactive API reference for frontend teams
- Produce developer-facing API documentation
- Export Postman collections for testing
- Maintain up-to-date API docs in CI/CD
- Onboard new developers to existing APIs

## Supported Frameworks

### Node.js
- **Express.js**: Analyzes route definitions with `app.get()`, `app.post()`, etc.
- **NestJS**: Parses decorators like `@Get()`, `@Post()`, `@Body()`, `@Query()`

### Python
- **FastAPI**: Extracts from route decorators with automatic Pydantic schema support
- **Flask**: Analyzes `@app.route()` decorators and function signatures
- **Django REST Framework**: Parses ViewSets and APIView classes

## Example Usage

### Input: Express.js API Code

```javascript
const express = require('express');
const app = express();

/**
 * Get user by ID
 * @param {string} id - User ID
 * @returns {User} User object
 */
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await db.users.findById(id);
  res.json(user);
});

/**
 * Create new user
 * @body {string} email - User email
 * @body {string} name - User name
 * @returns {User} Created user
 */
app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;
  const user = await db.users.create({ email, name });
  res.status(201).json(user);
});
```

### Output: Generated Documentation

#### OpenAPI 3.0 Specification

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0
  description: API for managing users

paths:
  /api/users/{id}:
    get:
      summary: Get user by ID
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
          description: User ID
      responses:
        '200':
          description: User object
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found

  /api/users:
    post:
      summary: Create new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - name
              properties:
                email:
                  type: string
                  format: email
                name:
                  type: string
      responses:
        '201':
          description: Created user
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        email:
          type: string
          format: email
        name:
          type: string
        createdAt:
          type: string
          format: date-time
```

#### Markdown Documentation

```markdown
# User API Documentation

## Endpoints

### GET /api/users/:id

Get user by ID

**Parameters:**
- `id` (path, required): User ID

**Response (200):**
```json
{
  "id": "123",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

**Example Request:**
```bash
curl -X GET https://api.example.com/api/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /api/users

Create new user

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "Jane Smith"
}
```

**Response (201):**
```json
{
  "id": "456",
  "email": "newuser@example.com",
  "name": "Jane Smith",
  "createdAt": "2025-01-15T11:00:00Z"
}
```

**Example Request:**
```bash
curl -X POST https://api.example.com/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"email":"newuser@example.com","name":"Jane Smith"}'
```
```

## Output Formats

The skill can generate documentation in multiple formats:

1. **OpenAPI 3.0 JSON/YAML** - Standard specification format
2. **Markdown** - Human-readable API reference
3. **Postman Collection** - Import into Postman for testing
4. **HTML (Interactive)** - Using Swagger UI or ReDoc templates

## Best Practices

### For Best Results

1. **Add JSDoc Comments**: Include parameter descriptions and return types in comments
2. **Use Type Annotations**: TypeScript types or Pydantic models improve schema extraction
3. **Document Authentication**: Specify auth requirements in middleware or decorators
4. **Include Examples**: Add example values in comments for realistic documentation
5. **Version Your API**: Include version numbers in paths or headers

### Code Comment Conventions

```javascript
/**
 * Endpoint description
 * @param {type} paramName - Parameter description
 * @body {type} fieldName - Request body field
 * @query {type} queryName - Query parameter
 * @header {type} headerName - Required header
 * @returns {Type} Response description
 * @auth Bearer token required
 * @ratelimit 100 requests per hour
 */
```

## Limitations

- **Static Analysis Only**: Cannot capture runtime behavior or dynamic routes
- **Framework Detection**: Requires recognizable routing patterns
- **Complex Schemas**: Deeply nested objects may need manual refinement
- **Custom Middleware**: Auth middleware may need explicit documentation
- **GraphQL**: Focuses on REST APIs; use GraphQL introspection for GraphQL APIs

## Tips

- Run this skill in CI/CD to keep documentation always up-to-date
- Combine with version control to track API changes over time
- Use generated OpenAPI specs with API gateway tools (Kong, Tyk, AWS API Gateway)
- Export Postman collections for QA teams to test endpoints
- Host generated Markdown docs alongside your codebase

## Related Skills

- **technical-documentation-writer**: Generate broader project documentation
- **changelog-generator**: Document API version changes
- **mcp-builder**: Create MCP servers for API integrations

## Installation

This skill is available for use in:
- Claude.ai web interface
- Claude Code (desktop application)
- Claude API integrations

No additional installation required - activate the skill and start generating API documentation from your code!
