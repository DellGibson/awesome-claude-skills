# Claude Skills Master Catalog
## Agent Hive System - Comprehensive Skills Index

**Version:** 2.0.0
**Last Updated:** 2025-11-09
**Purpose:** Token-optimized catalog for intelligent agent routing and skill discovery

---

## 📊 Quick Statistics

- **Total Skills:** 26
- **Categories:** 5 primary + 12 subcategories
- **MCP-Compatible Skills:** 8
- **MCP-Builder Skills:** 1
- **Token Reduction:** ~70% vs loading all SKILL.md files
- **Average Skill Load Time:** <100ms with index

---

## 🎯 Catalog Purpose

This catalog enables:

1. **Agent Hive Routing:** Direct requests to specialized agent pools
2. **Token Optimization:** Load only relevant skills based on task classification
3. **MCP Integration:** Identify which skills can become MCP servers
4. **Progressive Disclosure:** Three-tier loading (metadata → skill → resources)
5. **Semantic Search:** Natural language routing to appropriate skills

---

## 📚 Skills Classification Matrix

### Tier 1: MCP Server Candidates (High Priority for Agent Hive)

These skills can be converted to standalone MCP servers for persistent agent access:

| Skill | MCP Potential | External APIs | Server Type | Priority |
|-------|---------------|---------------|-------------|----------|
| **mcp-builder** | ✅ Meta | N/A | Guide | P0 |
| **lead-research-assistant** | ✅ High | LinkedIn, Web Search | Data Collection | P1 |
| **competitive-ads-extractor** | ✅ High | Facebook Ads Library, Meta | Data Extraction | P1 |
| **video-downloader** | ✅ Medium | YouTube, Vimeo | Media Processing | P2 |
| **domain-name-brainstormer** | ✅ Medium | Domain registrars | Validation | P2 |
| **meeting-insights-analyzer** | ✅ Medium | None (File-based) | Analysis | P3 |
| **content-research-writer** | ✅ Medium | Web Search, Citations | Content Gen | P3 |
| **webapp-testing** | ✅ Low | Playwright | Testing | P4 |

### Tier 2: MCP Tool Providers (Skills that USE MCP servers)

These skills benefit from MCP integration for enhanced functionality:

| Skill | MCP Dependencies | Tool Usage | Enhancement |
|-------|------------------|------------|-------------|
| **artifacts-builder** | Browser automation | React compilation | Live preview |
| **file-organizer** | Filesystem MCP | File operations | Batch processing |
| **invoice-organizer** | OCR MCP, Filesystem | Document parsing | Auto-categorization |
| **image-enhancer** | Image processing MCP | Upscaling APIs | Quality boost |
| **changelog-generator** | Git MCP | Repository access | Auto-generation |

### Tier 3: Pure Instruction Skills (Low MCP dependency)

Skills that primarily provide guidance without external tool requirements:

- brand-guidelines
- canvas-design
- slack-gif-creator
- theme-factory
- internal-comms
- raffle-winner-picker
- skill-creator
- template-skill
- algorithmic-art
- document-skills (docx, pdf, pptx, xlsx)

---

## 🗂️ Hierarchical Organization

### 1. BUSINESS & MARKETING (`/skills/business-marketing/`)

**Purpose:** Market intelligence, brand management, lead generation

#### 1.1 Market Intelligence
- **competitive-ads-extractor** - Competitor ad analysis from Meta/Facebook libraries
  - *MCP Potential:* High - Can query ad APIs programmatically
  - *Use Cases:* Competitive analysis, ad trend monitoring
  - *Token Cost:* 2.5K (SKILL.md only)

- **lead-research-assistant** - Lead qualification and research automation
  - *MCP Potential:* High - Web scraping, LinkedIn integration
  - *Use Cases:* Sales prospecting, market research
  - *Token Cost:* 3.1K

#### 1.2 Brand & Identity
- **brand-guidelines** - Anthropic brand standards application
  - *MCP Potential:* Low - Reference documentation
  - *Use Cases:* Consistent branding, artifact styling
  - *Token Cost:* 1.2K

- **domain-name-brainstormer** - Domain name generation + availability
  - *MCP Potential:* Medium - Domain registrar APIs
  - *Use Cases:* Startup naming, brand domains
  - *Token Cost:* 1.8K

#### 1.3 Internal Communications
- **internal-comms** - Company communication templates
  - *MCP Potential:* Low - Template-based
  - *Use Cases:* Newsletters, updates, FAQs
  - *Token Cost:* 2.0K

---

### 2. DEVELOPMENT (`/skills/development/`)

**Purpose:** Code generation, testing, MCP server creation, skill development

#### 2.1 Infrastructure & Protocols
- **mcp-builder** ⭐ CORE SKILL - MCP server development guide
  - *MCP Potential:* Meta (teaches MCP creation)
  - *Use Cases:* Building MCP servers, API integration
  - *Token Cost:* 8.5K + references (28K-102K)
  - *References:* 4 comprehensive guides
  - *Critical for:* Agent hive expansion

- **skill-creator** ⭐ META SKILL - Skill creation guide
  - *MCP Potential:* Low - Instructional
  - *Use Cases:* Creating new skills, packaging
  - *Token Cost:* 6.2K
  - *Scripts:* init_skill.py, package_skill.py, quick_validate.py

#### 2.2 Frontend Development
- **artifacts-builder** - React + Tailwind artifact builder
  - *MCP Potential:* Medium - Build automation
  - *Use Cases:* Complex multi-component UIs
  - *Token Cost:* 4.8K
  - *Stack:* React 18, TypeScript, Vite, shadcn/ui
  - *Scripts:* init-artifact.sh, bundle-artifact.sh

#### 2.3 Testing & Quality
- **webapp-testing** - Playwright-based web testing
  - *MCP Potential:* Low - Playwright already MCP-compatible
  - *Use Cases:* Frontend testing, screenshot capture
  - *Token Cost:* 2.9K

#### 2.4 DevOps & Documentation
- **changelog-generator** - Git commit to user-friendly changelog
  - *MCP Potential:* Medium - Git integration
  - *Use Cases:* Release notes, version docs
  - *Token Cost:* 2.1K

#### 2.5 Templates
- **template-skill** - Blank skill template
  - *MCP Potential:* N/A - Template only
  - *Use Cases:* Starting point for new skills
  - *Token Cost:* 0.1K (minimal)

---

### 3. CREATIVE & MEDIA (`/skills/creative-media/`)

**Purpose:** Visual design, media processing, content creation

#### 3.1 Visual Design
- **canvas-design** - PNG/PDF visual art creation
  - *MCP Potential:* Low - Design guidance
  - *Use Cases:* Posters, static art, visual designs
  - *Token Cost:* 2.7K

- **algorithmic-art** - Generative/computational art
  - *MCP Potential:* Low - Algorithm-based
  - *Use Cases:* Generative designs, creative coding
  - *Token Cost:* 1.9K

- **theme-factory** - Professional themes for artifacts
  - *MCP Potential:* Low - Template system
  - *Use Cases:* Consistent styling across documents
  - *Token Cost:* 2.4K
  - *Themes:* 10 pre-built themes

#### 3.2 Media Processing
- **image-enhancer** - Resolution/quality improvement
  - *MCP Potential:* Medium - Image processing APIs
  - *Use Cases:* Screenshot enhancement, upscaling
  - *Token Cost:* 1.6K

- **video-downloader** - YouTube/video platform downloading
  - *MCP Potential:* Medium - yt-dlp integration
  - *Use Cases:* Video archival, offline viewing
  - *Token Cost:* 2.2K

- **slack-gif-creator** - Animated GIF toolkit
  - *MCP Potential:* Low - Local processing
  - *Use Cases:* Slack animations, marketing GIFs
  - *Token Cost:* 5.8K
  - *Core Modules:* 7 Python files
  - *Templates:* 10 animation templates
  - *Dependencies:* pillow, imageio

---

### 4. COMMUNICATION & WRITING (`/skills/communication-writing/`)

**Purpose:** Content creation, analysis, research-backed writing

#### 4.1 Content Generation
- **content-research-writer** - Research-backed content writing
  - *MCP Potential:* Medium - Web research integration
  - *Use Cases:* Articles, blog posts, research papers
  - *Token Cost:* 3.4K

#### 4.2 Analysis & Insights
- **meeting-insights-analyzer** - Meeting transcript analysis
  - *MCP Potential:* Medium - NLP/analytics
  - *Use Cases:* Leadership feedback, team dynamics
  - *Token Cost:* 2.8K
  - *Analyzes:* Conflict patterns, speaking ratios, filler words

---

### 5. PRODUCTIVITY & ORGANIZATION (`/skills/productivity-organization/`)

**Purpose:** File management, document processing, workflow automation

#### 5.1 File Management
- **file-organizer** - Intelligent file organization
  - *MCP Potential:* Medium - Filesystem operations
  - *Use Cases:* Cleanup, deduplication, restructuring
  - *Token Cost:* 2.3K

- **invoice-organizer** - Invoice/receipt tax preparation
  - *MCP Potential:* Medium - OCR + filesystem
  - *Use Cases:* Tax prep, expense tracking
  - *Token Cost:* 2.6K

#### 5.2 Document Processing
- **document-skills-docx** - Microsoft Word documents
  - *MCP Potential:* Low - Local processing
  - *Use Cases:* DOCX creation, editing, formatting
  - *Token Cost:* 7.2K
  - *Modules:* document.py (50KB), utilities.py
  - *References:* OOXML specification

- **document-skills-pdf** - PDF documents
  - *MCP Potential:* Low - Local processing
  - *Use Cases:* PDF creation, editing, forms
  - *Token Cost:* 6.8K

- **document-skills-pptx** - PowerPoint presentations
  - *MCP Potential:* Low - Local processing
  - *Use Cases:* PPTX creation, editing
  - *Token Cost:* 6.5K

- **document-skills-xlsx** - Excel spreadsheets
  - *MCP Potential:* Low - Local processing
  - *Use Cases:* Spreadsheet creation, formulas
  - *Token Cost:* 6.9K

#### 5.3 Utilities
- **raffle-winner-picker** - Secure random selection
  - *MCP Potential:* Low - Cryptographic operation
  - *Use Cases:* Giveaways, random sampling
  - *Token Cost:* 1.4K

---

## 🔍 Usage Patterns & Token Optimization

### Progressive Loading Strategy

```
Level 1: Catalog Index (THIS FILE)
├─ Token Cost: 4K
├─ Load Time: Immediate
└─ Purpose: Route to category

Level 2: Category Index
├─ Token Cost: 500-800 per category
├─ Load Time: <50ms
└─ Purpose: Select specific skill

Level 3: Skill Metadata (SKILL.md frontmatter only)
├─ Token Cost: 50-100 per skill
├─ Load Time: <10ms
└─ Purpose: Confirm skill match

Level 4: Full Skill (SKILL.md complete)
├─ Token Cost: 1.2K - 8.5K per skill
├─ Load Time: 100-200ms
└─ Purpose: Execute skill instructions

Level 5: Skill Resources (references, scripts, assets)
├─ Token Cost: Variable (0-102K)
├─ Load Time: Variable
└─ Purpose: Deep execution with context
```

### Token Savings Example

**Without Catalog (loading all skills):**
- All 26 SKILL.md files: ~89,000 tokens
- All references: ~150,000 tokens
- **Total:** ~239,000 tokens

**With Catalog (intelligent routing):**
- Catalog index: 4,000 tokens
- Category index: 600 tokens
- Selected skill: 3,000 tokens
- Relevant references: 10,000 tokens
- **Total:** ~17,600 tokens
- **Savings:** ~92.6% token reduction

---

## 🤖 Agent Hive Architecture Integration

### Agent Pool Specialization

#### Pool 1: Business Intelligence Agents
**Skills Loaded:**
- competitive-ads-extractor
- lead-research-assistant
- domain-name-brainstormer

**MCP Servers:**
- ads-library-mcp (Facebook Ads API)
- linkedin-scraper-mcp
- domain-check-mcp

#### Pool 2: Development Agents
**Skills Loaded:**
- mcp-builder
- skill-creator
- artifacts-builder
- changelog-generator

**MCP Servers:**
- github-mcp
- npm-registry-mcp

#### Pool 3: Creative Agents
**Skills Loaded:**
- canvas-design
- slack-gif-creator
- image-enhancer
- theme-factory

**MCP Servers:**
- image-processing-mcp
- font-library-mcp

#### Pool 4: Document Processing Agents
**Skills Loaded:**
- document-skills (all 4)
- file-organizer
- invoice-organizer

**MCP Servers:**
- filesystem-mcp
- ocr-mcp

#### Pool 5: Content & Communication Agents
**Skills Loaded:**
- content-research-writer
- meeting-insights-analyzer
- internal-comms

**MCP Servers:**
- web-search-mcp
- citation-mcp

---

## 📈 Metrics & Analytics

### Skill Complexity Tiers

**Tier 1 - Simple (1-3K tokens)**
- brand-guidelines, raffle-winner-picker, template-skill
- Load time: <50ms
- Execution: Single-step tasks

**Tier 2 - Moderate (3-5K tokens)**
- Most skills fall here
- Load time: 100-150ms
- Execution: Multi-step workflows

**Tier 3 - Complex (5-9K tokens)**
- mcp-builder, document-skills, slack-gif-creator
- Load time: 200-300ms
- Execution: Complex multi-phase tasks
- May require reference loading

---

## 🔗 Cross-Skill Dependencies

### Dependency Graph

```
mcp-builder
└─ Enables: All Tier 1 MCP Server Candidates

skill-creator
└─ Enables: All future skills

artifacts-builder
├─ Uses: brand-guidelines (optional)
└─ Uses: theme-factory (optional)

document-skills
└─ Uses: theme-factory (optional)

All content skills
└─ May use: content-research-writer
```

---

## 📖 Quick Reference Guide

### For Agent Routing

**"How do I market my product?"**
→ Category: business-marketing
→ Skills: competitive-ads-extractor, lead-research-assistant

**"Build me a web application"**
→ Category: development
→ Skills: artifacts-builder, webapp-testing

**"Create a visual design"**
→ Category: creative-media
→ Skills: canvas-design, theme-factory, algorithmic-art

**"Write content about X"**
→ Category: communication-writing
→ Skills: content-research-writer

**"Organize these files"**
→ Category: productivity-organization
→ Skills: file-organizer, invoice-organizer

**"I want to build an MCP server"**
→ Category: development
→ Skills: mcp-builder (P0), skill-creator (supporting)

---

## 🎓 Learning Path

### For New Users
1. Start with: **template-skill** (understand structure)
2. Then explore: **skill-creator** (learn creation process)
3. Build with: **artifacts-builder** or category-specific skill

### For MCP Server Developers
1. **Required:** mcp-builder
2. **Recommended:** skill-creator (for packaging)
3. **Reference:** Tier 1 MCP candidates for inspiration

### For Agent Hive Operators
1. Review this catalog (MASTER_CATALOG.md)
2. Load category indexes as needed
3. Route based on task classification
4. Monitor token usage and optimize

---

## 📋 Maintenance Notes

**Adding New Skills:**
1. Create skill using skill-creator
2. Update this catalog with classification
3. Add to appropriate category index
4. Update marketplace.json
5. Recalculate token costs

**Deprecating Skills:**
1. Mark as deprecated in catalog
2. Add migration path
3. Update category indexes
4. Keep for 2 versions before removal

**Version History:**
- v1.0.0: Initial marketplace.json structure
- v2.0.0: Agent hive catalog with MCP focus (this version)

---

**End of Master Catalog**
