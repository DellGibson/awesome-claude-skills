This repository is a collection of Claude Skills and supporting tooling. The instructions below help an AI coding assistant (Copilot/agent) be immediately productive when editing, adding, or validating skills in this repo.

- Big picture
  - Each skill is a self-contained folder with a required `SKILL.md` (YAML frontmatter: `name`, `description`) and optional `scripts/`, `references/`, and `assets/`.
  - Skills are packaged and distributed as zip files for use in Claude (see `skill-creator` and `scripts/package_skill.py` references in several skills).
  - Some skills scaffold or generate projects (e.g., `artifacts-builder` uses `scripts/init-artifact.sh` and `scripts/bundle-artifact.sh` to create and bundle React/Tailwind artifacts into a single HTML `bundle.html`). Use these scripts rather than inventing custom bundling flows.

- Immediate priorities for edits
  - Preserve YAML frontmatter in `SKILL.md`. Do not remove `name` or `description` fields; these drive skill routing.
  - Keep SKILL.md instructions concise and written in imperative/infinitive form (verb-first). Many SKILL.md files explicitly require this style (see `skill-creator/SKILL.md`).
  - When adding code or scripts, prefer small, deterministic scripts in `scripts/` rather than embedding large code samples into `SKILL.md`.

- Notable repo conventions and patterns
  - Progressive disclosure: metadata (frontmatter) → SKILL.md body → bundled `references/` and `assets/`. Avoid moving large reference docs into SKILL.md; instead link to `references/` so Claude can load them on demand.
  - Packaging and validation scripts: skills often rely on internal scripts (`scripts/init_skill.py`, `scripts/package_skill.py`, `scripts/bundle-artifact.sh`). If you change a skill layout, update these scripts and any examples in SKILL.md that reference them.
  - Frontend artifact workflow: `artifacts-builder` scaffolds a Vite + React + Tailwind app and bundles with Parcel into a single inlined HTML artifact. Use `scripts/init-artifact.sh` then `scripts/bundle-artifact.sh` for build/bundle stages.
  - Python utilities: Several skills (e.g., `slack-gif-creator`) expose Python modules and recommend pip deps like `pillow` and `imageio`. Add or update `requirements.txt` in the skill folder when introducing new Python deps.

- Typical developer workflows (what to run)
  - Initialize an artifact project: `bash scripts/init-artifact.sh <name>` (from `artifacts-builder` folder).
  - Bundle artifact: `bash scripts/bundle-artifact.sh` (creates `bundle.html`).
  - Package a skill for distribution: `scripts/package_skill.py <path/to/skill>` (see `skill-creator` docs).
  - Install Python deps for a skill: add `requirements.txt` in the skill folder and run `pip install -r requirements.txt`.

- Files to inspect for changes and why
  - `SKILL.md` files: authoritative behavior and trigger metadata — small edits can change which skill is invoked.
  - `scripts/` directories: executable helpers and validators used at runtime or packaging time. Keep CLI contracts stable.
  - `assets/` and `references/`: large files loaded by Claude; only change when intent is clear.

- Examples to copy from
  - `artifacts-builder/SKILL.md` — canonical frontend scaffold & bundle flow.
  - `skill-creator/SKILL.md` — canonical SKILL.md style, progressive disclosure, and packaging instructions.
  - `slack-gif-creator/SKILL.md` — example of exposing Python helpers, validators, and usage examples. 
  
  # GitHub Copilot instructions

- Write functions with docstrings.
- Use async/await when required.
- Follow the repo’s naming conventions.


- Safety and content rules
  - Do not add private credentials or hard-coded API keys. If a skill needs external API access, document env var names and where to configure them (do not add secrets to the repo).
  - Keep licensing notes near the top of SKILL.md where present.

- When to open a PR vs push directly
  - Always open a PR for changes to existing skills, scripts, or packaging flows. Small README or docs typos can be pushed directly to non-protected branches only if allowed by repo policy.

If anything below is unclear or you want the instructions tailored to a specific skill or contributor flow (PR rules, CI, or testing), tell me which skill or file and I will iterate.