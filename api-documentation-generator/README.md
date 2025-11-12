# API Documentation Generator

Automatically generate comprehensive, professional API documentation from your source code. Analyzes API endpoints in Express, FastAPI, Django, Flask, and NestJS to produce OpenAPI 3.0 specifications, interactive Markdown documentation, and Postman collections.

## Features

- **Multi-Framework Support**: Express.js, FastAPI, Flask, Django REST Framework, NestJS
- **OpenAPI 3.0**: Industry-standard specification generation
- **Multiple Output Formats**: OpenAPI JSON/YAML, Markdown, Postman collections, HTML
- **Smart Extraction**: Analyzes routes, parameters, request bodies, and responses
- **Authentication Documentation**: Captures API key, Bearer token, OAuth configurations
- **Example Generation**: Creates realistic curl commands and code snippets

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `api-documentation-generator` skill
4. Claude will automatically use this skill when you need to document APIs

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `api-documentation-generator`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["api-documentation-generator"],
    messages=[{
        "role": "user",
        "content": "Document this Express API: [paste your code]"
    }]
)
```

## Usage

### Basic Example

```javascript
// Your Express.js API code
app.get('/api/users/:id', async (req, res) => {
  const user = await db.users.findById(req.params.id);
  res.json(user);
});

app.post('/api/users', async (req, res) => {
  const { email, name } = req.body;
  const user = await db.users.create({ email, name });
  res.status(201).json(user);
});
```

Ask Claude:
> "Generate OpenAPI documentation for this Express API. Include examples and use Bearer authentication."

### Output

Claude will generate:

1. **OpenAPI 3.0 Specification** (JSON/YAML)
2. **Markdown Documentation** with:
   - Endpoint descriptions
   - Parameter documentation
   - Request/response examples
   - Curl commands
3. **Postman Collection** (optional)
4. **Statistics** about your API

### Advanced Usage

You can specify:

- **Framework**: Express, FastAPI, Flask, Django, NestJS (or auto-detect)
- **Output Formats**: Choose from openapi-json, openapi-yaml, markdown, postman, html
- **Authentication**: none, bearer, apikey, oauth2, basic
- **Base URL**: Your API's base URL
- **Examples**: Include/exclude curl examples

## Best Practices

### Add JSDoc Comments

```javascript
/**
 * Get user profile by ID
 * @param {string} id - Unique user identifier
 * @returns {User} User profile object
 * @auth Bearer token required
 */
app.get('/api/users/:id', handler);
```

### Use Type Annotations

For TypeScript/FastAPI, type annotations improve schema extraction:

```typescript
interface User {
  id: string;
  email: string;
  name: string;
}

app.get<User>('/api/users/:id', handler);
```

### Document Authentication

Specify auth requirements explicitly:

```javascript
// Option 1: In comments
/**
 * @auth Bearer token required
 * @ratelimit 100 requests per hour
 */

// Option 2: Via middleware (will be detected)
app.use('/api/*', authenticateBearer);
```

## Supported Frameworks

| Framework | Language | Route Detection |
|-----------|----------|-----------------|
| Express.js | Node.js | `app.get()`, `app.post()`, etc. |
| NestJS | TypeScript | `@Get()`, `@Post()`, decorators |
| FastAPI | Python | `@app.get()`, `@app.post()` |
| Flask | Python | `@app.route()` |
| Django REST | Python | `APIView`, `ViewSet` classes |

## Output Formats

### OpenAPI 3.0 (YAML/JSON)

Standard API specification format compatible with:
- Swagger UI
- Redoc
- API Gateway tools (AWS API Gateway, Kong, Tyk)
- Code generators (OpenAPI Generator)

### Markdown

Human-readable documentation perfect for:
- GitHub/GitLab READMEs
- Developer portals
- Static site generators
- Internal wikis

### Postman Collection

Import directly into Postman for:
- API testing
- Team collaboration
- Environment management
- Automated test runs

## Example Output

See the [SKILL.md](./SKILL.md) file for detailed examples of generated documentation.

## Limitations

- **Static Analysis**: Cannot capture runtime behavior or dynamic routes
- **Complex Schemas**: Deeply nested objects may need manual refinement
- **Custom Middleware**: Some auth patterns may need explicit documentation
- **GraphQL**: Designed for REST APIs (use GraphQL introspection for GraphQL)

## Integration Ideas

### CI/CD Pipeline

```yaml
# .github/workflows/docs.yml
- name: Generate API Docs
  run: |
    claude-code --skill api-documentation-generator \
      --input src/routes/*.js \
      --output docs/api.md
```

### Pre-Commit Hook

Keep documentation in sync with code:

```bash
#!/bin/bash
# Regenerate API docs before commit
claude-code generate-api-docs && git add docs/
```

### Combine with Other Skills

- **changelog-generator**: Document API changes in release notes
- **technical-documentation-writer**: Generate full project documentation
- **mcp-builder**: Create MCP servers for your documented APIs

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
