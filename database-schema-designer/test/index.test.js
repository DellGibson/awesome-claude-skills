/**
 * Tests for Database Schema Designer
 */

const DatabaseSchemaDesigner = require('../src/index');

describe('DatabaseSchemaDesigner', () => {
  let designer;

  beforeEach(() => {
    designer = new DatabaseSchemaDesigner();
  });

  describe('constructor', () => {
    it('should initialize with supported databases', () => {
      expect(designer.supportedDatabases).toContain('postgresql');
      expect(designer.supportedDatabases).toContain('mysql');
      expect(designer.supportedDatabases).toContain('sqlite');
    });

    it('should initialize with supported ORMs', () => {
      expect(designer.supportedORMs).toContain('prisma');
      expect(designer.supportedORMs).toContain('typeorm');
      expect(designer.supportedORMs).toContain('alembic');
      expect(designer.supportedORMs).toContain('sequelize');
    });

    it('should define relationship types', () => {
      expect(designer.relationships).toContain('one-to-one');
      expect(designer.relationships).toContain('one-to-many');
      expect(designer.relationships).toContain('many-to-many');
    });
  });

  describe('design', () => {
    const description = `
      User: id, email, password, name
      Post: id, title, content, user_id
    `;

    it('should generate complete schema design', () => {
      const result = designer.design(description, 'postgresql', {
        orm: 'prisma'
      });

      expect(result).toHaveProperty('sql');
      expect(result).toHaveProperty('diagram');
      expect(result).toHaveProperty('ormSchema');
      expect(result).toHaveProperty('migration');
      expect(result).toHaveProperty('entities');
      expect(result).toHaveProperty('documentation');
    });

    it('should parse entities from description', () => {
      const result = designer.design(description, 'postgresql', {});

      expect(result.entities.length).toBeGreaterThan(0);
    });

    it('should generate SQL', () => {
      const result = designer.design(description, 'postgresql', {});

      expect(result.sql).toContain('CREATE TABLE');
    });

    it('should generate Mermaid diagram', () => {
      const result = designer.design(description, 'postgresql', {});

      expect(result.diagram).toContain('erDiagram');
    });
  });

  describe('parseEntities', () => {
    it('should parse simple entity', () => {
      const description = 'User: id, email, name';
      const entities = designer.parseEntities(description);

      expect(entities.length).toBe(1);
      expect(entities[0].name).toBe('User');
      expect(entities[0].columns.length).toBe(3);
    });

    it('should parse multiple entities', () => {
      const description = `
        User: id, email, name
        Post: id, title, content
      `;
      const entities = designer.parseEntities(description);

      expect(entities.length).toBe(2);
    });

    it('should convert entity names to snake_case for table names', () => {
      const description = 'UserProfile: id, bio';
      const entities = designer.parseEntities(description);

      expect(entities[0].tableName).toMatch(/user_profile/i);
    });
  });

  describe('parseField', () => {
    it('should parse id field as primary key', () => {
      const field = designer.parseField('id');

      expect(field.name).toBe('id');
      expect(field.primaryKey).toBe(true);
    });

    it('should parse email field with unique constraint', () => {
      const field = designer.parseField('email');

      expect(field.name).toBe('email');
      expect(field.unique).toBe(true);
    });

    it('should parse foreign key fields', () => {
      const field = designer.parseField('user_id');

      expect(field.foreignKey).toBe(true);
    });

    it('should parse name fields as VARCHAR', () => {
      const field = designer.parseField('name');

      expect(field.type).toContain('VARCHAR');
    });
  });

  describe('generateSQL', () => {
    it('should generate PostgreSQL CREATE TABLE statements', () => {
      const entities = [
        {
          name: 'User',
          tableName: 'users',
          columns: [
            { name: 'id', type: 'SERIAL', primaryKey: true, nullable: false },
            { name: 'email', type: 'VARCHAR(255)', unique: true, nullable: false }
          ],
          relationships: []
        }
      ];

      const sql = designer.generateSQL(entities, 'postgresql', {});

      expect(sql).toContain('CREATE TABLE users');
      expect(sql).toContain('id SERIAL PRIMARY KEY');
      expect(sql).toContain('email VARCHAR(255)');
      expect(sql).toContain('UNIQUE');
    });

    it('should generate MySQL syntax', () => {
      const entities = [
        {
          name: 'User',
          tableName: 'users',
          columns: [
            { name: 'id', type: 'INTEGER', primaryKey: true, nullable: false }
          ],
          relationships: []
        }
      ];

      const sql = designer.generateSQL(entities, 'mysql', {});

      expect(sql).toContain('CREATE TABLE users');
    });

    it('should include foreign key constraints', () => {
      const entities = [
        {
          name: 'Post',
          tableName: 'posts',
          columns: [
            { name: 'id', type: 'SERIAL', primaryKey: true },
            { name: 'user_id', type: 'INTEGER', foreignKey: true }
          ],
          relationships: []
        }
      ];

      const sql = designer.generateSQL(entities, 'postgresql', {});

      expect(sql).toContain('user_id');
    });
  });

  describe('generateMermaidDiagram', () => {
    it('should generate Mermaid ER diagram', () => {
      const entities = [
        {
          name: 'User',
          tableName: 'users',
          columns: [
            { name: 'id', type: 'SERIAL' },
            { name: 'email', type: 'VARCHAR' }
          ],
          relationships: []
        }
      ];

      const diagram = designer.generateMermaidDiagram(entities);

      expect(diagram).toContain('erDiagram');
      expect(diagram).toContain('User');
    });

    it('should include relationships in diagram', () => {
      const entities = [
        {
          name: 'User',
          tableName: 'users',
          columns: [{ name: 'id', type: 'SERIAL' }],
          relationships: [
            { type: 'one-to-many', target: 'Post' }
          ]
        },
        {
          name: 'Post',
          tableName: 'posts',
          columns: [{ name: 'id', type: 'SERIAL' }],
          relationships: []
        }
      ];

      const diagram = designer.generateMermaidDiagram(entities);

      expect(diagram).toContain('||--o{');
    });
  });

  describe('recommendIndexes', () => {
    it('should recommend indexes for foreign keys', () => {
      const entities = [
        {
          name: 'Post',
          tableName: 'posts',
          columns: [
            { name: 'user_id', type: 'INTEGER', foreignKey: true }
          ]
        }
      ];

      const indexes = designer.recommendIndexes(entities);

      expect(indexes.length).toBeGreaterThan(0);
      expect(indexes.some(idx => idx.column === 'user_id')).toBe(true);
    });

    it('should recommend composite indexes where appropriate', () => {
      const entities = [
        {
          name: 'Order',
          tableName: 'orders',
          columns: [
            { name: 'user_id', foreignKey: true },
            { name: 'created_at', type: 'TIMESTAMP' }
          ]
        }
      ];

      const indexes = designer.recommendIndexes(entities);

      expect(Array.isArray(indexes)).toBe(true);
    });
  });

  describe('generateDocumentation', () => {
    it('should generate schema documentation', () => {
      const entities = [
        {
          name: 'User',
          tableName: 'users',
          columns: [
            { name: 'id', type: 'SERIAL', primaryKey: true },
            { name: 'email', type: 'VARCHAR', unique: true }
          ],
          relationships: []
        }
      ];

      const doc = designer.generateDocumentation(entities, {});

      expect(doc).toContain('User');
      expect(doc).toContain('email');
    });
  });

  describe('integration', () => {
    it('should design complete multi-table schema', () => {
      const description = `
        User: id, email, password, name, created_at
        Post: id, title, content, user_id, created_at
        Comment: id, content, post_id, user_id, created_at

        Relationships:
        - User has many Posts
        - User has many Comments
        - Post has many Comments
        - Post belongs to User
        - Comment belongs to Post
        - Comment belongs to User
      `;

      const result = designer.design(description, 'postgresql', {
        orm: 'prisma',
        includeIndexes: true,
        seedData: true
      });

      expect(result.entities.length).toBe(3);
      expect(result.sql).toContain('CREATE TABLE users');
      expect(result.sql).toContain('CREATE TABLE posts');
      expect(result.sql).toContain('CREATE TABLE comments');
      expect(result.diagram).toContain('erDiagram');
      expect(result.ormSchema).toBeDefined();
      expect(result.migration).toBeDefined();
      expect(result.indexes.length).toBeGreaterThan(0);
      expect(result.seedData).toBeDefined();
    });
  });
});
