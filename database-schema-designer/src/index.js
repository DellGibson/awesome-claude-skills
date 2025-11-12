/**
 * Database Schema Designer
 * Generates SQL schemas, ER diagrams, and ORM migration files from descriptions
 */

class DatabaseSchemaDesigner {
  constructor() {
    this.supportedDatabases = ['postgresql', 'mysql', 'sqlite'];
    this.supportedORMs = ['prisma', 'typeorm', 'alembic', 'sequelize'];
    this.relationships = ['one-to-one', 'one-to-many', 'many-to-many'];
  }

  /**
   * Main entry point - generates complete database schema
   */
  design(description, database, options = {}) {
    const entities = this.parseEntities(description);
    const sql = this.generateSQL(entities, database, options);
    const diagram = this.generateMermaidDiagram(entities);
    const ormSchema = options.orm !== 'none' ? this.generateORMSchema(entities, options.orm) : null;
    const migration = options.orm !== 'none' ? this.generateMigration(entities, options.orm) : null;
    const indexes = options.includeIndexes ? this.recommendIndexes(entities) : [];
    const seedData = options.seedData ? this.generateSeedData(entities, database) : null;
    const documentation = this.generateDocumentation(entities, options);

    return {
      sql,
      diagram,
      ormSchema,
      migration,
      entities: entities.map(e => this.serializeEntity(e)),
      indexes,
      seedData,
      documentation
    };
  }

  /**
   * Parse entity descriptions from natural language
   */
  parseEntities(description) {
    const entities = [];
    const lines = description.split('\n').map(l => l.trim()).filter(l => l);

    let currentEntity = null;
    let inRelationships = false;

    lines.forEach(line => {
      // Detect entity definition
      if (line.match(/^-?\s*(\w+):\s*(.+)/)) {
        const match = line.match(/^-?\s*(\w+):\s*(.+)/);
        const entityName = match[1];
        const fieldsStr = match[2];

        currentEntity = {
          name: entityName,
          tableName: this.toSnakeCase(entityName),
          columns: [],
          relationships: []
        };

        // Parse fields
        const fields = fieldsStr.split(',').map(f => f.trim());
        fields.forEach(field => {
          const column = this.parseField(field);
          if (column) {
            currentEntity.columns.push(column);
          }
        });

        entities.push(currentEntity);
      } else if (line.toLowerCase().includes('relationship')) {
        inRelationships = true;
      } else if (inRelationships && line.includes('have') || line.includes('belong')) {
        // Parse relationship
        const rel = this.parseRelationship(line, entities);
        if (rel) {
          const entity = entities.find(e => e.name === rel.source);
          if (entity) {
            entity.relationships.push({
              type: rel.type,
              target: rel.target,
              foreignKey: rel.foreignKey
            });
          }
        }
      }
    });

    return entities;
  }

  /**
   * Parse a single field definition
   */
  parseField(fieldDef) {
    const field = fieldDef.trim();

    // Handle foreign key fields
    if (field.endsWith('_id') || field.includes('_id')) {
      return {
        name: field,
        type: 'INTEGER',
        nullable: false,
        unique: false,
        primaryKey: false,
        foreignKey: true
      };
    }

    // Common field patterns
    if (field === 'id') {
      return {
        name: 'id',
        type: 'SERIAL',
        nullable: false,
        unique: false,
        primaryKey: true
      };
    }

    if (field === 'email') {
      return {
        name: 'email',
        type: 'VARCHAR(255)',
        nullable: false,
        unique: true,
        primaryKey: false
      };
    }

    if (field === 'password') {
      return {
        name: 'password',
        type: 'VARCHAR(255)',
        nullable: false,
        unique: false,
        primaryKey: false
      };
    }

    if (field.includes('name') || field.includes('title')) {
      return {
        name: field,
        type: 'VARCHAR(255)',
        nullable: false,
        unique: false,
        primaryKey: false
      };
    }

    if (field.includes('description') || field.includes('content') || field.includes('body')) {
      return {
        name: field,
        type: 'TEXT',
        nullable: true,
        unique: false,
        primaryKey: false
      };
    }

    if (field.includes('price') || field.includes('amount') || field.includes('total')) {
      return {
        name: field,
        type: 'DECIMAL(10, 2)',
        nullable: false,
        unique: false,
        primaryKey: false
      };
    }

    if (field.includes('quantity') || field.includes('stock') || field.includes('count')) {
      return {
        name: field,
        type: 'INTEGER',
        nullable: false,
        unique: false,
        primaryKey: false
      };
    }

    if (field.includes('created_at') || field.includes('updated_at')) {
      return {
        name: field,
        type: 'TIMESTAMP',
        nullable: false,
        unique: false,
        primaryKey: false,
        default: 'CURRENT_TIMESTAMP'
      };
    }

    if (field.includes('slug')) {
      return {
        name: field,
        type: 'VARCHAR(100)',
        nullable: false,
        unique: true,
        primaryKey: false
      };
    }

    if (field.includes('status')) {
      return {
        name: field,
        type: 'VARCHAR(50)',
        nullable: false,
        unique: false,
        primaryKey: false,
        default: "'pending'"
      };
    }

    // Default string field
    return {
      name: field,
      type: 'VARCHAR(255)',
      nullable: true,
      unique: false,
      primaryKey: false
    };
  }

  /**
   * Parse relationship from description
   */
  parseRelationship(line, entities) {
    const lowerLine = line.toLowerCase();

    // "Users have many Posts"
    if (lowerLine.includes('have many') || lowerLine.includes('has many')) {
      const match = line.match(/(\w+)\s+(?:have|has)\s+many\s+(\w+)/i);
      if (match) {
        return {
          source: match[1],
          target: match[2],
          type: 'one-to-many',
          foreignKey: this.toSnakeCase(match[1].replace(/s$/, '')) + '_id'
        };
      }
    }

    // "Posts belong to Users"
    if (lowerLine.includes('belong')) {
      const match = line.match(/(\w+)\s+belong\s+to\s+(\w+)/i);
      if (match) {
        return {
          source: match[1],
          target: match[2],
          type: 'many-to-one',
          foreignKey: this.toSnakeCase(match[2].replace(/s$/, '')) + '_id'
        };
      }
    }

    return null;
  }

  /**
   * Generate SQL DDL statements
   */
  generateSQL(entities, database, options) {
    let sql = `-- Generated SQL Schema for ${database}\n`;
    sql += `-- Created: ${new Date().toISOString()}\n\n`;

    entities.forEach(entity => {
      sql += this.generateTableSQL(entity, database, options);
      sql += '\n';

      // Generate indexes
      if (options.includeIndexes) {
        sql += this.generateIndexesSQL(entity, database);
        sql += '\n';
      }
    });

    return sql;
  }

  /**
   * Generate CREATE TABLE statement
   */
  generateTableSQL(entity, database, options) {
    let sql = `-- ${entity.name} table\n`;
    sql += `CREATE TABLE ${entity.tableName} (\n`;

    const columns = [];

    entity.columns.forEach(col => {
      let colDef = `    ${col.name} ${this.mapDataType(col.type, database)}`;

      if (col.primaryKey) {
        colDef += ' PRIMARY KEY';
      }

      if (col.unique && !col.primaryKey) {
        colDef += ' UNIQUE';
      }

      if (!col.nullable) {
        colDef += ' NOT NULL';
      }

      if (col.default) {
        colDef += ` DEFAULT ${col.default}`;
      }

      columns.push(colDef);
    });

    // Add foreign key constraints
    entity.columns.forEach(col => {
      if (col.foreignKey) {
        const targetTable = this.inferTargetTable(col.name);
        const constraint = `    FOREIGN KEY (${col.name}) REFERENCES ${targetTable}(id) ON DELETE CASCADE`;
        columns.push(constraint);
      }
    });

    sql += columns.join(',\n');
    sql += '\n);\n';

    return sql;
  }

  /**
   * Generate index statements
   */
  generateIndexesSQL(entity, database) {
    let sql = '';

    entity.columns.forEach(col => {
      if (col.unique && !col.primaryKey) {
        sql += `CREATE INDEX idx_${entity.tableName}_${col.name} ON ${entity.tableName}(${col.name});\n`;
      } else if (col.foreignKey) {
        sql += `CREATE INDEX idx_${entity.tableName}_${col.name} ON ${entity.tableName}(${col.name});\n`;
      }
    });

    return sql;
  }

  /**
   * Generate Mermaid ER diagram
   */
  generateMermaidDiagram(entities) {
    let diagram = 'erDiagram\n';

    // Generate relationships
    entities.forEach(entity => {
      entity.relationships.forEach(rel => {
        const symbol = this.getRelationshipSymbol(rel.type);
        diagram += `    ${entity.tableName} ${symbol} ${this.toSnakeCase(rel.target)} : ${rel.type}\n`;
      });
    });

    diagram += '\n';

    // Generate entity definitions
    entities.forEach(entity => {
      diagram += `    ${entity.tableName} {\n`;

      entity.columns.forEach(col => {
        let type = col.type.toLowerCase();
        let modifiers = [];

        if (col.primaryKey) modifiers.push('PK');
        if (col.unique) modifiers.push('UK');
        if (col.foreignKey) modifiers.push('FK');

        diagram += `        ${type} ${col.name}`;
        if (modifiers.length > 0) {
          diagram += ` ${modifiers.join(',')}`;
        }
        diagram += '\n';
      });

      diagram += `    }\n\n`;
    });

    return diagram;
  }

  /**
   * Generate Prisma schema
   */
  generateORMSchema(entities, orm) {
    if (orm === 'prisma') {
      return this.generatePrismaSchema(entities);
    } else if (orm === 'typeorm') {
      return this.generateTypeORMSchema(entities);
    } else if (orm === 'alembic') {
      return this.generateAlembicSchema(entities);
    }
    return '';
  }

  /**
   * Generate Prisma schema file
   */
  generatePrismaSchema(entities) {
    let schema = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

`;

    entities.forEach(entity => {
      const modelName = this.toPascalCase(entity.name);
      schema += `model ${modelName} {\n`;

      entity.columns.forEach(col => {
        let fieldDef = `  ${this.toCamelCase(col.name)} `;

        // Type mapping
        if (col.type === 'SERIAL' || col.type === 'INTEGER') {
          fieldDef += 'Int';
        } else if (col.type.startsWith('VARCHAR')) {
          fieldDef += 'String';
        } else if (col.type === 'TEXT') {
          fieldDef += 'String';
        } else if (col.type.startsWith('DECIMAL')) {
          fieldDef += 'Decimal';
        } else if (col.type === 'TIMESTAMP') {
          fieldDef += 'DateTime';
        } else {
          fieldDef += 'String';
        }

        if (col.nullable) {
          fieldDef += '?';
        }

        // Modifiers
        if (col.primaryKey) {
          fieldDef += ' @id @default(autoincrement())';
        }
        if (col.unique && !col.primaryKey) {
          fieldDef += ' @unique';
        }
        if (col.default && col.type === 'TIMESTAMP') {
          fieldDef += ' @default(now())';
        }
        if (col.name !== this.toCamelCase(col.name)) {
          fieldDef += ` @map("${col.name}")`;
        }

        schema += fieldDef + '\n';
      });

      // Add relations
      entity.relationships.forEach(rel => {
        const relName = this.toCamelCase(rel.target);
        if (rel.type === 'one-to-many') {
          schema += `  ${relName}  ${this.toPascalCase(rel.target)}[]\n`;
        }
      });

      schema += `\n  @@map("${entity.tableName}")\n`;
      schema += `}\n\n`;
    });

    return schema;
  }

  /**
   * Generate TypeORM entity classes
   */
  generateTypeORMSchema(entities) {
    let schema = '';

    entities.forEach(entity => {
      const className = this.toPascalCase(entity.name);
      schema += `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';\n\n`;
      schema += `@Entity('${entity.tableName}')\n`;
      schema += `export class ${className} {\n`;

      entity.columns.forEach(col => {
        if (col.primaryKey) {
          schema += `  @PrimaryGeneratedColumn()\n`;
        } else {
          let colOptions = [];
          if (col.unique) colOptions.push('unique: true');
          if (!col.nullable) colOptions.push('nullable: false');

          schema += `  @Column(${colOptions.length > 0 ? `{ ${colOptions.join(', ')} }` : ''})\n`;
        }

        const tsType = this.mapToTypeScriptType(col.type);
        schema += `  ${this.toCamelCase(col.name)}: ${tsType};\n\n`;
      });

      schema += `}\n\n`;
    });

    return schema;
  }

  /**
   * Generate Alembic migration
   */
  generateAlembicSchema(entities) {
    let migration = `"""Create initial tables

Revision ID: 001
Revises:
Create Date: ${new Date().toISOString()}
"""

from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
`;

    entities.forEach(entity => {
      migration += `    op.create_table(\n`;
      migration += `        '${entity.tableName}',\n`;

      entity.columns.forEach(col => {
        const saType = this.mapToSQLAlchemyType(col.type);
        migration += `        sa.Column('${col.name}', ${saType}${col.primaryKey ? ', primary_key=True' : ''}),\n`;
      });

      migration += `    )\n\n`;
    });

    migration += `\ndef downgrade():
`;

    entities.reverse().forEach(entity => {
      migration += `    op.drop_table('${entity.tableName}')\n`;
    });

    return migration;
  }

  /**
   * Generate migration file
   */
  generateMigration(entities, orm) {
    return this.generateORMSchema(entities, orm);
  }

  /**
   * Recommend indexes for performance
   */
  recommendIndexes(entities) {
    const indexes = [];

    entities.forEach(entity => {
      entity.columns.forEach(col => {
        if (col.unique && !col.primaryKey) {
          indexes.push({
            table: entity.tableName,
            columns: [col.name],
            reason: `Unique constraint on ${col.name} improves lookup performance`
          });
        } else if (col.foreignKey) {
          indexes.push({
            table: entity.tableName,
            columns: [col.name],
            reason: `Foreign key ${col.name} used in JOIN operations`
          });
        } else if (col.name === 'created_at' || col.name === 'updated_at') {
          indexes.push({
            table: entity.tableName,
            columns: [col.name],
            reason: `Timestamp ${col.name} frequently used in sorting and filtering`
          });
        }
      });
    });

    return indexes;
  }

  /**
   * Generate seed data
   */
  generateSeedData(entities, database) {
    let seed = `-- Sample seed data\n\n`;

    entities.forEach(entity => {
      if (entity.name === 'Users' || entity.name === 'User') {
        seed += `INSERT INTO ${entity.tableName} (email, name, password) VALUES\n`;
        seed += `    ('user1@example.com', 'John Doe', 'hashed_password'),\n`;
        seed += `    ('user2@example.com', 'Jane Smith', 'hashed_password');\n\n`;
      } else if (entity.name === 'Categories' || entity.name === 'Category') {
        seed += `INSERT INTO ${entity.tableName} (name, slug) VALUES\n`;
        seed += `    ('Technology', 'technology'),\n`;
        seed += `    ('Business', 'business');\n\n`;
      }
    });

    return seed;
  }

  /**
   * Generate documentation
   */
  generateDocumentation(entities, options) {
    let doc = `# Database Schema Documentation\n\n`;
    doc += `## Tables\n\n`;

    entities.forEach(entity => {
      doc += `### ${entity.name}\n\n`;
      doc += `**Table:** \`${entity.tableName}\`\n\n`;
      doc += `| Column | Type | Nullable | Unique | Primary Key |\n`;
      doc += `|--------|------|----------|--------|-------------|\n`;

      entity.columns.forEach(col => {
        doc += `| ${col.name} | ${col.type} | ${col.nullable ? 'Yes' : 'No'} | ${col.unique ? 'Yes' : 'No'} | ${col.primaryKey ? 'Yes' : 'No'} |\n`;
      });

      doc += `\n`;

      if (entity.relationships.length > 0) {
        doc += `**Relationships:**\n\n`;
        entity.relationships.forEach(rel => {
          doc += `- ${rel.type} with ${rel.target}\n`;
        });
        doc += `\n`;
      }
    });

    return doc;
  }

  /**
   * Helper: Serialize entity for output
   */
  serializeEntity(entity) {
    return {
      name: entity.name,
      tableName: entity.tableName,
      columns: entity.columns,
      relationships: entity.relationships
    };
  }

  /**
   * Helper: Map data types between databases
   */
  mapDataType(type, database) {
    if (database === 'postgresql') {
      return type;
    } else if (database === 'mysql') {
      if (type === 'SERIAL') return 'INT AUTO_INCREMENT';
      if (type === 'TEXT') return 'TEXT';
      return type;
    } else if (database === 'sqlite') {
      if (type === 'SERIAL') return 'INTEGER PRIMARY KEY AUTOINCREMENT';
      if (type.startsWith('VARCHAR')) return 'TEXT';
      if (type.startsWith('DECIMAL')) return 'REAL';
      return type;
    }
    return type;
  }

  /**
   * Helper: Map to TypeScript types
   */
  mapToTypeScriptType(sqlType) {
    if (sqlType === 'SERIAL' || sqlType === 'INTEGER') return 'number';
    if (sqlType.startsWith('VARCHAR') || sqlType === 'TEXT') return 'string';
    if (sqlType.startsWith('DECIMAL')) return 'number';
    if (sqlType === 'TIMESTAMP') return 'Date';
    return 'string';
  }

  /**
   * Helper: Map to SQLAlchemy types
   */
  mapToSQLAlchemyType(sqlType) {
    if (sqlType === 'SERIAL') return 'sa.Integer';
    if (sqlType === 'INTEGER') return 'sa.Integer';
    if (sqlType.startsWith('VARCHAR')) {
      const match = sqlType.match(/VARCHAR\((\d+)\)/);
      return match ? `sa.String(${match[1]})` : 'sa.String(255)';
    }
    if (sqlType === 'TEXT') return 'sa.Text';
    if (sqlType.startsWith('DECIMAL')) return 'sa.Numeric(10, 2)';
    if (sqlType === 'TIMESTAMP') return 'sa.DateTime';
    return 'sa.String(255)';
  }

  /**
   * Helper: Get relationship symbol for Mermaid
   */
  getRelationshipSymbol(type) {
    if (type === 'one-to-one') return '||--||';
    if (type === 'one-to-many') return '||--o{';
    if (type === 'many-to-many') return '}o--o{';
    return '||--o{';
  }

  /**
   * Helper: Infer target table from foreign key column name
   */
  inferTargetTable(columnName) {
    return columnName.replace(/_id$/, '') + 's';
  }

  /**
   * Helper: Convert to snake_case
   */
  toSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
  }

  /**
   * Helper: Convert to camelCase
   */
  toCamelCase(str) {
    return str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
  }

  /**
   * Helper: Convert to PascalCase
   */
  toPascalCase(str) {
    const camel = this.toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DatabaseSchemaDesigner;
}

// Demo usage
if (require.main === module) {
  const designer = new DatabaseSchemaDesigner();

  const description = `
Create a blog database with:

Entities:
- Users: id, email, password, name, created_at
- Posts: id, title, content, user_id, created_at
- Comments: id, content, post_id, user_id, created_at

Relationships:
- Users have many Posts
- Posts have many Comments
- Users have many Comments
  `;

  const result = designer.design(description, 'postgresql', {
    orm: 'prisma',
    outputFormats: ['sql', 'mermaid', 'prisma'],
    includeIndexes: true,
    includeTimestamps: true,
    seedData: true
  });

  console.log('=== Generated SQL ===');
  console.log(result.sql);
  console.log('\n=== Mermaid Diagram ===');
  console.log(result.diagram);
  console.log('\n=== Recommended Indexes ===');
  console.log(JSON.stringify(result.indexes, null, 2));
}
