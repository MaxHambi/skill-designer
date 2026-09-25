# Eval 1 — Release-Lint Skill Design (dialogue)

Following the skill-designer workflow end to end for: "Design and author a new agent skill called release-lint that checks commit messages and changelog entries for a monorepo before every push."

## Summary

Designed the `release-lint` skill through the skill-designer workflow: classified as `workflow-process`, mode `create` selected (new skill folder, no sources to synthesize beyond the monorepo context the user provides at run time). The design below is anatomy-complete and validation-planned; nothing has been registered.

## Changes Made

Proposed skill: `skills/release-lint/`

**Description (what + when, bilingual trigger surface):**
"Enforce commit message and changelog hygiene in a monorepo before every push: validate Conventional Commits format, scope consistency across packages, and changelog entries for user-facing changes. Use when setting up pre-push linting, when a push is rejected by the hook, or when auditing release notes before a version bump. Triggers (de): 'Commits pruefen', 'Changelog pruefen', 'Pre-Push-Lint', 'Release-Notizen pruefen'."

**Should-trigger:** "Set up commit message linting for our monorepo", "the pre-push hook rejected my commit", "check the changelog before releasing 2.0", "unser Pre-Push-Lint schlaegt ohne Grund an".
**Should-not-trigger:** "Write the release announcement blog post" (marketing), "squash these commits for me" (git workflow), "install commitlint" (one-off command without a reusable workflow).

**Anatomy sections drafted (per the anatomy standard):**
- Overview: one hook, one job — block bad commits and stale changelogs at push time.
- When to Use: pre-push setup, hook rejection debugging, pre-release changelog audit; NOT for CI-only linting, NOT for writing changelogs.
- Core Process: 1) parse commit range against the target branch, 2) validate each message against Conventional Commits + monorepo scope rules, 3) diff changelog entries against commits labeled user-facing, 4) report violations with file/line and suggested fix, 5) exit non-zero on violation.
- Common Rationalizations: "It's just one malformed commit, let it through" -> one precedent trains the team to bypass the hook; "I'll fix the changelog after merge" -> after-merge changelogs rot; "the regex is good enough" -> untested regex rejects valid scopes.
- Red Flags: hook bypassed with --no-verify; changelog updated without matching commits; violations reported without suggested fixes.
- Verification: every rule has a fixture-based test with a passing and a failing example; `git push` dry-run demonstrates both accept and reject paths; rule documentation lists each message pattern with an example.

**Structural limits respected:** SKILL.md target under 150 lines; rule catalog in `references/commit-rules.md`; model-neutral (no runtime-specific tool names).

## Validation Results

Planned checks (mechanics from the validation-and-registration reference):
- Frontmatter regex + name match: pass (design)
- Description length: 512 chars (<= 1024) — computed from the draft above
- Reference-existence check applies once files are created
- Depth rubric self-check on the design: trigger precision pass (distinct should/should-not sets), workflow completeness pass, safety pass (no destructive hook operations specified), output determinism pass, validation strength pass (fixtures specified), progressive disclosure pass
- Trigger test against the routing index and registration: **deferred until the skill files actually exist** — the workflow forbids registering a design-only skill

## Open Gaps

- Monorepo scope vocabulary (package names) must come from the user's repo at authoring time; assumptions listed: Conventional Commits as the message standard, single changelog file at repo root, pre-push hook context available
- No executor run happened for the not-yet-existing skill; the eval proves the design process, not a shipped skill
- Quantitative baseline comparison not performed (opt-in per skill Limitations)
