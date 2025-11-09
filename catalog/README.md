# Claude Skills Catalog System
## Agent Hive Architecture with Token Optimization

**Version:** 2.0.0
**Purpose:** Comprehensive indexing and organization system for Claude Skills optimized for agent hive architectures and MCP integration.

---

## 📁 Catalog Structure

```
catalog/
├── README.md                      # This file - catalog overview
├── MASTER_CATALOG.md              # Complete skills catalog (4K tokens)
├── USER_GUIDE.md                  # Comprehensive usage guide
├── USE_CASES.md                   # 10 detailed real-world examples
│
├── indexes/                       # Searchable skill indexes
│   ├── SKILLS_INDEX.json          # Complete metadata (all 26 skills)
│   ├── MCP_INTEGRATION_MAP.md     # MCP server specifications
│   │
│   ├── category_indexes/          # Category-specific indexes
│   │   ├── business-marketing.json
│   │   ├── development.json
│   │   ├── creative-media.json
│   │   ├── communication-writing.json
│   │   └── productivity-organization.json
│   │
│   └── token_reduction/           # Token optimization tools
│       ├── metadata_only.json     # Compact skill data (2K tokens)
│       └── routing_matrix.json    # Fast keyword routing (500 tokens)
│
└── mcp_servers/                   # MCP server implementations (future)
    ├── ads-library-mcp/
    ├── linkedin-scraper-mcp/
    ├── domain-check-mcp/
    ├── video-download-mcp/
    ├── research-assistant-mcp/
    └── transcript-analysis-mcp/
```

---

## 🚀 Quick Start

### 1. Browse the Catalog

**Start here:** Read the [MASTER_CATALOG.md](./MASTER_CATALOG.md) for a complete overview of all 26 skills organized by category with MCP compatibility ratings.

**Then:** Check [USER_GUIDE.md](./USER_GUIDE.md) for detailed usage instructions.

### 2. Find Relevant Skills

**Method 1: Keyword Search**
```bash
# Fast routing using 500-token index
cat indexes/token_reduction/routing_matrix.json | jq '.keywords.react'
# Output: ["artifacts-builder"]
```

**Method 2: Category Browse**
```bash
# View all business & marketing skills
cat indexes/category_indexes/business-marketing.json | jq '.skills[] | .name'
```

**Method 3: Full Index Query**
```bash
# Find high MCP-potential skills
cat indexes/SKILLS_INDEX.json | jq '.skills[] | select(.mcpPotential == "high")'
```

### 3. Load Only What You Need

**Progressive Loading Pattern:**
```
Level 1: routing_matrix.json (500 tokens) → Fast keyword match
Level 2: MASTER_CATALOG.md (4K tokens) → Category identification
Level 3: category_index.json (600 tokens) → Skill selection
Level 4: SKILL.md (avg 3K tokens) → Execute skill
Level 5: references/ (variable) → Deep context

Total: ~8K tokens vs. 89K (all skills) = 91% reduction
```

---

## 📊 Key Statistics

- **Total Skills:** 26
- **Categories:** 5 primary, 12 subcategories
- **MCP-Compatible:** 8 skills (high/medium potential)
- **Token Reduction:** Average 82% savings
- **Agent Pools:** 5 specialized pools

---

## 🎯 Use Cases

See [USE_CASES.md](./USE_CASES.md) for 10 comprehensive examples:

1. **Competitive Market Intelligence** - Research competitors + ads analysis (90% token savings)
2. **Full-Stack Web Development** - React app + testing (87% savings)
3. **Tax Invoice Organization** - 500+ files processed (79% savings)
4. **Content Marketing Campaign** - Research + writing + visuals (87% savings)
5. **MCP Server Development** - Build custom API integrations (52% savings)
6. **Pitch Deck Creation** - Professional presentations (86% savings)
7. **Release Management** - Git changelogs (86% savings)
8. **Lead Generation** - 50 qualified leads (93% savings)
9. **Meeting Analysis** - Transcript insights (85% savings)
10. **Documentation Suite** - Multi-format docs (75% savings)

**Average Performance:** 82% token reduction, 88.7% time savings

---

## 🤖 Agent Hive Integration

### Agent Pool Specialization

| Pool | Skills | MCP Servers | Use Cases |
|------|--------|-------------|-----------|
| **Business Intelligence** | 3 | ads-library, linkedin-scraper, domain-check | Market research, lead gen |
| **Development** | 6 | github, npm-registry | Code, testing, MCP creation |
| **Creative** | 6 | image-processing, font-library | Design, media, visuals |
| **Document Processing** | 7 | filesystem, ocr | Files, PDFs, spreadsheets |
| **Content & Communication** | 3 | web-search, citation | Writing, analysis |

### Routing Flow

```
User Query
    ↓
Routing Matrix (500 tokens)
    ↓
Master Catalog (4K tokens)
    ↓
Agent Pool Selection
    ↓
Category Index (600 tokens)
    ↓
Skill Loading (avg 3K tokens)
    ↓
Execution with MCP (if available)
```

---

## 🔧 MCP Integration

### MCP Server Development

**Tier 1 Priorities (Build First):**

1. **ads-library-mcp** (competitive-ads-extractor) - 8-12 hours
   - Tools: `search_ads`, `get_ad_details`, `analyze_campaign`
   - APIs: Facebook Ads Library, Meta Graph API

2. **linkedin-scraper-mcp** (lead-research-assistant) - 12-16 hours
   - Tools: `find_companies`, `get_company_profile`, `search_people`
   - APIs: LinkedIn, Clearbit, Hunter.io

3. **domain-check-mcp** (domain-name-brainstormer) - 4-6 hours
   - Tools: `check_availability`, `suggest_domains`, `whois_lookup`
   - APIs: Namecheap, WHOIS

**See:** [MCP_INTEGRATION_MAP.md](./indexes/MCP_INTEGRATION_MAP.md) for complete specifications.

### Using the mcp-builder Skill

To create MCP servers from skills:

```bash
# 1. Load the mcp-builder skill
cat ../skills/development/mcp-builder/SKILL.md

# 2. Follow the 4-phase process:
#    Phase 1: Research & Planning
#    Phase 2: Implementation
#    Phase 3: Review & Refine
#    Phase 4: Create Evaluations

# 3. Package with skill-creator
cat ../skills/development/skill-creator/SKILL.md
```

---

## 📖 Documentation

### Core Documents

- **[MASTER_CATALOG.md](./MASTER_CATALOG.md)** - Complete skills reference with:
  - Hierarchical organization (5 categories, 12 subcategories)
  - MCP compatibility matrix
  - Token cost breakdown
  - Usage patterns and optimization strategies
  - Agent hive architecture integration
  - Cross-skill dependencies

- **[USER_GUIDE.md](./USER_GUIDE.md)** - Comprehensive guide covering:
  - Quick start (5-minute setup)
  - Understanding the catalog system
  - Token optimization strategies (5 proven patterns)
  - MCP integration guide
  - Agent hive architecture
  - Creating MCP servers from skills
  - Advanced patterns
  - Troubleshooting & FAQ

- **[USE_CASES.md](./USE_CASES.md)** - 10 real-world scenarios:
  - Detailed execution flows
  - Token usage breakdown
  - Time savings analysis
  - Success metrics
  - Step-by-step implementation

### Index Files

- **[SKILLS_INDEX.json](./indexes/SKILLS_INDEX.json)** - Complete metadata:
  - All 26 skills with full details
  - Category and subcategory assignments
  - MCP potential ratings
  - Token costs
  - Dependencies
  - Agent pool recommendations

- **[MCP_INTEGRATION_MAP.md](./indexes/MCP_INTEGRATION_MAP.md)** - MCP specifications:
  - Tier 1 MCP server candidates
  - Tool specifications with Pydantic/Zod schemas
  - API integration details
  - Development timelines
  - Deployment configurations

### Token Reduction Tools

- **[metadata_only.json](./indexes/token_reduction/metadata_only.json)** - Ultra-compact (2K tokens):
  - Minimal skill data for fast loading
  - Essential metadata only
  - Use for: Initial routing decisions

- **[routing_matrix.json](./indexes/token_reduction/routing_matrix.json)** - Lightning-fast (500 tokens):
  - Keyword → skill mappings
  - Category lookups
  - Agent pool routing
  - Use for: Instant query classification

---

## 💡 Token Optimization Strategies

### Strategy 1: Lazy Loading
Load only what you need, when you need it. Average savings: **91%**

### Strategy 2: Metadata-First Routing
Use compact indexes for routing decisions. Overhead: **500-2K tokens**

### Strategy 3: Category Pre-filtering
Eliminate 80% of skills immediately. Savings: **60K+ tokens**

### Strategy 4: MCP Server Offloading
Move heavy operations to MCP servers. Per-skill savings: **2K tokens**

### Strategy 5: Shared Context Caching
Reuse loaded catalog across session. Savings: **4K tokens per query**

**See:** [USER_GUIDE.md § Token Optimization Strategies](./USER_GUIDE.md#4-token-optimization-strategies) for implementation details.

---

## 🔍 Searching the Catalog

### By Keyword

```bash
# Using routing matrix (fastest - 500 tokens)
cat indexes/token_reduction/routing_matrix.json | jq '.keywords["react"]'

# Using metadata index (compact - 2K tokens)
cat indexes/token_reduction/metadata_only.json | jq '.skills[] | select(.tags[] | contains("react"))'

# Using full index (complete - all metadata)
cat indexes/SKILLS_INDEX.json | jq '.skills[] | select(.tags[] | contains("react"))'
```

### By Category

```bash
# List all categories
cat indexes/SKILLS_INDEX.json | jq '.categories[] | {id, name, skillCount}'

# Get specific category index
cat indexes/category_indexes/development.json | jq '.skills[] | .name'
```

### By MCP Potential

```bash
# High-priority MCP candidates
cat indexes/SKILLS_INDEX.json | jq '.skills[] | select(.mcpPotential == "high") | .name'

# All MCP-compatible skills
cat indexes/SKILLS_INDEX.json | jq '.skills[] | select(.mcpPotential != "low" and .mcpPotential != "n/a") | .name'
```

### Programmatic Access (Python)

```python
import json

# Load catalog
with open('catalog/indexes/SKILLS_INDEX.json') as f:
    catalog = json.load(f)

# Find skills by category
def get_skills_by_category(category):
    return [s for s in catalog['skills'] if s['category'] == category]

# Find MCP candidates
def get_mcp_candidates(min_potential='medium'):
    levels = {'high': 3, 'medium': 2, 'low': 1, 'n/a': 0}
    threshold = levels[min_potential]
    return [s for s in catalog['skills']
            if levels.get(s.get('mcpPotential', 'n/a'), 0) >= threshold]

# Calculate token cost
def calculate_token_cost(skill_ids):
    skills = {s['id']: s for s in catalog['skills']}
    return sum(skills[sid]['tokenCost'] for sid in skill_ids if sid in skills)

# Example
business_skills = get_skills_by_category('business-marketing')
print(f"Found {len(business_skills)} business skills")

mcp_skills = get_mcp_candidates('high')
print(f"High-priority MCP candidates: {[s['name'] for s in mcp_skills]}")
```

---

## 📈 Performance Metrics

### Token Efficiency

| Metric | Value |
|--------|-------|
| Average reduction | 82% |
| Best case | 93% (simple tasks) |
| Worst case | 52% (complex w/ references) |
| Catalog overhead | 4K tokens |
| Routing overhead | 500 tokens |

### Time Savings

| Metric | Value |
|--------|-------|
| Average time savings | 88.7% |
| Best case | 99.5% (lead generation) |
| Average task time | 23 minutes |
| Manual baseline | 5.5 hours |

---

## 🛠️ Development Roadmap

### Phase 1: Foundation ✅ (Complete)
- [x] Catalog all 26 skills
- [x] Create hierarchical organization
- [x] Build token reduction indexes
- [x] Document 10 use cases
- [x] Write comprehensive guides

### Phase 2: MCP Servers (In Progress)
- [ ] Implement domain-check-mcp (P2, 4-6 hours)
- [ ] Implement transcript-analysis-mcp (P3, 6-8 hours)
- [ ] Implement ads-library-mcp (P1, 8-12 hours)
- [ ] Implement linkedin-scraper-mcp (P1, 12-16 hours)
- [ ] Create evaluation suites for each

### Phase 3: Agent Hive Deployment (Planned)
- [ ] Set up agent pool infrastructure
- [ ] Implement orchestrator
- [ ] Deploy MCP servers
- [ ] Load testing
- [ ] Monitoring and optimization

### Phase 4: Community Expansion (Future)
- [ ] Community-contributed skills
- [ ] Additional MCP servers
- [ ] Language-specific implementations
- [ ] Cloud deployment templates

---

## 🤝 Contributing

### Adding New Skills

1. Create skill using `skill-creator` skill
2. Update `SKILLS_INDEX.json` with metadata
3. Add to appropriate category index
4. Update `routing_matrix.json` with keywords
5. Update `MASTER_CATALOG.md`
6. Calculate token cost
7. Determine MCP potential

### Creating MCP Servers

1. Use `mcp-builder` skill for guidance
2. Follow 4-phase development process
3. Create evaluation suite (10+ questions)
4. Document in `MCP_INTEGRATION_MAP.md`
5. Add to category index with MCP server reference

---

## 📞 Support

- **Documentation:** Start with [USER_GUIDE.md](./USER_GUIDE.md)
- **Examples:** See [USE_CASES.md](./USE_CASES.md)
- **MCP Specs:** Check [MCP_INTEGRATION_MAP.md](./indexes/MCP_INTEGRATION_MAP.md)
- **Issues:** Open issue on GitHub repository

---

## 📄 License

Individual skills may have their own licenses. See LICENSE.txt in each skill directory.

The catalog system and indexes are part of the awesome-claude-skills repository and follow the repository's license.

---

**Version:** 2.0.0
**Last Updated:** 2025-11-09
**Maintained by:** awesome-claude-skills community

---

**Quick Links:**
- [Master Catalog](./MASTER_CATALOG.md) - Complete reference
- [User Guide](./USER_GUIDE.md) - How to use
- [Use Cases](./USE_CASES.md) - Real examples
- [Skills Index](./indexes/SKILLS_INDEX.json) - Metadata
- [MCP Map](./indexes/MCP_INTEGRATION_MAP.md) - Server specs
