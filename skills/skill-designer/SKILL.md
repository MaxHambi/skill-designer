---
name: skill-designer
description: Design, author, and structure high-quality agent skills as reusable SKILL.md workflows. Use when creating a new skill, building a skill from docs or sources, restructuring an existing skill, fixing skill triggers, or reviewing skill quality. Triggers (de): "Skill erstellen", "Skill bauen", "Skill-Designer", "Skill verbessern", "Skill-Struktur". Takes precedence over domain skills when the request is to author a skill for any domain (e.g. "create a skill for release notes" routes here, not to a changelog skill). Not for installing existing skills or for one-off commands without a reusable workflow (skill-writer covers deep upstream references).
risk: safe
source: self
---

# Skill Designer

Design, author, and restructure agent skills to a single canonical standard: the process discipline of `skill-writer` (modes, synthesis gates, iteration, depth rubric) merged with the structural standard of the addyosmani agent-skills anatomy (frontmatter contract, section flow, anti-rationalization, context efficiency, model neutrality). skill-designer is the canonical local workflow; `skill-writer` remains the upstream deep-dive reference.

## Purpose

One workflow that turns a task, a docs page, or an existing skill into a skill that:

- triggers on the right queries and not on near-miss queries,
- carries a verifiable Definition of Done in the skill itself,
- resists rationalization (Common Rationalizations table + Red Flags),
- stays context-efficient (SKILL.md under 500 lines, references one level deep).

## Step 1 - Resolve target and mode

1. Resolve the target path and intended operation.
2. Classify the skill class: `workflow-process`, `integration-documentation`, `security-review`, `skill-authoring`, `generic`.
3. Select the mode from the table below. Pick the smallest path that satisfies the request; state explicit assumptions instead of asking when class and depth are inferable, ask exactly one question when they are not.

| Mode | Use when | Read next |
|------|----------|-----------|
| `create` | new skill folder | `references/authoring-checklist.md`, then `references/description-and-triggers.md` |
| `update` | revise existing skill, same purpose | `references/authoring-checklist.md`, then `references/validation-and-registration.md` |
| `synthesize` | build from external docs, local files, or multiple sources | `references/synthesis-and-iteration.md`, then `references/authoring-checklist.md` |
| `iterate` | improve from outcomes, traces, feedback, or examples | `references/synthesis-and-iteration.md`, then `references/authoring-checklist.md` |

## Step 2 - Synthesis (modes `synthesize` and `create` from sources)

1. Collect local sources first, then primary external sources; record provenance (name or URL) for each adapted source.
2. Separate facts from assumptions; list unresolved gaps as explicit assumptions.
3. Run the coverage checklist in `references/synthesis-and-iteration.md`.
4. Do not move to authoring until the depth gates pass: the core task must be executable from the skill alone, risky actions need prerequisites, external sources credited.

## Step 3 - Iteration first (mode `iterate`)

1. Gather positive, negative, and fix examples with provenance; anonymize before storing.
2. Diagnose each failure: triggering, routing, instruction gap, validation gap, or overload.
3. Make the smallest instruction change that would have changed the outcome; retest against one positive and one negative example.

## Step 4 - Authoring against the anatomy standard

Read `references/authoring-checklist.md` and `references/anatomy-standard.md`.

1. Write or update `SKILL.md` in imperative voice against the frontmatter contract and section flow in `references/anatomy-standard.md`.
2. Add `references/` only when optional detail would bloat SKILL.md; add `scripts/` only for deterministic repeated actions; never create empty directories.
3. For authoring or generator skills, include transformed examples: happy path, secure/robust variant, anti-pattern with corrected version.
4. Check model neutrality: no step that can only be justified by naming a model, version, or one runtime's private tool name.

## Step 5 - Description and trigger optimization

Read `references/description-and-triggers.md`.

1. Write the description as what + when; routing decisions happen on description level before any body loads, so vocabulary conflicts with sibling skills must be resolved in the description itself.
2. Validate 3-6 should-trigger and 3-6 should-not-trigger queries; edit the description to reduce false positives and false negatives.
3. Check for routing collisions with sibling skills before finishing.

## Step 6 - Catalog check

1. List sibling skills and compare trigger vocabulary (routed `list_skills`, or `ls` over the skills root).
2. Two skills must not collide on routing: no shared claim over the same trigger vocabulary; resolve by narrowing the description, not the body.
3. Record residual overlap as an open gap in the closeout report instead of silently renaming another skill.

## Step 7 - Validate and register

Read `references/validation-and-registration.md`.

1. Run the structural checks (frontmatter, length limits, reference existence) and the depth rubric (6 dimensions, pass/partial/fail).
2. Simulate one realistic task as a dry run; confirm the output contract is clear and validation is possible.
3. Register the skill in the index (routed `scan_skills` after user confirmation; fallback `skills-sync.ps1`).
4. Reject shallow outputs that fail depth gates or artifact checks; report validation honestly.

## Output format

Return:

1. `Summary`
2. `Changes Made`
3. `Validation Results`
4. `Open Gaps`

## When to Use

- Creating a new skill from a task, workflow, docs page, or set of sources.
- Restructuring an existing skill that lacks verification, rationalization guards, or trigger precision.
- Diagnosing why a skill misfires (triggers too often, not often enough, or routes wrong).
- Reviewing a skill against the anatomy standard.

## Limitations

- skill-designer designs and authors skills; it does not install, index, or run other skills beyond the registration step.
- Quantitative baseline-vs-with-skill evaluation is opt-in and out of scope by default; the lightweight check is the default.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
