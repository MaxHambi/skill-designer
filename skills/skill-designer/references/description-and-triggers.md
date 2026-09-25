# Description and Triggers

The frontmatter `description` is the trigger surface: routing decisions happen on description level, before any body loads. A description defect cannot be repaired in the body.

## The what + when formula

- First sentence: what the skill does, third person, with domain, artifact, and action words.
- Then: one or more "Use when" conditions naming the user's likely nouns and verbs.
- Optional: "Not for" exclusions to cut false positives.
- Maximum 1024 characters; compact enough to scan.

## Precision rules

- Put domain, artifact, and action words in the first sentence.
- Avoid generic descriptions like "helps with productivity"; they over-trigger.
- Include major variants only if the skill really supports them.
- Keep the description compact enough to scan.

## Should-trigger set

Write 3-6 queries that should load the skill. Confirm the description contains the user's likely nouns and verbs for each.

Examples for a skill-authoring skill:

- "Create a new skill for PDF cleanup."
- "Update this skill to add a safer validation flow."
- "Turn these docs into a reusable agent workflow."

## Should-not-trigger set

Write 3-6 nearby queries that should not load the skill. Remove vague words that over-trigger.

Examples for a skill-authoring skill:

- "Explain what skills are at a high level."
- "Install an existing skill."
- "Run a one-off command that does not need a reusable workflow."

## i18n trigger surface

- Body in English; answer the user in their language.
- Add explicit trigger phrases in the user's languages (e.g. `Triggers (de): "..."`) because the routed index matches on description text.
- Keep trigger language generic across agent runtimes; do not encode runtime-specific invocation syntax.

## Anti-collision check (routing level)

1. List sibling skills covering the same domain (routed `list_skills`, or `ls` over the skills root).
2. Two skills must not collide on routing: no shared claim over the same trigger vocabulary. Resolve by narrowing the description vocabulary of the new skill, not by silently renaming the sibling.
3. Record residual overlap as an open gap in the closeout report.
4. Do not stack two meta-routers for the same domain; pick one canonical workflow and reference the other as upstream deep-dive.

## Case study: the skill-writer collision (resolved)

Real catalog case that shaped the rules above - treat it as the worked example when applying the anti-collision check:

- **Before:** `skill-writer` described itself as "Create and improve agent skills... Use when asked to create, write, or update skills" - a generic claim directly overlapping skill-designer's vocabulary, while its body still opened with "single canonical workflow". Two skills claimed the same routing surface.
- **Symptom:** generic skill-authoring requests had two plausible targets; neither description said which one wins. The stale body claim could not help: routing decides at description level before any body loads.
- **Resolution (description level, not body):** skill-writer's description was narrowed to "Upstream deep-dive reference for skill design... Use only when explicitly requested by name (skill-writer) or when editing skill-writer's own reference files. Not the default workflow for creating, building, structuring, or reviewing skills - skill-designer owns that." A one-sentence coexistence note replaced the stale canonical claim in the body. No skill was renamed.
- **Verification (three-way test against the routing index):** generic create request -> skill-designer (0.809; skill-writer not in top 3). Improve/restructure request -> skill-designer (0.748; skill-writer absent). Explicit-name request -> skill-writer (0.743; skill-designer only third). Post-resolution pairwise description similarity 0.412 - under the 0.50 warn line and now enforced by this repository's Tier-2 collision check.

Lessons generalized:

1. A body claim ("canonical workflow") cannot repair a description-level collision; fix the description.
2. Narrow one side's vocabulary instead of renaming either skill; stable names keep references working.
3. Verify with three queries: one generic variant per claimed surface plus one explicit-name query for the demoted skill.
4. Check the resolution into evals so drift (e.g. an upstream sync restoring the old description) fails CI instead of silently reintroducing the collision.

## Description checklist

- [ ] Starts with what (third person, domain + artifact + action).
- [ ] Contains "Use when" with concrete trigger conditions.
- [ ] Contains the user's likely nouns and verbs for all should-trigger queries.
- [ ] Vague words removed; exclusions present where needed.
- [ ] 1024 characters or fewer.
- [ ] No process-step summary that could substitute for the body.
- [ ] No vocabulary collision with a sibling skill's description.
