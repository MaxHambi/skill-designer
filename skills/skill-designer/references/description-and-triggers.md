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

## Description checklist

- [ ] Starts with what (third person, domain + artifact + action).
- [ ] Contains "Use when" with concrete trigger conditions.
- [ ] Contains the user's likely nouns and verbs for all should-trigger queries.
- [ ] Vague words removed; exclusions present where needed.
- [ ] 1024 characters or fewer.
- [ ] No process-step summary that could substitute for the body.
- [ ] No vocabulary collision with a sibling skill's description.
