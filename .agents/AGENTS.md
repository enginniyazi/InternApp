> **Kural**: Tüm iletişimde Türkçe konuşulmalıdır.

# Project‑wide Rules (AGENTS)

## Core Enforcement

- **Every commit** must pass `npm run lint`, `npm run format:check` and `npm run check:reuse`.
- **CI pipeline** runs the same three commands; any failure blocks the merge.

## Safety Guarantees

- No lint warnings are allowed to be merged.
- No duplicate component implementations may exist.
- Components may **not** import from `src/pages` (enforced by ESLint + reuse‑check skill).
- Circular import dependencies are prohibited.

## File Editing Rules

- Existing files **MUST** be edited using `replace_file_content` or `multi_replace_file_content`.
- `write_to_file` with `Overwrite: true` is **ONLY** allowed for brand‑new files that do not yet exist.
- Overwriting an existing file from scratch is **PROHIBITED** — it risks silently dropping imports, comments, or logic.

## Documentation

- This file is the **single source of truth** for the above rules.
- All Antigravity agents (including sub‑agents) shall read this file before making any code‑changing decision.

## Reminder

If a rule is violated, the process will abort **automatically**; you will never see messages like “I forgot the rule”. The abort reason will be printed by the failing script.
