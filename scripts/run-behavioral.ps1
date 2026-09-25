#!/usr/bin/env pwsh
# skill-designer Tier 3 behavioral eval runner.
# Follows the agent-skills behavioral tier: each eval in evals/cases/skill-designer.json
# is run through headless claude, the reply is graded against the case's
# expectations[] with a deterministic keyword grader. Runs on demand
# (spends tokens), never in CI.
#
# Usage:
#   pwsh scripts/run-behavioral.ps1              # all dialogue evals
#   pwsh scripts/run-behavioral.ps1 -Id 1        # one eval
#   pwsh scripts/run-behavioral.ps1 -DryRun      # print plan only
[CmdletBinding()]
param(
  [int]$Id = 0,
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$casePath = Join-Path $root 'evals\cases\skill-designer.json'
$case = Get-Content $casePath -Raw | ConvertFrom-Json

$evals = @($case.evals)
if ($Id -gt 0) { $evals = @($evals | Where-Object { $_.id -eq $Id }) }

Write-Host "Tier 3 behavioral evals for skill-designer ($($evals.Count) case(s), kind=$($evals[0].kind))"
if ($DryRun) {
  foreach ($e in $evals) {
    Write-Host ("  plan: eval {0} - {1} expectations - prompt: {2}..." -f $e.id, $e.expectations.Count, $e.prompt.Substring(0, 60))
  }
  Write-Host 'Dry run only; no tokens spent.'
  exit 0
}

$exitCode = 0
foreach ($e in $evals) {
  Write-Host "`n=== Eval $($e.id) ==="
  $tmp = New-Item -ItemType File -Path (Join-Path $env:TEMP "sd-eval-$($e.id)-$PID.md") -Force
  try {
    # Headless run: the skill is provided as system prompt context, reply to a file.
    $skillBody = Get-Content (Join-Path $root 'skills\skill-designer\SKILL.md') -Raw
    $prompt = "Follow this skill workflow exactly:`n`n$skillBody`n`nTask:`n$($e.prompt)"
    claude -p $prompt --output-format text > $tmp.FullName
    if ($LASTEXITCODE -ne 0) { throw "claude CLI exited with $LASTEXITCODE" }
    $reply = Get-Content $tmp.FullName -Raw

    # Deterministic keyword grader: each expectation is graded by its salient
    # tokens appearing in the reply (transcript-based grading approximation).
    $passed = 0; $total = 0
    foreach ($exp in $e.expectations) {
      $total++
      $tokens = ($exp -split '\s+' |
        Where-Object { $_.Length -gt 4 -and $_ -notmatch '^(the|a|an|and|or|of|to|in|is|are|with|for|not|its|that|this)$' } |
        Select-Object -First 6 | ForEach-Object { [regex]::Escape($_.Trim('.,;:()')) })
      $pattern = ($tokens -join '|')
      if ($pattern -and ($reply -match $pattern)) { $passed++ }
      else { Write-Host "  MISS: $($exp.Substring(0, [Math]::Min(90, $exp.Length)))..." }
    }
    $pct = [Math]::Round(100 * $passed / $total)
    $verdict = if ($pct -ge 75) { 'PASS' } else { $exitCode = 1; 'FAIL' }
    Write-Host ("Eval {0}: {1} - {2}/{3} expectations matched ({4}%)" -f $e.id, $verdict, $passed, $total, $pct)
  }
  finally {
    Remove-Item $tmp.FullName -ErrorAction SilentlyContinue
  }
}

if ($exitCode -ne 0) { Write-Error 'One or more behavioral evals failed.' }
exit $exitCode
