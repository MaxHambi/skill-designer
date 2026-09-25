# Authoring Checklist

The combined writing rules from skill-writer (`authoring-path.md`, `design-principles.md`) and the addyosmani anatomy, applied while editing skill files.

## Writing rules

- Imperative voice: tell the agent what to do.
- Trigger language lives in the frontmatter description, not only in the body.
- SKILL.md is a navigation layer when the skill has many modes; optional depth, examples, rubrics, and tool-specific details go into references.
- Prefer checklists, tables, and short decision rules over long essays.
- Do not duplicate the same rule in SKILL.md and references unless it is a safety-critical reminder.
- Include only files the agent may actually load during work.
- Add detail where mistakes are costly, repeated, or hard to detect; compress where the model already has general knowledge.
- Make every required artifact explicit: files, commands, reports, comments, commits, or validation outputs.
- Label risky, destructive, credential-handling, financial, medical, legal, or security guidance clearly; preserve source provenance when adapting external content.
- Prefer small, scoped updates over rewrites; preserve existing naming conventions.
- Keep examples copy-pasteable when commands are included.
- Avoid unsafe install, credential, or destructive command guidance unless prerequisites and warnings are explicit.

## SKILL.md skeleton (copyable)

```markdown
---
name: skill-name-with-hyphens
description: Guides agents through [task]. Use when [trigger conditions]. Not for [exclusions].
---

# Skill Title

One-two sentences: what this skill does and why an agent should follow it.

## When to Use

- Trigger conditions (symptoms, task types)
- When NOT to use (exclusions)

## Core Process

1. Step with concrete action and expected artifact.
2. Step with concrete action and expected artifact.
3. Step with concrete action and expected artifact.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| Excuse agents use to skip a step | Why the excuse is wrong |

## Red Flags

- Observable sign the process is being violated

## Verification

- [ ] Exit criterion with a proof mechanism (command, output, artifact)
- [ ] Exit criterion with a proof mechanism

## Limitations

- Scope boundary and environment caveats
```

## Example transformations (for authoring/generator skills)

Include transformed examples in references when the skill being designed itself generates artifacts:

- happy-path example,
- secure/robust variant,
- anti-pattern plus corrected version.

## Editing rules

- Prefer small, scoped updates over rewrites.
- Preserve existing naming conventions.
- Never create empty directories; add `scripts/` only when deterministic execution is useful and safer than rewriting code each time.
