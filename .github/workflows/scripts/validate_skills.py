#!/usr/bin/env python3
"""Validate SKILL.md frontmatter across all skills."""

import re
import sys
from pathlib import Path
from typing import Dict, List, Tuple

def extract_frontmatter(content: str) -> Tuple[Dict[str, str], bool]:
    """Extract YAML frontmatter from SKILL.md content."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', content, re.DOTALL)
    if not match:
        return {}, False

    frontmatter = {}
    for line in match.group(1).split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            frontmatter[key.strip()] = value.strip()

    return frontmatter, True

def validate_skill(skill_path: Path) -> List[str]:
    """Validate a single SKILL.md file."""
    errors = []

    skill_md = skill_path / "SKILL.md"
    if not skill_md.exists():
        return [f"Missing SKILL.md in {skill_path.name}"]

    try:
        content = skill_md.read_text(encoding='utf-8')
    except Exception as e:
        return [f"Error reading {skill_path.name}/SKILL.md: {e}"]

    frontmatter, has_frontmatter = extract_frontmatter(content)

    if not has_frontmatter:
        errors.append(f"{skill_path.name}: Missing frontmatter")
        return errors

    # Required fields
    required_fields = ['name', 'description']
    for field in required_fields:
        if field not in frontmatter:
            errors.append(f"{skill_path.name}: Missing required field '{field}'")
        elif not frontmatter[field]:
            errors.append(f"{skill_path.name}: Empty value for '{field}'")

    # Validate name format (lowercase with hyphens)
    if 'name' in frontmatter:
        name = frontmatter['name']
        if not re.match(r'^[a-z0-9-]+$', name):
            errors.append(
                f"{skill_path.name}: Invalid name format '{name}' "
                "(should be lowercase with hyphens)"
            )

    # Check description length
    if 'description' in frontmatter:
        desc = frontmatter['description']
        if len(desc) < 20:
            errors.append(
                f"{skill_path.name}: Description too short "
                f"({len(desc)} chars, min 20)"
            )
        if len(desc) > 500:
            errors.append(
                f"{skill_path.name}: Description too long "
                f"({len(desc)} chars, max 500)"
            )

    return errors

def main():
    """Validate all skills in the repository."""
    repo_root = Path.cwd()
    errors = []

    print("🔍 Validating SKILL.md files...\n")

    # Find all skill directories
    skill_dirs = []
    for item in repo_root.iterdir():
        if item.is_dir() and not item.name.startswith('.'):
            if (item / "SKILL.md").exists():
                skill_dirs.append(item)

    # Also check document-skills subdirectories
    doc_skills = repo_root / "document-skills"
    if doc_skills.exists():
        for item in doc_skills.iterdir():
            if item.is_dir() and (item / "SKILL.md").exists():
                skill_dirs.append(item)

    if not skill_dirs:
        print("❌ No skill directories found!")
        sys.exit(1)

    print(f"Found {len(skill_dirs)} skill(s) to validate\n")

    # Validate each skill
    for skill_dir in sorted(skill_dirs):
        skill_errors = validate_skill(skill_dir)
        if skill_errors:
            errors.extend(skill_errors)
            print(f"❌ {skill_dir.name}")
            for error in skill_errors:
                print(f"   - {error}")
        else:
            print(f"✓ {skill_dir.name}")

    # Summary
    print(f"\n{'=' * 50}")
    if errors:
        print(f"❌ Validation failed with {len(errors)} error(s)")
        sys.exit(1)
    else:
        print("✅ All skills validated successfully!")
        sys.exit(0)

if __name__ == "__main__":
    main()
