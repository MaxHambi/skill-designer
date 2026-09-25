# skill-designer Evals & Benchmark

How this repository **proves** that skill-designer works: that it triggers when it should, stays distinct from sibling skills, and changes agent behavior the way it promises. The three-tier scheme is adapted from [addyosmani/agent-skills `evals/`](https://github.com/addyosmani/agent-skills/blob/main/evals/README.md), which adopts Anthropic skill-creator's `evals.json` schema for the behavioral tier; the Tier 2 trigger/collision extension is agent-skills' own addition. Here the framework is scaled to a single-skill repository with a peer-catalog fixture.

## The three tiers

| Tier | What it checks | Runner | Cost |
|---|---|---|---|
| **1. Structural** | Frontmatter contract, anatomy sections (Overview / When to Use / Common Rationalizations / Red Flags / Verification / Limitations), description ≤1024 chars, SKILL.md <500 lines, references exist, populated rationalizations + verification lists | `node scripts/run-evals.js` (Tier-1 section) | Free |
| **2. Trigger & routing** | Positive prompts rank skill-designer within their `top_k` (signature ask: rank 1); negative prompts rank their declared `owner` above skill-designer (pairwise, not vacuous); pairwise description-collision check (error ≥0.75, warn ≥0.50) | `node scripts/run-evals.js` (Tier-2 section) | Free |
| **3. Behavioral** | An agent following the skill satisfies the case's `expectations[]`, graded from the reply | `pwsh scripts/run-behavioral.ps1` | Tokens |

Tier 1+2 are deterministic and CI-safe (no network, no tokens). Tier 3 is on-demand only.

## Running

```bash
# Tier 1 + 2 — deterministic
node scripts/run-evals.js

# Tier 3 — behavioral, spends tokens
pwsh scripts/run-behavioral.ps1 -DryRun   # plan only
pwsh scripts/run-behavioral.ps1           # all dialogue evals
pwsh scripts/run-behavioral.ps1 -Id 1     # one eval
```

## Case format

`evals/cases/skill-designer.json` follows the agent-skills case schema:

- `trigger.positive[]` — realistic user phrasings (English and German, deliberately *not* copied from the description) with `top_k`; the first one is the signature ask with `top_k: 1`.
- `trigger.negative[]` — nearby prompts that belong to a different skill, each with an `owner` field. The runner asserts the owner **outranks** skill-designer, making each negative a real pairwise routing test. The peer descriptions ship as `peer_description_overrides` / script fixture — the actual frontmatter text of `using-skills`, `skill-writer`, `changelog-automation`, and `init-private` from the local library, so the ranking reflects real competitors, including the resolved skill-writer collision.
- `evals[]` — skill-creator schema (`id`, `kind`, `prompt`, `expected_output`, `expectations[]`). Both cases here are `kind: "dialogue"`: skill-designer's deliverable when designing (not registering) is the conversation itself — the closeout report. Expectations are verifiable behavior statements, graded against the reply.

A Tier-2 failure usually means *fix the description*, not the eval — that is exactly how the real routing fixes in this repo's history (domain-word precedence, German verbs `entwerfen`/`strukturieren`) were found and resolved.

## Benchmark: what counts as proven quality

The combined run is the quality gate. Passing means:

1. **Structural integrity (Tier 1):** the skill parses, carries all anatomy-mandatory sections, stays within context budgets, and every reference file exists. A regression here means the skill would fail its own standard.
2. **Routing correctness (Tier 2):** all positive phrasings rank skill-designer top-k (signature ask rank 1) against the real peer catalog; every negative prompt is outranked by its owner; no description near-collides with a sibling. This proves the description does the routing work — the property the skill itself teaches.
3. **Behavioral effect (Tier 3, on demand):** a fresh agent following the skill produces the output contract (Summary / Changes Made / Validation Results / Open Gaps), selects a mode, drafts anatomy-complete skills with bilingual trigger surfaces, states evidence-based validation plans, and admits open gaps — each expectation independently graded.

The documented history doubles as a live benchmark: the skill found and fixed its own false negative during first routing tests, and the anatomy-audit gap (rationalizations/red flags/verification missing in its own body) was caught and restructured — both as Tier-2/1 findings would.

## Metrics to watch

- **Trigger rank-1 rate** (positive prompts ranked first): currently 100% checked in; enforce with `node scripts/run-evals.js --min-rank1 95` for headroom. Never lower the floor to make a regression pass.
- **Max pairwise collision**: error at ≥0.75, warn at ≥0.50. Rising numbers mean descriptions drift toward each other.
- **Tier 3 expectation pass rate**: per-eval percentage; the runner fails below 75%.

## Adding cases

New phrasings from real usage go into `trigger.positive[]`/`negative[]` (paraphrase how users actually talk). New behavioral claims the skill makes go into `evals[].expectations[]`. A failing eval is a finding about the skill — resolve it in the skill, then check the eval back in as the regression proof.
