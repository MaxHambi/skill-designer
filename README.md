# skill-designer

A canonical workflow skill for **designing, authoring, and restructuring agent skills** — merging the process discipline of a layered skill-authoring path with the structural standard of a published skill-anatomy spec.

One workflow that turns a task, a docs page, or an existing skill into a skill that:

- **triggers on the right queries** and not on near-miss queries (validated against a real routing index),
- **carries a verifiable Definition of Done** inside the skill itself,
- **resists rationalization** (Common Rationalizations table + Red Flags),
- **stays context-efficient** (SKILL.md under 500 lines, references one level deep).

## Where it comes from

skill-designer merges two complementary sources into one canonical workflow:

| Layer | Source | What it contributes |
|-------|--------|---------------------|
| **Process** | [skill-writer](https://github.com/hyhmrright/logic-lens) lineage (local skill-writer skill) | Operations modes (`create`/`update`/`synthesize`/`iterate`), synthesis depth gates, iteration diagnosis from positive/negative/fix examples, trigger-set optimization, a 6-dimension depth rubric |
| **Standard** | [addyosmani/agent-skills — skill-anatomy](https://github.com/addyosmani/agent-skills/blob/main/docs/skill-anatomy.md) | Frontmatter contract (what + when, ≤1024 chars), recommended section flow with **Common Rationalizations**, **Red Flags**, evidence-based **Verification**, supporting-file rules, context efficiency, model neutrality ("write the procedure, not the workaround") |
| **Catalog layer** | [addyosmani/agent-skills — comparison](https://github.com/addyosmani/agent-skills/blob/main/docs/comparison.md) | Routing-collision checks between sibling skills, trigger-vocabulary validation against real user phrasings, the discipline that descriptions are the routing surface |

The two sources complement each other: skill-writer defines *how to work as a skill author*, skill-anatomy defines *what a finished skill must look like*. skill-designer fuses both and adds concrete validation mechanics (structural checks, live trigger tests against a hybrid routing index, registration with fallback).

## Structure

```
skills/
└── skill-designer/
    ├── SKILL.md                                  # Navigation layer: modes, 7-step workflow, output contract
    └── references/
        ├── anatomy-standard.md                   # The acceptance standard (frontmatter, sections, efficiency)
        ├── description-and-triggers.md           # Trigger surface design + anti-collision check
        ├── synthesis-and-iteration.md            # Source discipline + outcome-driven improvement
        ├── authoring-checklist.md                # Writing rules + copyable SKILL.md skeleton
        └── validation-and-registration.md        # Depth rubric + concrete checks + registration
```

## The workflow in one glance

1. **Resolve target and mode** — `create`, `update`, `synthesize`, or `iterate`; classify the skill; pick the smallest path.
2. **Synthesis** (when building from sources) — collect sources with provenance, run the coverage checklist, pass the depth gates before writing.
3. **Iteration first** (when improving from outcomes) — diagnose failures as triggering / routing / instruction / validation / overload; smallest patch that changes the outcome.
4. **Authoring** — imperative voice against the anatomy standard; no empty directories; model-neutral.
5. **Description & trigger optimization** — what + when formula, 3–6 should-trigger and 3–6 should-not-trigger queries.
6. **Catalog check** — no two skills collide on routing; resolve on description level.
7. **Validate & register** — structural checks, 6-dimension depth rubric, simulated dry run, index registration with fallback.

Every step has a concrete mechanic and an evidence-based Definition of Done. The skill validated itself live: during its first routing test, a false negative was found and fixed by a one-sentence description patch — the exact method Step 5 prescribes.

## Install

Copy the skill folder into your agent's skills directory:

```bash
# Generic (agents reading ~/.agents/skills)
cp -r skills/skill-designer ~/.agents/skills/

# Claude Code
cp -r skills/skill-designer ~/.claude/skills/
```

Then refresh your skill index so the router sees it (example for the local `routed` index):

```
scan_skills        # MCP tool, or:
routed scan
```

The skill's bilingual trigger surface (English + German) means it activates on phrases like *"Skill erstellen"*, *"Skill-Struktur überprüfen"*, *"design a new agent skill"*, or *"fix this skill's triggers"*.

## Validation mechanics shipped

- Structural: frontmatter parse check, description ≤1024 chars, SKILL.md <500 lines, referenced files exist.
- Quality: 6-dimension depth rubric (trigger precision, workflow completeness, safety boundaries, output determinism, validation strength, progressive disclosure) — pass/partial/fail.
- Behavioral: should-trigger and should-not-trigger query sets routed through the index, hits and misses documented.

## License

MIT — see [LICENSE](LICENSE).
