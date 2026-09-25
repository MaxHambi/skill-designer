# Validation and Registration

Post-authoring checks. Merge of skill-writer `evaluation-path.md` and `registration-validation.md` with concrete mechanics for this environment.

## Depth rubric

Score each dimension as pass, partial, or fail:

- **Trigger precision**: description distinguishes should-trigger from should-not-trigger queries.
- **Workflow completeness**: core task executable from the skill alone, no hidden context.
- **Safety and permission boundaries**: risky actions have prerequisites and explicit boundaries.
- **Output determinism**: required artifacts explicit (files, commands, reports).
- **Validation strength**: every verification checkbox has a proof mechanism.
- **Progressive disclosure**: SKILL.md is navigation; depth lives in references; one level deep.

Do not mark work complete while any dimension is partial or fail without explicit user acceptance.

## Structural checks (mechanics)

Run in PowerShell; adapt paths to the target skill:

```powershell
$skill = "$HOME\.agents\skills\<skill-name>"
# 1. Frontmatter present with name and description
Select-String -Path "$skill\SKILL.md" -Pattern '^(---\\r?\\nname: [a-z0-9-]+\\r?\\ndescription: .{20,})' -Multiline
# 2. Description length limit (must be 1024 or fewer)
$raw = Get-Content -Raw "$skill\SKILL.md"
if ($raw -match '(?s)description: (.+?)\r?\n[a-z-]+:') { ([string]$Matches[1]).Length }
# 3. SKILL.md line budget
(Get-Content "$skill\SKILL.md").Count
# 4. All referenced files exist
Select-String -Path "$skill\SKILL.md" -Pattern 'references/[a-z-]+\.md' |
  ForEach-Object { $_.Matches } | ForEach-Object { $_.Value } | Sort-Object -Unique |
  ForEach-Object { Test-Path (Join-Path $skill $_) }
```

Expected: check 1 matches, check 2 prints 1024 or fewer, check 3 prints fewer than 500, check 4 prints `True` for every reference.

## Trigger test

After index registration, validate routing with the routed MCP:

1. Run 3-6 should-trigger queries through `route_skill`; each must return the target skill or a sensible sibling.
2. Run 3-6 should-not-trigger queries; none must return the target skill.
3. Document hits and misses; on misses, patch the description first (routing decides at description level), then re-run.

## Registration

- Primary path (ADR-002): routed MCP `scan_skills` performs the index rebuild; run it after user confirmation since it is a manual index operation.
- Fallback when the MCP is unavailable: `pwsh -File <repo>\skills\using-skills\hooks\skills-sync.ps1` detects changes to the skills folders by snapshot diff and registers them.
- Last resort: manual `routed scan` from the CLI.

## Artifact checks

Confirm:

- `SKILL.md` frontmatter parses (name + description present).
- Referenced files exist.
- Provenance is present when external sources are used.
- The final response reports validation honestly.

## Simulation (dry run)

1. Read the skill as an agent would, top to bottom.
2. Simulate one realistic task through the core process.
3. Confirm the output contract is clear.
4. Check that validation is possible.
5. List residual gaps.

## Reject conditions

Do not mark the work complete if:

- Required references are missing.
- The skill cannot be followed without hidden context.
- A risky instruction lacks prerequisites.
- Validation failed and the failure is not explicitly accepted by the user.
- Any depth rubric dimension fails without explicit user acceptance.
