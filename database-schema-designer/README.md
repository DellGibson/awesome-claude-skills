# Database Schema Designer

Generate production-ready database schemas from natural language descriptions. Creates SQL DDL statements, entity-relationship diagrams (Mermaid), and ORM migration files for PostgreSQL, MySQL, and SQLite with Prisma, TypeORM, and Alembic support.

## Features

- **Multi-Database**: PostgreSQL, MySQL, SQLite with dialect-specific syntax
- **ER Diagrams**: Visual Mermaid diagrams for documentation
- **ORM Integration**: Prisma, TypeORM, Alembic, Sequelize migration files
- **Smart Relationships**: One-to-one, one-to-many, many-to-many with junction tables
- **Index Recommendations**: Automatic performance optimization suggestions
- **Data Types**: Intelligent type mapping based on field names
- **Constraints**: Primary keys, foreign keys, unique, check, not null
- **Seed Data**: Optional sample data generation

## Installation

### Claude.ai

1. Open [Claude.ai](https://claude.ai)
2. Start a new conversation
3. Upload or reference the `database-schema-designer` skill
4. Claude will automatically use this skill for database schema generation

### Claude Code

1. Open Claude Code
2. Navigate to Skills > Install Skill
3. Select `database-schema-designer`
4. Activate the skill in your project

### Claude API

```python
import anthropic

client = anthropic.Anthropic(api_key="your-api-key")

response = client.messages.create(
    model="claude-sonnet-4-5-20250929",
    skills=["database-schema-designer"],
    messages=[{
        "role": "user",
        "content": "Design a database schema for a blog with users, posts, and comments"
    }]
)
```

## Usage

### Basic Example

Ask Claude:
> "Design a database schema for an e-commerce platform with users, products, categories, orders, and order items"

### Output

Claude will generate:

1. **SQL DDL** - Complete CREATE TABLE statements
2. **ER Diagram** - Mermaid diagram showing relationships
3. **ORM Schema** - Prisma/TypeORM/Alembic migration files
4. **Index Recommendations** - Performance optimization suggestions
5. **Seed Data** - Optional sample data
6. **Documentation** - Markdown schema documentation

### Advanced Usage

Specify:

- **Database**: postgresql, mysql, sqlite
- **ORM**: prisma, typeorm, alembic, sequelize
- **Options**: indexes, timestamps, seed data, naming conventions

Example prompt:
> "Create PostgreSQL schema for:
> - Users table with email authentication
> - Posts with title, content, author
> - Tags with many-to-many relationship to posts
> - Generate Prisma schema with indexes
> - Include sample seed data"

## Best Practices

### Use Proper Data Types

Match column types to data requirements:

```sql
-- Good
email VARCHAR(255)
price DECIMAL(10, 2)
created_at TIMESTAMP

-- Bad
email TEXT
price FLOAT
created_at VARCHAR
```

### Add Constraints

Enforce data integrity at database level:

```sql
CHECK (price >= 0)
CHECK (email LIKE '%@%')
UNIQUE (email)
NOT NULL
```

### Index Strategically

Index foreign keys and frequently queried columns:

```sql
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_orders_created ON orders(created_at);
```

### Normalize Appropriately

Follow normalization principles:

- **1NF**: Atomic values, no repeating groups
- **2NF**: Remove partial dependencies
- **3NF**: Remove transitive dependencies

Consider denormalization for read-heavy workloads.

### Use Timestamps

Add created_at and updated_at to every table:

```sql
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

## Common Patterns

### One-to-Many

```sql
-- One user has many posts
users (id) <-->> posts (user_id)
```

### Many-to-Many

```sql
-- Students and courses (with junction table)
students (id) <<-->> enrollments <<-->> courses (id)
```

### Self-Referential

```sql
-- Comments with replies
comments (
  id,
  parent_comment_id REFERENCES comments(id)
)
```

### Polymorphic

```sql
-- Attachments for multiple entity types
attachments (
  id,
  attachable_type VARCHAR(50),
  attachable_id INTEGER
)
```

## ORM Frameworks

### Prisma

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[]
}

model Post {
  id      Int    @id @default(autoincrement())
  title   String
  userId  Int
  user    User   @relation(fields: [userId], references: [id])
}
```

### TypeORM

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}
```

### Alembic (SQLAlchemy)

```python
def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('email', sa.String(255), unique=True)
    )
```

## Quick Commands

### PostgreSQL

```bash
# Create database
createdb myapp

# Run SQL file
psql myapp < schema.sql

# Access database
psql myapp

# View tables
\dt

# Describe table
\d users
```

### Prisma

```bash
# Initialize Prisma
npx prisma init

# Generate client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database
npx prisma studio
```

### TypeORM

```bash
# Generate migration
npm run typeorm migration:generate -- -n CreateUsers

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Troubleshooting

### Foreign key errors

```sql
-- Ensure referenced table exists first
CREATE TABLE users (...);  -- Create parent
CREATE TABLE posts (...);  -- Then child with FK
```

### Duplicate column names

```sql
-- Use table prefixes or clear naming
user_email vs product_email
```

### Performance issues

```sql
-- Add indexes for:
- Foreign keys
- Columns in WHERE clauses
- Columns in JOIN conditions
- Columns in ORDER BY
```

### Migration conflicts

```bash
# Alembic: merge heads
alembic merge heads

# Prisma: reset database
npx prisma migrate reset
```

## Integration Ideas

### Automatic Migrations

```yaml
# .github/workflows/db.yml
- name: Run migrations
  run: |
    npx prisma migrate deploy
```

### Schema Versioning

```bash
# Track schema changes in git
git add schema.sql migrations/
git commit -m "feat: add comments table"
```

### Multi-Environment

```bash
# Development
DATABASE_URL=postgresql://localhost/myapp_dev

# Production
DATABASE_URL=postgresql://prod-server/myapp
```

### Backup and Restore

```bash
# Backup
pg_dump myapp > backup.sql

# Restore
psql myapp < backup.sql
```

## Supported Databases

| Database | Version | Features |
|----------|---------|----------|
| **PostgreSQL** | 12+ | JSONB, arrays, enums, full-text search |
| **MySQL** | 8.0+ | JSON, generated columns, CTEs |
| **SQLite** | 3.35+ | JSON, window functions, CTEs |

## Limitations

- Complex business logic needs application-level validation
- Performance tuning requires profiling actual queries
- Advanced database features need manual configuration
- Not designed for reverse engineering existing schemas

## Related Skills

- **api-documentation-generator**: Document database-backed APIs
- **docker-compose-builder**: Containerize databases
- **technical-documentation-writer**: Generate database docs

## Contributing

Found a bug or have a feature request? Open an issue or submit a pull request!

## License

Apache-2.0

---

**Part of [awesome-claude-skills](https://github.com/DellGibson/awesome-claude-skills)**
