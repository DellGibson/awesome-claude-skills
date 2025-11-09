# MCP Integration Map
## Model Context Protocol Skills & Server Architecture

**Version:** 2.0.0
**Last Updated:** 2025-11-09
**Purpose:** Map Claude Skills to MCP server architecture for agent hive deployment

---

## 🎯 Overview

This document maps the relationship between Claude Skills and MCP (Model Context Protocol) servers, providing a blueprint for creating an agent hive architecture where skills can operate as:

1. **MCP Servers** - Standalone services providing tools to LLMs
2. **MCP Clients** - Skills that consume MCP server tools
3. **Hybrid** - Skills that both provide and consume MCP tools

---

## 📊 MCP Compatibility Matrix

### Tier 1: High-Priority MCP Server Candidates

These skills should be converted to MCP servers for maximum agent hive value:

| Skill | MCP Server Name | Tools Provided | External APIs | Est. Dev Time |
|-------|-----------------|----------------|---------------|---------------|
| **competitive-ads-extractor** | `ads-library-mcp` | `search_ads`, `get_ad_details`, `analyze_campaign`, `export_ads` | Facebook Ads Library, Meta Graph API | 8-12 hours |
| **lead-research-assistant** | `linkedin-scraper-mcp` | `find_companies`, `get_company_profile`, `search_people`, `qualify_lead` | LinkedIn, Clearbit, Hunter.io | 12-16 hours |
| **domain-name-brainstormer** | `domain-check-mcp` | `check_availability`, `suggest_domains`, `get_pricing`, `whois_lookup` | Domain registrars, WHOIS | 4-6 hours |
| **video-downloader** | `video-download-mcp` | `download_video`, `get_formats`, `extract_audio`, `get_metadata` | yt-dlp, YouTube API | 6-8 hours |
| **content-research-writer** | `research-assistant-mcp` | `web_search`, `fetch_article`, `extract_citations`, `fact_check` | Web Search APIs, Citation services | 10-14 hours |
| **meeting-insights-analyzer** | `transcript-analysis-mcp` | `analyze_transcript`, `identify_patterns`, `extract_insights`, `generate_report` | None (file-based) | 6-8 hours |

**Total Development Estimate:** 46-64 hours for Tier 1 MCP servers

---

## 🏗️ MCP Server Architecture

### Server Design Pattern

Each MCP server follows this structure:

```
mcp-server-name/
├── server.py (or index.ts)           # Main MCP server
├── tools/                              # Tool implementations
│   ├── search.py
│   ├── extract.py
│   └── analyze.py
├── utils/                              # Shared utilities
│   ├── api_client.py
│   ├── formatters.py
│   └── validators.py
├── config/                             # Configuration
│   └── settings.json
├── tests/                              # Test suites
│   └── test_tools.py
├── evaluation/                         # MCP evaluations
│   └── questions.xml
└── README.md                           # Server documentation
```

---

## 🔧 Tier 1 MCP Server Specifications

### 1. ads-library-mcp (competitive-ads-extractor)

**Purpose:** Programmatic access to Facebook/Meta ad libraries for competitive intelligence

**Tools:**

```python
@mcp.tool(description="Search for ads in Facebook Ad Library")
async def search_ads(
    advertiser: str,
    country: str = "US",
    platform: List[str] = ["facebook", "instagram"],
    date_range: Optional[DateRange] = None,
    max_results: int = 50,
    response_format: Literal["json", "markdown"] = "markdown"
) -> str:
    """
    Search for ads by advertiser name in Meta Ad Library.

    Args:
        advertiser: Company or advertiser name
        country: ISO country code (default: US)
        platform: Platforms to search (facebook, instagram, etc.)
        date_range: Optional date range filter
        max_results: Maximum ads to return (1-100)
        response_format: Return format (json or markdown)

    Returns:
        Formatted ad results with metadata, creative, and targeting
    """
    ...

@mcp.tool(description="Get detailed information about specific ad")
async def get_ad_details(ad_id: str, include_targeting: bool = True) -> str:
    """Fetch comprehensive details for a specific ad including creative assets and targeting."""
    ...

@mcp.tool(description="Analyze advertising campaign patterns")
async def analyze_campaign(
    advertiser: str,
    analysis_type: Literal["messaging", "creative", "timing", "targeting"] = "messaging"
) -> str:
    """Analyze patterns across an advertiser's campaigns."""
    ...
```

**API Integration:**
- Facebook Graph API
- Ad Library API
- Rate Limiting: 200 calls/hour per user token

**Configuration:**
```json
{
  "apiToken": "env:META_API_TOKEN",
  "rateLimit": 200,
  "cacheTTL": 3600,
  "defaultCountry": "US"
}
```

**Use Cases:**
- Competitive ad monitoring
- Creative trend analysis
- Messaging strategy research

---

### 2. linkedin-scraper-mcp (lead-research-assistant)

**Purpose:** Lead generation and company research through LinkedIn and company databases

**Tools:**

```python
@mcp.tool(description="Search for companies matching criteria")
async def find_companies(
    industry: Optional[str] = None,
    size: Optional[str] = None,
    location: Optional[str] = None,
    technologies: Optional[List[str]] = None,
    max_results: int = 20
) -> str:
    """
    Search for companies matching specific criteria.

    Args:
        industry: Industry filter (e.g., "SaaS", "Fintech")
        size: Company size ("1-10", "11-50", "51-200", "201-500", "500+")
        location: Geographic location
        technologies: Tech stack filters
        max_results: Max companies to return

    Returns:
        List of companies with key details and contact information
    """
    ...

@mcp.tool(description="Get comprehensive company profile")
async def get_company_profile(company_name: str, include_contacts: bool = False) -> str:
    """Fetch detailed company information including size, funding, tech stack."""
    ...

@mcp.tool(description="Search for people at target companies")
async def search_people(
    company: str,
    role: Optional[str] = None,
    seniority: Optional[str] = None
) -> str:
    """Find decision-makers at target companies."""
    ...

@mcp.tool(description="Qualify lead based on ICP criteria")
async def qualify_lead(
    company_name: str,
    icp_criteria: Dict[str, Any]
) -> str:
    """Score and qualify a lead against ideal customer profile."""
    ...
```

**API Integration:**
- LinkedIn API (limited)
- Clearbit Enrichment API
- Hunter.io for email finding
- Custom web scraping (respectful of robots.txt)

**Rate Limiting:**
- LinkedIn: 100 requests/day (official API)
- Clearbit: 1000 requests/month (free tier)
- Hunter.io: 50 requests/month (free tier)

---

### 3. domain-check-mcp (domain-name-brainstormer)

**Purpose:** Domain name availability checking and suggestions

**Tools:**

```python
@mcp.tool(description="Check domain availability across TLDs")
async def check_availability(
    domain_base: str,
    tlds: List[str] = [".com", ".io", ".dev", ".ai"],
    include_similar: bool = True
) -> str:
    """
    Check if domains are available for registration.

    Args:
        domain_base: Base domain name (without TLD)
        tlds: List of TLDs to check
        include_similar: Include similar available domains

    Returns:
        Availability status, pricing, and alternatives
    """
    ...

@mcp.tool(description="Generate domain name suggestions")
async def suggest_domains(
    keywords: List[str],
    style: Literal["short", "brandable", "descriptive", "compound"] = "brandable",
    max_suggestions: int = 20
) -> str:
    """Generate creative domain suggestions based on keywords."""
    ...

@mcp.tool(description="Get domain pricing and registration info")
async def get_pricing(domains: List[str]) -> str:
    """Fetch pricing across multiple registrars."""
    ...

@mcp.tool(description="WHOIS lookup for domain information")
async def whois_lookup(domain: str) -> str:
    """Get WHOIS information for existing domain."""
    ...
```

**API Integration:**
- Namecheap API
- GoDaddy API
- WHOIS databases

---

### 4. video-download-mcp (video-downloader)

**Purpose:** Video downloading and metadata extraction from platforms

**Tools:**

```python
@mcp.tool(description="Download video from URL")
async def download_video(
    url: str,
    quality: Literal["best", "1080p", "720p", "480p"] = "best",
    format: Literal["mp4", "webm", "mkv"] = "mp4",
    output_dir: str = "./downloads"
) -> str:
    """Download video from YouTube or other supported platforms."""
    ...

@mcp.tool(description="Get available formats for video")
async def get_formats(url: str) -> str:
    """List all available formats and qualities for a video."""
    ...

@mcp.tool(description="Extract audio only from video")
async def extract_audio(
    url: str,
    format: Literal["mp3", "m4a", "wav"] = "mp3"
) -> str:
    """Extract audio track from video."""
    ...

@mcp.tool(description="Get video metadata")
async def get_metadata(url: str) -> str:
    """Fetch video metadata including title, description, views, etc."""
    ...
```

**Implementation:**
- yt-dlp library
- ffmpeg for conversion

---

### 5. research-assistant-mcp (content-research-writer)

**Purpose:** Web research and citation extraction for content writing

**Tools:**

```python
@mcp.tool(description="Search the web for research")
async def web_search(
    query: str,
    num_results: int = 10,
    date_filter: Optional[str] = None
) -> str:
    """Search for relevant articles and sources."""
    ...

@mcp.tool(description="Fetch and extract article content")
async def fetch_article(url: str, extract_citations: bool = True) -> str:
    """Fetch article content and extract key information."""
    ...

@mcp.tool(description="Extract and format citations")
async def extract_citations(text: str, style: Literal["apa", "mla", "chicago"] = "apa") -> str:
    """Extract and format citations from text."""
    ...

@mcp.tool(description="Fact-check claims against sources")
async def fact_check(claim: str, sources: Optional[List[str]] = None) -> str:
    """Verify claims against reliable sources."""
    ...
```

---

### 6. transcript-analysis-mcp (meeting-insights-analyzer)

**Purpose:** Meeting transcript analysis and behavioral insights

**Tools:**

```python
@mcp.tool(description="Analyze meeting transcript")
async def analyze_transcript(
    transcript: str,
    analysis_types: List[str] = ["all"]
) -> str:
    """
    Comprehensive transcript analysis.

    analysis_types: ["speaking_ratios", "sentiment", "conflict", "filler_words", "leadership"]
    """
    ...

@mcp.tool(description="Identify communication patterns")
async def identify_patterns(transcript: str, pattern_type: str) -> str:
    """Identify specific patterns like interruptions, agreements, questions."""
    ...

@mcp.tool(description="Extract key insights and action items")
async def extract_insights(transcript: str) -> str:
    """Extract decisions, action items, and key takeaways."""
    ...

@mcp.tool(description="Generate analysis report")
async def generate_report(
    transcript: str,
    format: Literal["summary", "detailed", "presentation"] = "detailed"
) -> str:
    """Generate comprehensive analysis report."""
    ...
```

---

## 🔌 MCP Client Skills (Skills that USE MCP servers)

These skills benefit from MCP integration:

| Skill | Required MCP Servers | Enhancement Benefit |
|-------|---------------------|---------------------|
| **artifacts-builder** | `browser-automation-mcp` | Live preview and testing |
| **file-organizer** | `filesystem-mcp` | Batch operations, safety |
| **invoice-organizer** | `ocr-mcp`, `filesystem-mcp` | Auto text extraction |
| **image-enhancer** | `image-processing-mcp` | API-based upscaling |
| **changelog-generator** | `git-mcp` | Direct repo access |
| **webapp-testing** | `playwright-mcp` | Already uses Playwright |

---

## 🌐 Agent Hive MCP Architecture

### Network Topology

```
┌─────────────────────────────────────────────────────────┐
│                   Agent Hive Orchestrator                │
│              (Routes tasks to specialized pools)          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌───────────────┼───────────────┬───────────────┐
         │               │               │               │
    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
    │Business │    │Development│    │Creative │    │Document │
    │  Intel  │    │   Pool    │    │  Pool   │    │  Pool   │
    └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘
         │              │              │              │
         │              │              │              │
    ┌────▼─────────────────────────────▼──────────────▼────┐
    │               Shared MCP Server Layer                 │
    ├───────────────────────────────────────────────────────┤
    │  ads-library-mcp     │  image-processing-mcp          │
    │  linkedin-scraper    │  filesystem-mcp                │
    │  domain-check-mcp    │  ocr-mcp                       │
    │  research-assistant  │  git-mcp                       │
    │  video-download-mcp  │  browser-automation-mcp        │
    └───────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │   External APIs    │
                │ (Meta, LinkedIn,   │
                │  Domain Registrars)│
                └────────────────────┘
```

### Configuration: claude_desktop_config.json

```json
{
  "mcpServers": {
    "ads-library": {
      "command": "python",
      "args": ["-m", "mcp_servers.ads_library"],
      "env": {
        "META_API_TOKEN": "${META_API_TOKEN}"
      }
    },
    "linkedin-scraper": {
      "command": "python",
      "args": ["-m", "mcp_servers.linkedin_scraper"],
      "env": {
        "CLEARBIT_API_KEY": "${CLEARBIT_API_KEY}",
        "HUNTER_API_KEY": "${HUNTER_API_KEY}"
      }
    },
    "domain-check": {
      "command": "python",
      "args": ["-m", "mcp_servers.domain_check"],
      "env": {
        "NAMECHEAP_API_KEY": "${NAMECHEAP_API_KEY}"
      }
    },
    "video-download": {
      "command": "python",
      "args": ["-m", "mcp_servers.video_download"]
    },
    "research-assistant": {
      "command": "python",
      "args": ["-m", "mcp_servers.research_assistant"],
      "env": {
        "SEARCH_API_KEY": "${SEARCH_API_KEY}"
      }
    },
    "transcript-analysis": {
      "command": "python",
      "args": ["-m", "mcp_servers.transcript_analysis"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/home/user/workspace"]
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git"]
    }
  }
}
```

---

## 📦 Implementation Priority Queue

### Phase 1: Foundation (Week 1-2)
- ✅ Catalog and index all skills
- ⬜ Implement `domain-check-mcp` (lowest complexity)
- ⬜ Implement `transcript-analysis-mcp` (no external APIs)
- ⬜ Test with existing skills

### Phase 2: High-Value Servers (Week 3-4)
- ⬜ Implement `ads-library-mcp`
- ⬜ Implement `linkedin-scraper-mcp`
- ⬜ Create evaluations for each server
- ⬜ Integration testing

### Phase 3: Enhancement Servers (Week 5-6)
- ⬜ Implement `video-download-mcp`
- ⬜ Implement `research-assistant-mcp`
- ⬜ Connect client skills to MCP servers
- ⬜ Performance optimization

### Phase 4: Agent Hive Deployment (Week 7-8)
- ⬜ Set up agent pool orchestration
- ⬜ Implement task routing logic
- ⬜ Deploy all MCP servers
- ⬜ Load testing and monitoring

---

## 📊 Success Metrics

### MCP Server Quality
- ✅ All tools have comprehensive docstrings
- ✅ Input validation with Pydantic/Zod
- ✅ Error messages guide LLM to correct usage
- ✅ Response formats support JSON and Markdown
- ✅ Pagination for large result sets
- ✅ Character limits with truncation
- ✅ 10+ evaluation questions per server

### Agent Hive Performance
- Token usage reduced by >90%
- Task routing accuracy >95%
- Average response time <2s
- Successful task completion >90%
- Concurrent agent capacity: 100+

---

## 🔐 Security Considerations

### API Key Management
- Environment variables for all secrets
- Never hardcode tokens
- Rotate keys regularly
- Use least-privilege access

### Rate Limiting
- Implement per-tool rate limits
- Respect API provider limits
- Graceful degradation when limited
- User-level quota tracking

### Data Privacy
- No persistent storage of user data
- Clear data retention policies
- GDPR compliance for EU users
- Audit logs for all API calls

---

**End of MCP Integration Map**
