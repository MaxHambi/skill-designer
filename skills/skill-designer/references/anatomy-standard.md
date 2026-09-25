# Anatomy Standard

The acceptance standard every skill produced or revised by this workflow must meet. Source: addyosmani agent-skills docs (`skill-anatomy.md`), adapted.

## Frontmatter contract (required)

```yaml
---
name: skill-name-with-hyphens
description: Guides agents through [task/workflow]. Use when [specific trigger conditions].
---
```

- `name`: lowercase, hyphen-separated, must match the directory name.
- `description`: starts with what the skill does in third person, then includes one or more clear "Use when" trigger conditions. Include both *what* and *when*. Maximum 1024 characters.
- Do not summarize the workflow in the description: if the description contains process steps, the agent may follow the summary instead of reading the skill.
- Routing decisions happen on description level before any body loads; vocabulary conflicts with sibling skills must be resolved here, not in the body.

## Recommended section flow

Recommended pattern, not a rigid template; equivalent headings are acceptable when they serve the same purpose clearly.

1. `# Title` + one-two sentence overview: what the skill does and why an agent should follow it.
2. `## When to Use`: positive triggers (symptoms, task types) and negative exclusions ("NOT for Y").
3. `## Core Process`: the numbered workflow the agent follows. Specific and actionable, not vague advice. Good: "Run `npm test` and verify all tests pass". Bad: "Make sure the tests work".
4. `## [Specific Techniques/Patterns]`: detailed guidance for specific scenarios; code examples, templates, configuration.
5. `## Common Rationalizations`: the excuses agents use to skip steps, each paired with a factual rebuttal.
6. `## Red Flags`: observable behavioral patterns indicating the skill is being violated; useful for review and self-monitoring.
7. `## Verification`: exit criteria as a checklist where every checkbox is verifiable with evidence (test output, build result, command output).

## Section purposes

- **Overview**: the elevator pitch; answers what and why.
- **When to Use**: helps agents and humans decide applicability; include exclusions.
- **Core Process**: the heart; must be executable without hidden context.
- **Common Rationalizations**: the most distinctive feature of well-crafted skills. Think of every time an agent said "I'll add tests later" or "this is simple enough to skip the spec" - those go here with a counter-argument.
- **Red Flags**: signs the process was skipped; checkable during review.
- **Verification**: evidence-based Definition of Done; a checkbox without a proof mechanism is a failed criterion.

## Supporting files

Create supporting files only when:

- Reference material exceeds 100 lines (keep the main SKILL.md focused).
- Code tools or scripts are needed.
- Checklists are long enough to justify separate files.

Keep patterns and principles inline when under 50 lines. Never create an empty `scripts/` directory just to mirror other skills. Keep file references one level deep: link directly from SKILL.md to supporting files, no chaining through intermediate documents.

## Context efficiency

Skills load on demand: only name and description sit in context at startup; the full SKILL.md loads only when relevant. To keep that load cheap:

- Keep `SKILL.md` under 500 lines.
- Write specific descriptions (precise activation, clean skip).
- Use progressive disclosure: supporting files load only when the workflow reaches them.
- Prefer scripts over inline code: executing consumes no context, only output does; inline code blocks are paid for on every load.
- Token-conscious: every section must justify its inclusion; if removing it wouldn't change agent behavior, remove it.

## Model neutrality: write the procedure, not the workaround

Skills run on many agents and model generations. A step that exists because one model gets a specific call wrong is a liability on every other model: it constrains agents that would have solved the task directly, and cross-model transfer measurements show skills authored against one model's execution failures can leave a stronger model performing worse than with no skill at all.

The rule: if a step cannot be justified without naming a model, a model version, or one agent's private tool name, it belongs in an issue, not in a skill. Describe the capability ("run the focused test command"), not the mechanism one runtime happens to expose.

Two smells to check before proposing skill content:

- **Over-specified mechanics**: prescribing an exact command form or serialization detail where stating the goal alone would do; justification "model X gets this wrong otherwise" = workaround, not procedure.
- **Fragmented diagnostics**: a multi-step inspection sequence where one step would confirm the same thing; every extra step spends turns.

## Naming conventions

- Skill directories: `lowercase-hyphen-separated`
- Skill files: `SKILL.md` (always uppercase)
- Supporting files: `lowercase-hyphen-separated.md`
- Material used by exactly one skill stays inside that skill's directory; shared material belongs in a shared references location.

## Cross-skill references

Reference other skills by name, do not duplicate content between skills:

```markdown
Follow the `test-driven-development` skill for writing tests.
If the build breaks, use the `debugging-and-error-recovery` skill.
```
