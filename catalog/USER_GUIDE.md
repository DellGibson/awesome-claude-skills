# Agent Hive User Guide
## Complete Guide to Claude Skills Catalog & MCP Integration

**Version:** 2.0.0
**Last Updated:** 2025-11-09
**Audience:** Developers, AI Engineers, Agent Operators

---

## 📖 Table of Contents

1. [Introduction](#introduction)
2. [Quick Start](#quick-start)
3. [Understanding the Catalog System](#understanding-the-catalog-system)
4. [Token Optimization Strategies](#token-optimization-strategies)
5. [MCP Integration Guide](#mcp-integration-guide)
6. [Agent Hive Architecture](#agent-hive-architecture)
7. [Using the Skills Index](#using-the-skills-index)
8. [Creating MCP Servers from Skills](#creating-mcp-servers-from-skills)
9. [Advanced Patterns](#advanced-patterns)
10. [Troubleshooting](#troubleshooting)
11. [FAQ](#faq)

---

## 1. Introduction

### What is the Claude Skills Catalog?

The Claude Skills Catalog is a comprehensive indexing and organization system for Claude Skills, designed specifically for **agent hive architectures** and **token-optimized operations**. It provides:

- **Hierarchical skill organization** - 5 categories, 12 subcategories, 26 skills
- **MCP integration mapping** - Identify skills that can become MCP servers
- **Progressive disclosure** - Load only what you need, when you need it
- **Token reduction** - Average 82% reduction vs. loading all skills
- **Agent pool routing** - Intelligent task distribution

### What is MCP (Model Context Protocol)?

**Model Context Protocol (MCP)** is a standardized protocol that enables LLMs to interact with external services through well-defined tools. Think of it as an API for AI agents.

**Key Concepts:**

- **MCP Server**: A service that provides tools (functions) to LLMs
- **MCP Client**: An LLM or agent that uses these tools
- **Tools**: Specific operations (e.g., `search_database`, `send_email`)
- **Resources**: Files, data, or context the server can provide

**Why MCP Matters for Agent Hives:**

- **Standardization**: One protocol for all external integrations
- **Scalability**: Add new capabilities without changing agent code
- **Security**: Controlled access to external services
- **Modularity**: Mix and match MCP servers as needed

### Who Should Use This System?

- **AI Engineers** building multi-agent systems
- **Developers** creating MCP servers from Claude Skills
- **Operations Teams** deploying agent hives at scale
- **Researchers** optimizing LLM token usage

---

## 2. Quick Start

### 5-Minute Setup

1. **Clone the repository** (if not already done)
   ```bash
   git clone https://github.com/DellGibson/awesome-claude-skills.git
   cd awesome-claude-skills
   ```

2. **Explore the catalog structure**
   ```bash
   cd catalog/
   ls
   # MASTER_CATALOG.md - Main catalog (start here!)
   # USER_GUIDE.md - This file
   # USE_CASES.md - 10 example use cases
   # indexes/ - JSON and specialized indexes
   ```

3. **Read the Master Catalog**
   ```bash
   cat MASTER_CATALOG.md
   # 4K tokens - comprehensive overview
   ```

4. **Browse the Skills Index (JSON)**
   ```bash
   cat indexes/SKILLS_INDEX.json | jq '.skills[] | {id, category, mcpPotential}'
   # See all skills with MCP compatibility
   ```

5. **Review MCP Integration Map**
   ```bash
   cat indexes/MCP_INTEGRATION_MAP.md
   # Complete guide to building MCP servers
   ```

### Your First Agent Hive Query

**Scenario:** You want to research competitors' ads

**Step 1: Query the catalog**
```
User: "I need to analyze competitor advertising"
```

**Step 2: Catalog lookup** (4K tokens)
- Search for: "advertising", "competitive", "ads"
- Match found: Category = `business-marketing`
- Skill = `competitive-ads-extractor`

**Step 3: Load skill metadata** (100 tokens)
```json
{
  "id": "competitive-ads-extractor",
  "category": "business-marketing",
  "description": "Extracts and analyzes competitors' ads...",
  "mcpPotential": "high"
}
```

**Step 4: Confirm match & load full skill** (2.5K tokens)
```
Load: competitive-ads-extractor/SKILL.md
Total: 4K + 100 + 2.5K = 6.6K tokens
Savings: 89K - 6.6K = 82.4K tokens (93% reduction!)
```

**Step 5: Execute skill**
- MCP Server: `ads-library-mcp` (if available)
- Or: Manual execution via skill instructions

---

## 3. Understanding the Catalog System

### Directory Structure

```
awesome-claude-skills/
├── catalog/                          # NEW: Catalog system (this is what we created)
│   ├── MASTER_CATALOG.md             # Main catalog (4K tokens)
│   ├── USER_GUIDE.md                 # This guide
│   ├── USE_CASES.md                  # 10 detailed use cases
│   ├── indexes/                      # Searchable indexes
│   │   ├── SKILLS_INDEX.json         # Complete skill metadata (JSON)
│   │   ├── MCP_INTEGRATION_MAP.md    # MCP server specifications
│   │   ├── category_indexes/         # Per-category quick refs
│   │   │   ├── business-marketing.json
│   │   │   ├── development.json
│   │   │   ├── creative-media.json
│   │   │   ├── communication-writing.json
│   │   │   └── productivity-organization.json
│   │   └── token_reduction/          # Token optimization tools
│   │       ├── metadata_only.json    # Ultra-compact (names + descriptions only)
│   │       └── routing_matrix.json   # Fast task → skill mapping
│   └── mcp_servers/                  # MCP server implementations (future)
│       ├── ads-library-mcp/
│       ├── linkedin-scraper-mcp/
│       └── ...
├── skills/                           # EXISTING: All 26 Claude Skills
│   ├── business-marketing/           # Category folders (we'll create)
│   │   ├── competitive-ads-extractor/
│   │   ├── lead-research-assistant/
│   │   ├── brand-guidelines/
│   │   ├── domain-name-brainstormer/
│   │   └── internal-comms/
│   ├── development/
│   │   ├── mcp-builder/
│   │   ├── skill-creator/
│   │   ├── artifacts-builder/
│   │   ├── changelog-generator/
│   │   ├── webapp-testing/
│   │   └── template-skill/
│   ├── creative-media/
│   │   ├── canvas-design/
│   │   ├── algorithmic-art/
│   │   ├── theme-factory/
│   │   ├── image-enhancer/
│   │   ├── video-downloader/
│   │   └── slack-gif-creator/
│   ├── communication-writing/
│   │   ├── content-research-writer/
│   │   └── meeting-insights-analyzer/
│   └── productivity-organization/
│       ├── file-organizer/
│       ├── invoice-organizer/
│       ├── raffle-winner-picker/
│       └── document-skills/
│           ├── docx/
│           ├── pdf/
│           ├── pptx/
│           └── xlsx/
├── .claude-plugin/
│   └── marketplace.json              # EXISTING: Marketplace config
└── README.md                         # EXISTING: Repository README
```

### The 5-Tier Loading System

This catalog implements a **progressive disclosure** pattern with 5 tiers:

#### Tier 0: Routing Matrix (Ultra-Fast)
- **File:** `catalog/indexes/token_reduction/routing_matrix.json`
- **Size:** ~500 tokens
- **Purpose:** Instant keyword → skill mapping
- **When to use:** Initial request routing
- **Example:**
  ```json
  {
    "keywords": {
      "competitor": ["competitive-ads-extractor", "lead-research-assistant"],
      "react": ["artifacts-builder"],
      "pdf": ["document-skills-pdf"]
    }
  }
  ```

#### Tier 1: Catalog Index
- **File:** `catalog/MASTER_CATALOG.md`
- **Size:** 4K tokens
- **Purpose:** High-level overview of all skills, categories, MCP mapping
- **When to use:** Understanding the ecosystem, category selection
- **Contains:** Skill summaries, token costs, MCP potential

#### Tier 2: Category Index
- **Files:** `catalog/indexes/category_indexes/*.json`
- **Size:** 500-800 tokens each
- **Purpose:** Detailed view of skills within a category
- **When to use:** After identifying relevant category
- **Contains:** Full skill metadata, dependencies, use cases

#### Tier 3: Skill Metadata
- **Source:** Frontmatter from `SKILL.md` files
- **Size:** 50-100 tokens per skill
- **Purpose:** Confirm skill relevance before loading full instructions
- **When to use:** Final confirmation before loading skill
- **Contains:** Name, description, license

#### Tier 4: Full Skill
- **File:** Complete `SKILL.md` file
- **Size:** 1.2K - 8.5K tokens
- **Purpose:** Complete skill instructions
- **When to use:** Executing the skill
- **Contains:** Full instructions, examples, usage patterns

#### Tier 5: Skill Resources
- **Files:** `references/`, `scripts/`, `assets/`
- **Size:** Variable (0 - 102K tokens)
- **Purpose:** Supporting materials loaded on-demand
- **When to use:** As needed during skill execution
- **Contains:** Reference docs, executable scripts, templates

### Token Optimization Flow

```
User Query
    │
    ▼
Tier 0: Routing Matrix (500 tokens)
    │ Quick keyword match
    ▼
Tier 1: Catalog Index (4K tokens)
    │ Category identification
    ▼
Tier 2: Category Index (600 tokens)
    │ Skill selection
    ▼
Tier 3: Skill Metadata (100 tokens)
    │ Relevance confirmation
    ▼
Tier 4: Full Skill (avg 3K tokens)
    │ Execution
    ▼
Tier 5: Resources (as needed)
    │ Deep context
    ▼
Result

TOTAL: ~8.2K tokens average
vs. Loading all skills: 89K tokens
SAVINGS: 91% reduction
```

---

## 4. Token Optimization Strategies

### Strategy 1: Lazy Loading

**Principle:** Load only what you need, when you need it.

**Implementation:**
```python
# Bad: Load all skills upfront
all_skills = load_all_skills()  # 89K tokens!

# Good: Progressive loading
catalog = load_catalog_index()  # 4K tokens
category = identify_category(user_query, catalog)  # Already in context
skills = load_category_index(category)  # +600 tokens
selected_skill = select_skill(user_query, skills)  # Logic, no tokens
skill_content = load_skill(selected_skill)  # +3K tokens
# Total: 7.6K tokens (91% savings)
```

### Strategy 2: Metadata-First Routing

**Principle:** Use compact metadata for routing decisions.

**Implementation:**
```json
// metadata_only.json - 2K tokens for all 26 skills
{
  "skills": [
    {
      "id": "competitive-ads-extractor",
      "cat": "business-marketing",
      "desc": "Extracts and analyzes competitors' ads...",
      "tags": ["ads", "competitive", "facebook", "meta"],
      "mcp": "high",
      "tokens": 2500
    },
    // ... 25 more skills
  ]
}
```

Load this 2K file instead of 89K full skills for routing.

### Strategy 3: Category-Based Pre-filtering

**Principle:** Eliminate 80% of skills immediately by category.

**Example:**
- User request: "Build a React app"
- Category match: `development` (6 skills)
- Skills eliminated: 20 skills from other categories
- Load only: development category index (600 tokens)
- Savings: Don't load 20 skills × 3K avg = 60K tokens

### Strategy 4: MCP Server Offloading

**Principle:** Move heavy operations to MCP servers, keep skill instructions light.

**Before (Skill-only):**
```markdown
# competitive-ads-extractor SKILL.md

## Instructions
1. Navigate to Facebook Ad Library
2. Search for advertiser
3. Parse HTML with BeautifulSoup
4. Extract ad creative
5. Analyze messaging
...
(2.5K tokens of detailed scraping instructions)
```

**After (With MCP):**
```markdown
# competitive-ads-extractor SKILL.md

## Instructions
Use the `ads-library-mcp` server:

1. Call `ads_library.search_ads(advertiser="Notion")`
2. Analyze results
3. Generate insights

(500 tokens of high-level instructions)
```

**Token Savings:** 2K tokens per skill execution

### Strategy 5: Shared Context Caching

**Principle:** Reuse loaded catalog across multiple queries in a session.

**Implementation:**
```python
# Session start
session_cache = {
    'catalog': load_catalog_index(),  # 4K tokens (loaded once)
    'categories': {}
}

# Query 1: "Analyze competitor ads"
# Uses cached catalog (0 additional tokens)

# Query 2: "Find me 50 leads in fintech"
# Uses cached catalog (0 additional tokens)
# Same category (business-marketing) - reuse if cached

# Session savings: Load catalog once instead of per-query
```

---

## 5. MCP Integration Guide

### What Skills Can Become MCP Servers?

Reference: `catalog/indexes/MCP_INTEGRATION_MAP.md` for complete specifications.

**High Priority (Tier 1):**
1. `competitive-ads-extractor` → `ads-library-mcp`
2. `lead-research-assistant` → `linkedin-scraper-mcp`
3. `domain-name-brainstormer` → `domain-check-mcp`
4. `video-downloader` → `video-download-mcp`
5. `content-research-writer` → `research-assistant-mcp`
6. `meeting-insights-analyzer` → `transcript-analysis-mcp`

**Why these?**
- External API integration
- Reusable tools across multiple contexts
- Stateful operations (databases, API keys)

### Converting a Skill to an MCP Server

**Step-by-Step Guide:**

#### Example: `domain-name-brainstormer` → `domain-check-mcp`

**Step 1: Use mcp-builder skill**
```bash
# Load the mcp-builder skill
cat skills/development/mcp-builder/SKILL.md
```

**Step 2: Plan the tools** (from skill analysis)

Original skill operations:
- Generate domain suggestions
- Check availability
- Get pricing
- WHOIS lookup

Convert to MCP tools:
- `suggest_domains(keywords, style, max_suggestions)`
- `check_availability(domain_base, tlds)`
- `get_pricing(domains)`
- `whois_lookup(domain)`

**Step 3: Implement using mcp-builder guidance**

```python
# catalog/mcp_servers/domain-check-mcp/server.py

from mcp import FastMCP
from pydantic import BaseModel, Field
from typing import List, Literal

mcp = FastMCP("domain-check")

class DomainCheck(BaseModel):
    domain_base: str = Field(description="Domain without TLD (e.g., 'mycompany')")
    tlds: List[str] = Field(
        default=[".com", ".io", ".dev", ".ai"],
        description="List of TLDs to check"
    )
    include_similar: bool = Field(default=True, description="Include similar available domains")

@mcp.tool(
    description="Check domain availability across multiple TLDs",
    readOnlyHint=True
)
async def check_availability(params: DomainCheck) -> str:
    """
    Check if domains are available for registration.

    Args:
        domain_base: Base domain name without TLD
        tlds: List of TLDs to check (.com, .io, etc.)
        include_similar: Include alternative suggestions

    Returns:
        Formatted availability report with pricing and alternatives

    Example:
        check_availability(domain_base="mycompany", tlds=[".com", ".io"])
    """
    results = []

    for tld in params.tlds:
        domain = f"{params.domain_base}{tld}"
        # Use domain registrar API
        is_available = await check_domain_api(domain)
        price = await get_domain_price(domain) if is_available else None

        results.append({
            "domain": domain,
            "available": is_available,
            "price": price
        })

    # Format as markdown
    return format_availability_report(results, include_similar=params.include_similar)

# ... 3 more tools (suggest_domains, get_pricing, whois_lookup)
```

**Step 4: Create evaluations** (per mcp-builder Phase 4)

```xml
<!-- catalog/mcp_servers/domain-check-mcp/evaluation/questions.xml -->
<evaluation>
  <qa_pair>
    <question>Check if "anthropic" is available as .com, .ai, and .dev domains</question>
    <answer>anthropic.com: Not available, anthropic.ai: Not available, anthropic.dev: Available ($12.99/year)</answer>
  </qa_pair>
  <!-- 9 more questions -->
</evaluation>
```

**Step 5: Package and deploy**

```json
// Add to claude_desktop_config.json
{
  "mcpServers": {
    "domain-check": {
      "command": "python",
      "args": ["-m", "catalog.mcp_servers.domain_check"],
      "env": {
        "NAMECHEAP_API_KEY": "${NAMECHEAP_API_KEY}"
      }
    }
  }
}
```

**Result:**
- MCP server with 4 tools
- Used by any Claude agent with MCP access
- Original skill (`domain-name-brainstormer`) can be simplified to just call the MCP server

### MCP vs. Pure Skills: When to Use Which?

| Use MCP Server When... | Use Pure Skill When... |
|------------------------|------------------------|
| Requires external API access | Pure instruction-based (no APIs) |
| Stateful operations (databases) | Stateless transformations |
| Reused across multiple skills | Skill-specific logic |
| Security-sensitive (API keys) | No sensitive data |
| Performance-critical (caching) | One-off operations |

**Examples:**

| Skill | MCP Server? | Reason |
|-------|-------------|--------|
| competitive-ads-extractor | ✅ Yes | External API (Facebook Ads Library) |
| brand-guidelines | ❌ No | Pure instructions (brand colors, fonts) |
| invoice-organizer | ⚠️ Maybe | Benefits from OCR MCP, but can work standalone |
| mcp-builder | ❌ No | Meta-skill for creating servers |

---

## 6. Agent Hive Architecture

### What is an Agent Hive?

An **Agent Hive** is a multi-agent system where specialized agents are organized into **pools** based on their capabilities. Instead of one general-purpose agent, you have:

- **Business Intelligence Agents** - Market research, competitors, leads
- **Development Agents** - Code, testing, MCP servers
- **Creative Agents** - Design, media, content
- **Document Processing Agents** - Files, PDFs, spreadsheets
- **Content & Communication Agents** - Writing, analysis

**Benefits:**
- **Specialization**: Each pool has relevant skills pre-loaded
- **Parallelization**: Multiple agents work simultaneously
- **Token Efficiency**: Load only category-relevant skills
- **Scalability**: Add more agents to busy pools

### Hive Architecture Diagram

```
                    ┌─────────────────────┐
                    │  Orchestrator       │
                    │  (Task Router)      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         ┌──────▼──────┐ ┌────▼─────┐ ┌─────▼──────┐
         │  Business   │ │Development│ │  Creative  │
         │   Intel     │ │   Pool    │ │   Pool     │
         │   Pool      │ │           │ │            │
         │             │ │           │ │            │
         │ Agents: 5   │ │ Agents: 8 │ │ Agents: 4  │
         └──────┬──────┘ └────┬──────┘ └─────┬──────┘
                │             │              │
                │             │              │
        ┌───────▼─────────────▼──────────────▼───────┐
        │         Shared MCP Server Layer            │
        │                                            │
        │  ads-library-mcp | git-mcp                │
        │  linkedin-mcp    | image-processing-mcp   │
        │  domain-check    | filesystem-mcp         │
        └────────────────────────────────────────────┘
```

### Setting Up an Agent Hive

**1. Define Agent Pools** (from SKILLS_INDEX.json)

```json
{
  "agentPools": [
    {
      "id": "business-intelligence",
      "skills": [
        "competitive-ads-extractor",
        "lead-research-assistant",
        "domain-name-brainstormer"
      ],
      "mcpServers": [
        "ads-library-mcp",
        "linkedin-scraper-mcp",
        "domain-check-mcp"
      ]
    },
    // ... 4 more pools
  ]
}
```

**2. Configure Agent Pool Settings**

```python
# agent_hive_config.py

AGENT_POOLS = {
    'business-intelligence': {
        'agents': 5,  # Number of concurrent agents
        'preload_skills': True,  # Preload skills on pool init
        'skills': [
            'competitive-ads-extractor',
            'lead-research-assistant',
            'domain-name-brainstormer'
        ],
        'mcp_servers': [
            'ads-library-mcp',
            'linkedin-scraper-mcp',
            'domain-check-mcp'
        ],
        'token_budget': 50000,  # Max tokens per agent
    },
    'development': {
        'agents': 8,
        'preload_skills': True,
        'skills': [
            'mcp-builder',
            'skill-creator',
            'artifacts-builder',
            'changelog-generator',
            'webapp-testing',
            'template-skill'
        ],
        'mcp_servers': ['github-mcp', 'npm-registry-mcp'],
        'token_budget': 100000,
    },
    // ... more pools
}
```

**3. Implement Orchestrator**

```python
# orchestrator.py

class AgentHiveOrchestrator:
    def __init__(self, catalog_path='catalog/'):
        self.catalog = self.load_catalog(catalog_path)
        self.pools = self.initialize_pools()

    def route_task(self, user_query: str) -> str:
        """Route task to appropriate agent pool"""

        # Step 1: Quick keyword matching (Tier 0)
        routing_matrix = self.load_routing_matrix()
        potential_pools = self.match_keywords(user_query, routing_matrix)

        # Step 2: Category classification (Tier 1)
        category = self.classify_category(user_query, self.catalog)

        # Step 3: Select pool
        pool_id = CATEGORY_TO_POOL[category]
        pool = self.pools[pool_id]

        # Step 4: Assign to available agent in pool
        agent = pool.get_available_agent()

        # Step 5: Execute with progressive skill loading
        result = agent.execute(user_query, progressive_loading=True)

        return result

    def classify_category(self, query: str, catalog: dict) -> str:
        """Classify query into one of 5 categories"""

        # Use LLM with catalog index (4K tokens)
        prompt = f"""
        Given this query: "{query}"

        And this catalog:
        {catalog['MASTER_CATALOG.md']}

        Which category matches best?
        Options: business-marketing, development, creative-media, communication-writing, productivity-organization
        """

        category = llm_call(prompt)
        return category
```

**4. Agent Pool Implementation**

```python
# agent_pool.py

class AgentPool:
    def __init__(self, pool_id: str, config: dict, catalog: dict):
        self.pool_id = pool_id
        self.config = config
        self.catalog = catalog
        self.agents = self.create_agents()

        # Preload skills if configured
        if config['preload_skills']:
            self.preload_skills()

    def preload_skills(self):
        """Load all pool skills into shared context"""
        self.skill_context = {}

        for skill_id in self.config['skills']:
            skill_path = self.catalog['skills'][skill_id]['path']
            skill_content = load_skill(skill_path)
            self.skill_context[skill_id] = skill_content

        print(f"Pool {self.pool_id}: Preloaded {len(self.skill_context)} skills")

    def get_available_agent(self) -> Agent:
        """Get least busy agent from pool"""
        return min(self.agents, key=lambda a: a.current_load)

    def create_agents(self) -> List[Agent]:
        """Create configured number of agents"""
        agents = []
        for i in range(self.config['agents']):
            agent = Agent(
                id=f"{self.pool_id}-agent-{i}",
                pool=self,
                mcp_servers=self.config['mcp_servers'],
                token_budget=self.config['token_budget']
            )
            agents.append(agent)
        return agents
```

### Routing Examples

**Query 1:** "Analyze my competitor's Facebook ads"

```
Orchestrator
├─ Keyword match: ["competitor", "ads", "facebook"]
├─ Matched skills: ["competitive-ads-extractor"]
├─ Category: business-marketing
├─ Route to: Business Intelligence Pool
└─ Agent: bi-agent-2 (least busy)
    ├─ Load: competitive-ads-extractor (2.5K tokens)
    ├─ MCP: ads-library-mcp
    └─ Execute
```

**Query 2:** "Build me a React todo app"

```
Orchestrator
├─ Keyword match: ["build", "react", "app"]
├─ Matched skills: ["artifacts-builder"]
├─ Category: development
├─ Route to: Development Pool
└─ Agent: dev-agent-5
    ├─ Load: artifacts-builder (4.8K tokens)
    ├─ Load: theme-factory (optional, 2.4K tokens)
    ├─ MCP: None needed
    └─ Execute
```

---

## 7. Using the Skills Index

### SKILLS_INDEX.json Structure

```json
{
  "version": "2.0.0",
  "totalSkills": 26,
  "skills": [
    {
      "id": "skill-identifier",
      "name": "Human Readable Name",
      "category": "primary-category",
      "subcategory": "subcategory",
      "description": "What this skill does",
      "path": "./relative/path/to/skill",
      "tokenCost": 2500,
      "mcpPotential": "high|medium|low|n/a",
      "mcpServerType": "data-collection|analysis|...|null",
      "externalAPIs": ["API1", "API2"],
      "priority": "P0|P1|P2|P3|P4",
      "tags": ["tag1", "tag2"],
      "useCases": ["use-case-1", "use-case-2"],
      "dependencies": ["other-skill-id"],
      "complexity": "simple|moderate|complex",
      "agentPoolRecommendation": "pool-id"
    }
  ],
  "categories": [...],
  "agentPools": [...]
}
```

### Querying the Index

**Find all high-MCP-potential skills:**

```bash
cat catalog/indexes/SKILLS_INDEX.json | jq '.skills[] | select(.mcpPotential == "high")'
```

**Find skills in a category:**

```bash
cat catalog/indexes/SKILLS_INDEX.json | jq '.skills[] | select(.category == "development")'
```

**Find skills by tag:**

```bash
cat catalog/indexes/SKILLS_INDEX.json | jq '.skills[] | select(.tags[] | contains("api"))'
```

**Get total token cost for a pool:**

```bash
cat catalog/indexes/SKILLS_INDEX.json | jq '
  [.skills[] | select(.agentPoolRecommendation == "business-intelligence") | .tokenCost] | add
'
```

### Programmatic Access (Python)

```python
import json

# Load index
with open('catalog/indexes/SKILLS_INDEX.json') as f:
    index = json.load(f)

# Find skills by category
def get_skills_by_category(category: str):
    return [s for s in index['skills'] if s['category'] == category]

# Find skills by MCP potential
def get_mcp_candidates(min_potential='medium'):
    potential_order = {'high': 3, 'medium': 2, 'low': 1, 'n/a': 0}
    threshold = potential_order[min_potential]

    return [
        s for s in index['skills']
        if potential_order.get(s.get('mcpPotential', 'n/a'), 0) >= threshold
    ]

# Get agent pool configuration
def get_pool_config(pool_id: str):
    pools = index['agentPools']
    return next(p for p in pools if p['id'] == pool_id)

# Calculate token budget for query
def estimate_token_cost(skill_ids: list[str]) -> int:
    skills = {s['id']: s for s in index['skills']}
    return sum(skills[sid]['tokenCost'] for sid in skill_ids if sid in skills)

# Example usage
business_skills = get_skills_by_category('business-marketing')
print(f"Business & Marketing: {len(business_skills)} skills")

mcp_candidates = get_mcp_candidates('high')
print(f"High MCP potential: {len(mcp_candidates)} skills")

token_cost = estimate_token_cost(['competitive-ads-extractor', 'lead-research-assistant'])
print(f"Token cost: {token_cost} tokens")
```

---

## 8. Creating MCP Servers from Skills

See detailed guide in `catalog/indexes/MCP_INTEGRATION_MAP.md`.

**Quick Reference:**

### Development Timeline

| MCP Server | Development Time | Complexity | External APIs |
|------------|-----------------|------------|---------------|
| domain-check-mcp | 4-6 hours | Low | Namecheap, WHOIS |
| transcript-analysis-mcp | 6-8 hours | Medium | None |
| ads-library-mcp | 8-12 hours | High | Facebook Ads API |
| linkedin-scraper-mcp | 12-16 hours | High | LinkedIn, Clearbit |

### Deployment Checklist

- [ ] Implement all tools with Pydantic/Zod validation
- [ ] Add comprehensive docstrings
- [ ] Create 10+ evaluation questions
- [ ] Test with evaluation harness
- [ ] Configure environment variables
- [ ] Add to `claude_desktop_config.json`
- [ ] Document in MCP_INTEGRATION_MAP.md
- [ ] Update SKILLS_INDEX.json with MCP server reference

---

## 9. Advanced Patterns

### Pattern 1: Cascading Skill Loading

Load skills on-demand as needed during execution.

```python
class CascadingSkillLoader:
    def __init__(self):
        self.loaded_skills = {}
        self.catalog = load_catalog_index()  # 4K tokens, loaded once

    def load_skill_if_needed(self, skill_id: str):
        if skill_id not in self.loaded_skills:
            skill = load_skill(skill_id)
            self.loaded_skills[skill_id] = skill
            print(f"Loaded {skill_id} ({skill['tokenCost']} tokens)")
        return self.loaded_skills[skill_id]

    def execute_with_dependencies(self, primary_skill_id: str):
        # Load primary skill
        skill = self.load_skill_if_needed(primary_skill_id)

        # Check dependencies
        for dep_id in skill.get('dependencies', []):
            self.load_skill_if_needed(dep_id)

        # Execute
        return execute_skill(skill)

# Example
loader = CascadingSkillLoader()
result = loader.execute_with_dependencies('artifacts-builder')
# Loads: artifacts-builder (4.8K)
# Then loads dependencies: theme-factory (2.4K) if used
```

### Pattern 2: Multi-Pool Coordination

Some tasks require multiple agent pools working together.

```python
class MultiPoolCoordinator:
    def __init__(self, orchestrator):
        self.orchestrator = orchestrator

    def coordinate_task(self, task: ComplexTask):
        """Execute task across multiple pools"""

        # Example: "Create marketing campaign"
        # Requires: research (business) + content (communication) + visuals (creative)

        # Phase 1: Research (Business Intel Pool)
        research_task = task.extract_phase('research')
        research_agent = self.orchestrator.pools['business-intelligence'].get_agent()
        research_results = research_agent.execute(research_task)

        # Phase 2: Content Creation (Content Pool)
        content_task = task.extract_phase('content', context=research_results)
        content_agent = self.orchestrator.pools['content-communication'].get_agent()
        content_results = content_agent.execute(content_task)

        # Phase 3: Visual Design (Creative Pool)
        design_task = task.extract_phase('design', context=content_results)
        design_agent = self.orchestrator.pools['creative'].get_agent()
        design_results = design_agent.execute(design_task)

        # Synthesize
        return self.synthesize_results([research_results, content_results, design_results])
```

### Pattern 3: Skill Composition

Combine multiple skills for complex workflows.

```python
class SkillComposer:
    def compose_workflow(self, skills: List[str]):
        """Create a workflow from multiple skills"""

        # Example: Document generation workflow
        workflow = [
            ('content-research-writer', 'research_and_write'),
            ('document-skills-docx', 'create_document'),
            ('theme-factory', 'apply_theme'),
            ('document-skills-pdf', 'export_pdf')
        ]

        context = {}
        for skill_id, action in workflow:
            skill = load_skill(skill_id)
            result = execute_skill_action(skill, action, context)
            context[skill_id] = result

        return context
```

---

## 10. Troubleshooting

### Common Issues

**Issue 1: "Skill not found in catalog"**

```
Error: Skill 'xyz' not found in catalog
```

**Solution:**
- Check `SKILLS_INDEX.json` for exact skill ID
- Skill IDs use kebab-case: `skill-name`, not `skillName` or `skill_name`
- Verify skill exists in repository

**Issue 2: "Token budget exceeded"**

```
Error: Agent token budget exceeded (51234/50000)
```

**Solution:**
- Reduce number of skills loaded
- Use metadata-only routing first
- Increase agent token budget in config
- Split task across multiple agents

**Issue 3: "MCP server connection failed"**

```
Error: Failed to connect to ads-library-mcp
```

**Solution:**
- Verify `claude_desktop_config.json` configuration
- Check environment variables are set (API keys)
- Ensure MCP server is installed: `python -m mcp_servers.ads_library` should run
- Check server logs for errors

**Issue 4: "Category classification incorrect"**

```
Query: "Build React app"
Routed to: Business Intelligence (WRONG)
Should route to: Development
```

**Solution:**
- Improve keyword matching in routing matrix
- Add more examples to category classification
- Use semantic embedding-based routing
- Review catalog descriptions for clarity

### Debugging Tips

**Enable verbose logging:**

```python
import logging
logging.basicConfig(level=logging.DEBUG)

orchestrator = AgentHiveOrchestrator(catalog_path='catalog/', debug=True)
```

**Token tracking:**

```python
class TokenTracker:
    def __init__(self):
        self.tokens_used = 0
        self.breakdown = {}

    def track(self, component: str, tokens: int):
        self.tokens_used += tokens
        self.breakdown[component] = tokens
        print(f"[{component}] {tokens} tokens (total: {self.tokens_used})")

tracker = TokenTracker()
tracker.track('catalog_index', 4000)
tracker.track('skill_load', 2500)
print(f"Breakdown: {tracker.breakdown}")
```

---

## 11. FAQ

### General Questions

**Q: Do I need to use all 26 skills?**
No! The catalog helps you load only relevant skills for each task.

**Q: Can I add my own skills?**
Yes! Use the `skill-creator` skill to create and package new skills. Then update the catalog index.

**Q: Is this compatible with Claude.ai, Claude Code, and Claude API?**
Yes, the skills work across all Claude platforms. MCP servers require Claude Desktop or custom integration.

### Token Optimization

**Q: How much can I realistically save with this system?**
Average 82% reduction across use cases. Simple tasks: 90%+. Complex tasks requiring references: 50-70%.

**Q: What if I need multiple skills frequently?**
Preload common skill combinations in agent pools, or use session-level caching.

**Q: Does progressive loading slow down responses?**
Initial routing adds ~100ms. Loading skills adds ~50-200ms. Total overhead: 150-300ms, far outweighed by token savings.

### MCP Integration

**Q: Do I need MCP servers to use this catalog?**
No! The catalog works with or without MCP. MCP servers enhance capabilities but are optional.

**Q: Can I use community MCP servers?**
Yes! See https://github.com/modelcontextprotocol/servers for existing servers.

**Q: How do I know which skills should become MCP servers?**
Check `mcpPotential` in SKILLS_INDEX.json. "High" priority skills benefit most from MCP conversion.

### Agent Hive

**Q: How many agents should I run in each pool?**
Start with: Business (3-5), Development (5-10), Creative (3-5), Document (3-5), Content (2-4). Scale based on load.

**Q: Can I run this on a single machine?**
Yes, for development. Production agent hives benefit from distributed deployment.

**Q: What's the cost of running an agent hive?**
Primarily API costs (Claude API calls). With token optimization, costs are ~82% lower than unoptimized systems.

---

## 📚 Additional Resources

- **MASTER_CATALOG.md** - Complete skill reference
- **USE_CASES.md** - 10 detailed real-world examples
- **MCP_INTEGRATION_MAP.md** - Full MCP server specifications
- **SKILLS_INDEX.json** - Programmatic access to all metadata
- **MCP Documentation** - https://modelcontextprotocol.io

---

## 🔄 Changelog

**v2.0.0 (2025-11-09)**
- Initial release of Agent Hive catalog system
- 26 skills cataloged and classified
- MCP integration mapping
- 5-tier progressive loading system
- 10 comprehensive use cases

---

**End of User Guide**

For support or questions, please open an issue on the GitHub repository.
