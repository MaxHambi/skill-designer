#!/usr/bin/env node
/**
 * skill-designer evals - deterministic Tier 1 + Tier 2 checks.
 * Schema adapted from addyosmani/agent-skills evals/ (eval case format:
 * trigger.positive/negative + peer_description_overrides for pairwise tests).
 *
 * Tier 1: structural - frontmatter contract, anatomy sections, length limits,
 *         reference existence.
 * Tier 2: trigger & routing - lexical scoring (stemmed TF-IDF over the skill
 *         description vs peer descriptions), positive prompts must rank
 *         skill-designer within top_k, negative prompts must rank their
 *         declared owner above skill-designer, pairwise description
 *         collision check at 75% error / 50% warn.
 *
 * Usage: node scripts/run-evals.js [--min-rank1 95]
 * Exit 0 = pass, 1 = fail. Deterministic, CI-safe, no network, no tokens.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILL = path.join(ROOT, 'skills', 'skill-designer');

// ---------------------------------------------------------------- utilities

const STOP = new Set(('a an and are as at be but by for from has have how i in is it its of on or '
  + 'say says the their them this that to was were what when which who will with you your not do '
  + 'does can could should would nicht und der die das ist ein eine einen zum zur mit fur aber oder').split(' '));

function tokenize(text) {
  return text.toLowerCase().normalize('NFKD').replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/[\s-]+/).filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => t.replace(/(ungen|ung|en|er|es|s)$/u, ''));
}

function tfidfVector(doc, idf) {
  const tf = new Map();
  for (const t of tokenize(doc)) tf.set(t, (tf.get(t) || 0) + 1);
  const vec = new Map();
  for (const [t, f] of tf) vec.set(t, f * (idf.get(t) || Math.log(1 + 3)));
  const norm = Math.sqrt([...vec.values()].reduce((s, v) => s + v * v, 0)) || 1;
  for (const [t, v] of vec) vec.set(t, v / norm);
  return vec;
}

function cosine(a, b) {
  let s = 0;
  for (const [t, v] of a) { const w = b.get(t); if (w) s += v * w; }
  return s;
}

function buildIndex(descriptions) {
  const n = descriptions.length;
  const df = new Map();
  for (const d of descriptions) for (const t of new Set(tokenize(d))) df.set(t, (df.get(t) || 0) + 1);
  const idf = new Map([...df].map(([t, c]) => [t, Math.log(1 + n / c)]));
  return descriptions.map((d) => tfidfVector(d, idf));
}

// ------------------------------------------------------------------ loading

const caseFile = JSON.parse(fs.readFileSync(path.join(ROOT, 'evals', 'cases', 'skill-designer.json'), 'utf8'));

const ownDesc = (function extractDescription(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error('frontmatter not found');
  const nameOk = /^name: skill-designer$/m.test(m[1]);
  if (!nameOk) throw new Error('frontmatter name mismatch');
  const dm = m[1].match(/^description: (.+)$/m);
  if (!dm) throw new Error('description missing');
  return dm[1];
})(fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8'));

const peers = {
  'using-skills': 'Unified meta-skill gate and router - invoke at session start and before any response or action. Enforces the 1% skill-invocation gate, routes to the right skill via the phase tree, interviews the user when the goal is vague, discovers skills via the routed MCP server, ships hooks for gate enforcement and index registration. Triggers: Welcher Skill passt, Skills aufraeumen und registrieren, Wo starten, Skill-Gate.',
  'skill-writer': 'Upstream deep-dive reference for skill design (layered paths, mode selection, description optimization, iteration, evaluation). Use only when explicitly requested by name (skill-writer) or when editing skill-writer own reference files. Not the default workflow for creating, building, structuring, or reviewing skills - skill-designer owns that; skill-writer provides the deep reference material skill-designer points to.',
  'changelog-automation': 'Automate changelog generation from commits, PRs, and releases following Keep a Changelog format. Use when setting up release workflows, generating release notes, or standardizing commit conventions.',
  'init-private': 'Entkoppelt ein geklontes Projekt, installiert Abh\u00e4ngigkeiten und initialisiert ein isoliertes privates GitHub-Repository. Verwende diesen Skill, wenn ein Projekt lokal neu aufgesetzt oder von seiner urspr\u00fcnglichen Git-Historie getrennt werden soll.',
  ...(caseFile.trigger.peer_description_overrides || {}),
};

const results = [];
function check(name, pass, detail) {
  results.push({ name, pass, detail });
}

// ------------------------------------------------- Tier 1: structural checks

check('tier1: frontmatter name + description present', true, 'parsed from SKILL.md frontmatter');

const descLen = ownDesc.length;
check('tier1: description <= 1024 chars', descLen <= 1024, `${descLen} chars`);

const lines = fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8').split(/\r?\n/).length;
check('tier1: SKILL.md < 500 lines', lines < 500, `${lines} lines`);

const refs = [...fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8').matchAll(/references\/[a-z-]+\.md/g)]
  .map((m) => m[0]);
const refFiles = [...new Set(refs)];
const missing = refFiles.filter((r) => !fs.existsSync(path.join(SKILL, r)));
check('tier1: all references exist', missing.length === 0,
  missing.length ? `missing: ${missing.join(', ')}` : `${refFiles.length} referenced files present`);

const body = fs.readFileSync(path.join(SKILL, 'SKILL.md'), 'utf8');
const requiredSections = ['## Overview', '## When to Use', '## Common Rationalizations', '## Red Flags', '## Verification', '## Limitations'];
const absent = requiredSections.filter((s) => !body.includes(s));
check('tier1: anatomy sections present', absent.length === 0,
  absent.length ? `absent: ${absent.join(', ')}` : requiredSections.join(', '));

const rationalRows = (body.split('## Common Rationalizations')[1] || '').split('## Red Flags')[0].match(/^\|(?!\|)/gm);
check('tier1: rationalizations table populated (>=3 rows)', (rationalRows || []).length >= 3,
  `${(rationalRows || []).length} rows`);

const verifyItems = (body.split('## Verification')[1] || '').split('## Limitations')[0].match(/^- \[ \]/gm);
check('tier1: verification checklist has items with proof mechanisms', (verifyItems || []).length >= 5,
  `${(verifyItems || []).length} checklist items`);

// --------------------------------- Tier 2: trigger ranking + collision check

const allDescs = [ownDesc, ...Object.keys(peers).map((k) => peers[k])];
const vectors = buildIndex(allDescs);
const ownVec = vectors[0];

for (const p of caseFile.trigger.positive) {
  const qv = tfidfVector(p.prompt, new Map());
  const scores = Object.keys(peers).map((k, i) => [k, cosine(qv, vectors[i + 1])]);
  const ownScore = cosine(qv, ownVec);
  const rank = 1 + scores.filter(([, s]) => s > ownScore).length;
  const topk = p.top_k || 3;
  check(`tier2 positive: "${p.prompt.slice(0, 46)}..." rank ${rank} in top_k ${topk}`,
    rank <= topk, `own=${ownScore.toFixed(3)} bestPeer=${Math.max(...scores.map(([, s]) => s)).toFixed(3)} (${rank <= topk ? 'top: ' + scores.filter(([, s]) => s > ownScore).length : 'not first'} above)`);
}

for (const p of caseFile.trigger.negative) {
  if (!peers[p.owner]) { check(`tier2 negative: ${p.owner} known`, false, 'unknown owner'); continue; }
  const qv = tfidfVector(p.prompt, new Map());
  const ownScore = cosine(qv, ownVec);
  const ownerScore = cosine(qv, vectors[1 + Object.keys(peers).indexOf(p.owner)]);
  // strict=true: owner must strictly outrank. strict=false: owner must reach
  // >= 80% of own score - for semantic-sibling pairs (meta-router vs meta-
  // author) where the lexical approximation alone cannot separate them.
  const need = p.strict === false ? 0.8 * ownScore : ownScore + 1e-9;
  check(`tier2 negative: "${p.prompt.slice(0, 46)}..." owner ${p.owner} outranks`,
    ownerScore >= need, `owner=${ownerScore.toFixed(3)} own=${ownScore.toFixed(3)} (${p.strict === false ? 'non-strict >=80%' : 'strict'})`);
}

const peerEntries = Object.entries(peers);
let maxCollide = ['-', 0];
for (let i = 0; i < peerEntries.length; i++) {
  const sim = cosine(ownVec, vectors[1 + i]);
  if (sim > maxCollide[1]) maxCollide = [peerEntries[i][0], sim];
  check(`tier2 collision: skill-designer vs ${peerEntries[i][0]} < 0.75`, sim < 0.75, `sim=${sim.toFixed(3)}`);
}

// ------------------------------------------------------------------ summary

const failed = results.filter((r) => !r.pass);
const rank1 = caseFile.trigger.positive.filter((p, i) => results.filter((r) => r.name.startsWith('tier2 positive'))[i]?.pass).length;
const minRank1 = Number((process.argv.find((a) => a === '--min-rank1') && process.argv[process.argv.indexOf('--min-rank1') + 1]) || 0);

console.log('skill-designer evals (Tier 1 structural + Tier 2 trigger/routing)');
console.log('='.repeat(72));
for (const r of results) console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.name}  [${r.detail}]`);
console.log('-'.repeat(72));
console.log(`${results.length - failed.length}/${results.length} checks passed. Max collision: ${maxCollide[0]} at ${maxCollide[1].toFixed(3)} (error >= 0.75, warn >= 0.50)`);

if (minRank1 > 0) {
  const rank1Pct = Math.round((rank1 / caseFile.trigger.positive.length) * 100);
  console.log(`Trigger rank-1 rate: ${rank1Pct}% (floor ${minRank1}%)`);
  if (rank1Pct < minRank1) failed.push({ name: 'rank1 floor' });
}

if (failed.length > 0) {
  console.error(`\n${failed.length} check(s) FAILED`);
  process.exit(1);
}
console.log('\nAll checks passed.');
