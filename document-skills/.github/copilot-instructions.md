# Document Skills Copilot Instructions

This repository provides comprehensive document processing capabilities for DOCX, PDF, PPTX, and XLSX files. Understanding the architecture and patterns is essential for productive contributions.

## Core Architecture

### Skill-Based Structure
Each format (`docx/`, `pdf/`, `pptx/`, `xlsx/`) follows a consistent pattern:
- `SKILL.md` - Complete workflow documentation (MUST READ ENTIRELY before any changes)
- `scripts/` - Python/JavaScript tools for document manipulation
- `ooxml/` - Shared OOXML infrastructure for Office formats (docx, pptx, xlsx)

### Two-Tier Processing Model
1. **High-level tools** (pandoc, docx-js, html2pptx) for simple operations
2. **Raw OOXML manipulation** for complex scenarios requiring precise control

## Critical Workflow Patterns

### DOCX Processing
- **New documents**: Use `docx-js` (JavaScript) → read `docx/docx-js.md` completely
- **Editing existing**: Use Document library (Python) → read `docx/ooxml.md` completely  
- **Tracked changes**: Follow redlining workflow with batched changes (3-10 per batch)
- **RSID management**: Auto-generated via Document class, preserves attribution
- **Validation**: Always validate with `validate.py` after OOXML edits

### PPTX Processing
- **From scratch**: Use html2pptx workflow → read `pptx/html2pptx.md` completely
- **From templates**: Use inventory.py → rearrange.py → replace.py pipeline
- **Key insight**: Template slides are 0-indexed, inventory preserves exact formatting
- **Validation**: Generate thumbnails with `thumbnail.py` for visual inspection

### PDF Processing  
- **Forms**: Use `pdf/forms.md` for fillable field operations
- **Text extraction**: Use pdfplumber for tables, pypdf for basic text
- **Creation**: Use reportlab for programmatic generation

### XLSX Processing
- **Formula-first approach**: Always use Excel formulas, never hardcode calculated values
- **Recalculation**: Use `recalc.py` with LibreOffice to update formula values
- **Error detection**: Script reports all Excel errors (REF!, DIV/0!, etc.) with locations
- **Financial models**: Follow color coding (blue=inputs, black=formulas, green=links)

## OOXML Infrastructure

### Validation System (`ooxml/scripts/validation/`)
- **Schema validation**: XSD compliance checking against ISO standards
- **Redlining validation**: Tracked changes structure verification  
- **Reference validation**: Relationship integrity across XML files
- **Auto-cleaning**: Removes ignorable namespaces from main content

### Shared Utilities
- `unpack.py` / `pack.py` - Extract/recompress Office documents
- `validate.py` - Comprehensive document validation
- Document library - High-level DOM manipulation with auto-attribution

## Development Conventions

### File Reading Requirements
When working with SKILL.md files:
- **ALWAYS read the ENTIRE file** without range limits
- These files contain critical workflow details and edge cases
- Partial reading leads to incorrect implementations

### Error Handling Patterns
- Validation errors include specific file paths and line numbers
- Batch operations for tracked changes (prevents overwhelming error output)
- Graceful degradation for missing optional features

### Testing Approach
- Visual validation for presentations (thumbnail grids)
- Formula verification for spreadsheets (recalc.py output)
- Schema compliance for all OOXML modifications
- Original vs. modified comparison (only new errors reported)

## Key Integration Points

### Cross-Format Dependencies
- OOXML schemas shared between docx/pptx/xlsx
- Template patterns apply across presentation and document workflows
- Validation infrastructure unified across all Office formats

### External Tool Requirements
- LibreOffice: PDF conversion, Excel recalculation
- Pandoc: Markdown conversion for text extraction
- Playwright: HTML rendering for presentation creation
- Sharp: Image processing for gradients and icons

### MCP Server Integration
- **Playwright MCP**: Available via `npx @playwright/mcp@latest` for browser automation
- **Configuration**: See `claude_desktop_config.json` for MCP server setup
- **Use case**: Automated testing of HTML slides and web-based document previews

## Common Pitfalls

1. **OOXML editing without validation** - Always run validate.py after modifications
2. **Hardcoding Excel values** - Use formulas to maintain spreadsheet dynamism  
3. **Partial SKILL.md reading** - Must read complete files for proper context
4. **Template index confusion** - Slides are 0-indexed, verify ranges carefully
5. **Missing RSID attribution** - Use Document class for automatic tracking

Remember: This codebase prioritizes correctness and professional output quality over development speed. Always validate, always test, and always preserve existing document fidelity.