# License Matrix

**Generated:** November 9, 2025
**Repository:** awesome-claude-skills

## Executive Summary

This document provides a comprehensive matrix of all licenses used across the repository, including both skill licenses and dependency licenses.

### Overview

- **Repository License:** Apache 2.0
- **Skill Licenses:** 2 types (Apache 2.0, Anthropic Proprietary)
- **Dependency Licenses:** 4 types (MIT, BSD-2, BSD-3, HPND)
- **Total Skills:** 26
- **Skills with Dependencies:** 2

## Skill License Matrix

| Skill Name | Category | License | License File | Risk Level |
|------------|----------|---------|--------------|------------|
| algorithmic-art | Creative & Media | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| artifacts-builder | Development | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| brand-guidelines | Business & Marketing | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| canvas-design | Creative & Media | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| changelog-generator | Development | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| competitive-ads-extractor | Business & Marketing | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| content-research-writer | Communication & Writing | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| domain-name-brainstormer | Business & Marketing | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| file-organizer | Productivity & Organization | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| image-enhancer | Creative & Media | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| internal-comms | Business & Marketing | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| invoice-organizer | Productivity & Organization | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| lead-research-assistant | Business & Marketing | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| mcp-builder | Development | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| meeting-insights-analyzer | Communication & Writing | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| raffle-winner-picker | Productivity & Organization | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| skill-creator | Development | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| slack-gif-creator | Creative & Media | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| template-skill | Development | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| theme-factory | Creative & Media | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| video-downloader | Creative & Media | Apache 2.0 | ⚠️ Missing | ⚠️ Medium |
| webapp-testing | Development | Apache 2.0 | ✓ LICENSE.txt | ✓ Low |
| document-skills/docx | Productivity & Organization | Anthropic Proprietary | ✓ LICENSE.txt | ℹ️ Proprietary |
| document-skills/pdf | Productivity & Organization | Anthropic Proprietary | ✓ LICENSE.txt | ℹ️ Proprietary |
| document-skills/pptx | Productivity & Organization | Anthropic Proprietary | ✓ LICENSE.txt | ℹ️ Proprietary |
| document-skills/xlsx | Productivity & Organization | Anthropic Proprietary | ✓ LICENSE.txt | ℹ️ Proprietary |

## License Types Summary

### Apache License 2.0

**Skills Using:** 22 out of 26

**Key Terms:**
- ✓ Commercial use allowed
- ✓ Modification allowed
- ✓ Distribution allowed
- ✓ Patent grant included
- ✓ Private use allowed
- ℹ️ Must include license and copyright notice
- ℹ️ Must state changes made
- ℹ️ No liability or warranty

**Compatibility:** Highly compatible with most open-source and commercial projects

### Anthropic Proprietary License

**Skills Using:** 4 out of 26 (document-skills only)

**Key Terms:**
- © 2025 Anthropic, PBC. All rights reserved
- Custom licensing terms (see individual LICENSE.txt files)
- Different usage restrictions may apply

**Compatibility:** Subject to Anthropic's licensing terms

## Dependency License Matrix

| Package | Version | License | Used By | Risk Notes |
|---------|---------|---------|---------|------------|
| anthropic | >=0.39.0 | MIT | mcp-builder | ✓ Permissive, widely used |
| mcp | >=1.1.0 | MIT | mcp-builder | ✓ Permissive, widely used |
| pillow | >=10.0.0 | HPND | slack-gif-creator | ✓ Permissive, mature project |
| imageio | >=2.31.0 | BSD-2-Clause | slack-gif-creator | ✓ Permissive, well-maintained |
| imageio-ffmpeg | >=0.4.9 | BSD-2-Clause | slack-gif-creator | ✓ Permissive |
| numpy | >=1.24.0 | BSD-3-Clause | slack-gif-creator | ✓ Permissive, industry standard |

## License Compatibility Analysis

### Apache 2.0 + Dependencies

All dependency licenses (MIT, BSD-2, BSD-3, HPND) are compatible with Apache 2.0:

```
Apache 2.0 (Repo)
├── MIT (anthropic, mcp) ✓ Compatible
├── HPND (pillow) ✓ Compatible
├── BSD-2-Clause (imageio, imageio-ffmpeg) ✓ Compatible
└── BSD-3-Clause (numpy) ✓ Compatible
```

**Result:** ✓ No license conflicts detected

### Anthropic Proprietary + Dependencies

Document-skills (Anthropic proprietary) do not currently have external dependencies.

**Result:** ✓ No dependency conflicts

## Risk Assessment

### Critical Issues

**None identified**

### Warnings

1. **Missing LICENSE.txt Files:** 13 skills lack explicit LICENSE.txt files
   - **Impact:** Unclear licensing for users
   - **Recommendation:** Add Apache 2.0 LICENSE.txt to all applicable skills
   - **Affected Skills:**
     - changelog-generator
     - competitive-ads-extractor
     - content-research-writer
     - domain-name-brainstormer
     - file-organizer
     - image-enhancer
     - invoice-organizer
     - lead-research-assistant
     - meeting-insights-analyzer
     - raffle-winner-picker
     - template-skill
     - video-downloader

2. **Mixed Licensing:** Repository contains both Apache 2.0 and proprietary licenses
   - **Impact:** Users must be aware of different terms for different skills
   - **Recommendation:** Document clearly in README which skills have different licenses

### Notices

1. **Patent Grant:** Apache 2.0 includes explicit patent grant (beneficial for users)
2. **Trademark:** Apache 2.0 does not grant trademark rights
3. **Warranty Disclaimer:** All licenses disclaim warranties

## Compliance Checklist

- [x] Repository root has LICENSE file
- [x] README mentions licensing
- [x] Individual skills with code have license information in SKILL.md frontmatter
- [ ] **TODO:** All skills have LICENSE.txt files (13 missing)
- [x] Dependency licenses documented
- [x] License compatibility verified
- [ ] **TODO:** NOTICE file for Apache 2.0 (if needed)

## Recommendations

### Immediate Actions

1. **Add Missing LICENSE.txt Files**
   ```bash
   # Copy Apache 2.0 LICENSE.txt to skills missing it
   for skill in changelog-generator competitive-ads-extractor content-research-writer \
                domain-name-brainstormer file-organizer image-enhancer \
                invoice-organizer lead-research-assistant meeting-insights-analyzer \
                raffle-winner-picker template-skill video-downloader; do
     cp brand-guidelines/LICENSE.txt "$skill/"
   done
   ```

2. **Update README.md**
   - Add clear licensing section
   - Note which skills use different licenses
   - Link to LICENSE files

3. **Create NOTICE File (Optional)**
   - List all contributors
   - Document Anthropic copyright
   - Include third-party attributions

### Best Practices

1. **Header Comments:** Add license headers to source files
2. **Dependency Updates:** Monitor dependency licenses for changes
3. **Annual Review:** Review licenses annually or on major updates
4. **Legal Consultation:** Consult legal counsel for commercial distributions

## License Text References

### Apache License 2.0

- **Full Text:** https://www.apache.org/licenses/LICENSE-2.0
- **SPDX Identifier:** Apache-2.0
- **OSI Approved:** Yes
- **FSF Free/Libre:** Yes

### MIT License

- **Full Text:** https://opensource.org/licenses/MIT
- **SPDX Identifier:** MIT
- **OSI Approved:** Yes
- **FSF Free/Libre:** Yes

### BSD Licenses

- **BSD-2-Clause:** https://opensource.org/licenses/BSD-2-Clause
- **BSD-3-Clause:** https://opensource.org/licenses/BSD-3-Clause
- **OSI Approved:** Yes
- **FSF Free/Libre:** Yes

### HPND (Historical Permission Notice and Disclaimer)

- **Full Text:** https://opensource.org/licenses/HPND
- **SPDX Identifier:** HPND
- **OSI Approved:** Yes
- **FSF Free/Libre:** Yes

## Conclusion

The repository maintains good license hygiene overall, with most skills using the permissive Apache 2.0 license. The main improvement needed is adding explicit LICENSE.txt files to the 13 skills currently missing them. All dependencies use permissive, compatible licenses, presenting no legal risks.

**Overall Risk Level:** ✓ Low (with recommended improvements)

---

**Last Updated:** November 9, 2025
**Next Review:** Annually or upon major changes
**Maintained By:** Repository Maintainers
