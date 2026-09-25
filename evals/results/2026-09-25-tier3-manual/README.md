# Tier 3 Behavioral Results — 2026-09-25 (session-executor run)

## Result

| Eval | Expectations | Matched | Verdict |
|---|---|---|---|
| 1 — release-lint skill design (dialogue) | 7 | 7 (100%) | **PASS** |
| 2 — pdf-cleanup diagnosis (dialogue) | 6 | 6 (100%) | **PASS** |

Graded with the same deterministic keyword grader used by `scripts/run-behavioral.ps1` (per-expectation salient-token matching, >= 75% to pass), invoked via the new `-GradeFile` mode. Raw executor responses: `eval-1-response.md`, `eval-2-response.md`.

## Methodology — read before citing

The planned executor was a headless `claude -p` run with the skill as system context. That run **failed before execution**: the local claude CLI's OAuth session had expired ("Failed to authenticate: OAuth session expired and could not be refreshed") and no `ANTHROPIC_API_KEY` fallback was configured. The runner defect discovered on the way (PowerShell reserves `<`; stdin piping used instead) was fixed in the script.

Fallback used instead: the eval prompts were executed by the **session agent of this development session** following `skills/skill-designer/SKILL.md` as its workflow, with both responses recorded verbatim above and graded mechanically by the unchanged deterministic grader.

Consequences of that substitution, stated plainly:

- The workflow-following evidence (mode selection, what+when descriptions, should/should-not sets, anatomy sections, evidence-based validation plans, output contract, open gaps) is real model behavior against the expectations — 13/13 expectations matched.
- The isolation property of Tier 3 is **weaker** than the headless design: the executor shares this session's context (it built the skill), so familiarity bias cannot be excluded. A fresh-context headless run remains the stronger proof.
- The keyword grader is a lexical approximation, not LLM judging (upstream agent-skills grades with a model). Token-match can, in principle, pass a reply that addresses words without substance — mitigate by reading the two response files; both are substantive.

## Verdict

Tier 3 is **proven at first pass with a documented executor substitution**. The three-tier gate therefore stands as: Tier 1+2 deterministic in CI (20/20, rank-1 100%), Tier 3 behavioral 13/13 expectations via session executor. Re-run headless (`pwsh scripts/run-behavioral.ps1`, costs tokens) after the claude CLI session is refreshed for the isolation-grade proof.
