# Eval 2 — PDF-Cleanup Diagnosis (dialogue)

Following the skill-designer workflow for: "An existing skill called pdf-cleanup has a 900-line SKILL.md, no verification section, no trigger sets, and its description says 'helps with productivity'. Diagnose what is wrong with it and propose the smallest set of fixes."

## Summary

Diagnosed `pdf-cleanup` in iteration vocabulary and proposed the smallest scoped fix set. Mode: `iterate` (existing skill, diagnosis from observable defects). All four defects trace to description-level and structure-level gaps; no rewrite of unrelated content required.

## Changes Made

**Diagnosis (iteration-path vocabulary):**

1. **Context-efficiency violation** — 900 lines against the 500-line budget. Root cause: reference material (command catalogs, edge-case tables, examples) inlined into SKILL.md instead of progressive disclosure. Cost: the whole skill is paid for on every load, and navigation drowns in detail.
2. **Validation gap** — no Verification section, so completion is unfalsifiable. There is no evidence mechanism; "looks done" is the only exit criterion.
3. **Trigger defect (description)** — "helps with productivity" is a vague over-trigger: it matches almost any request and carries none of the user's actual nouns (PDF, merge, compress, extract text). Routing decides at description level; this description cannot win the queries it should win or lose the ones it should not.
4. **Guard gap** — no Common Rationalizations and no Red Flags, so agents can rationalize past any future rules the skill gains.

**Smallest fix set (minimal patches, scoped):**

1. Extract detail into `references/` (commands + examples -> `references/command-catalog.md`; edge cases -> `references/edge-cases.md`); leave SKILL.md as a ~100-line navigation layer. One level deep, no empty directories.
2. Add a Verification section with evidence-based criteria: "frontmatter regex check passes", "description length <= 1024 (documented output)", "SKILL.md < 500 lines (line count)", "every referenced file exists (path check)", "3-6 should-trigger and 3-6 should-not-trigger queries tested against the index, results documented".
3. Rewrite the description in what+when form with the user's nouns: "Clean up PDF files: merge, split, compress, and extract text while preserving structure. Use when a user handss you PDFs to combine or shrink, asks to pull pages or text out, or reports a broken PDF workflow. Not for image editing or Office document conversion. Triggers (de): 'PDFs zusammenfuehren', 'PDF komprimieren', 'Text aus PDF'." (what + when + not-for + bilingual triggers)
4. Add should-trigger set ("merge these three invoices into one PDF", "this PDF is too large to email", "extract the table from page 4") and should-not-trigger set ("convert this PDF to Word" — conversion is excluded above; "tag the scanned documents" — different domain), then run the routing test and the catalog-collision check against sibling document skills.
5. Add a compact Common Rationalizations table (3 rows) and a 4-item Red Flags list — new only where the restructure exposes a skip-risk (e.g. "the output looks fine, skip the page-count check" -> visual inspection misses dropped pages).

Not doing: renaming the skill, touching its scripts, reordering unrelated sections, rewriting the body's working steps — the diagnosis ties every change to one of the four defects.

## Validation Results

- The fix set is checkable: after applying, each Tier-1 check from the validation reference must pass (structure, length, references) — the 900-line defect is measurable before and after.
- The trigger fix is checkable: the should/should-not sets must route correctly against the index (the same mechanism that caught this repository's own false negative).
- Rubric on the proposal: trigger precision pass, workflow completeness pass, safety pass (no destructive operations), output determinism pass, validation strength pass (evidence named per criterion), progressive disclosure pass.
- Not executed against the real pdf-cleanup skill (it lives outside this repository); this eval proves the diagnostic process.

## Open Gaps

- The real pdf-cleanup skill was not modified here; applying and verifying the fix set against the actual skill remains follow-up work.
- The exact split of the 900 lines into references needs the real file; the split above is the pattern, not the final placement.
- Residual routing-overlap risk with sibling document-handling skills can only be checked against the live catalog.
