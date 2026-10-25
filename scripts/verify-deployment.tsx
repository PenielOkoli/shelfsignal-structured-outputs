import React from 'react';
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { decodePlan } from '../src/lib/schema';
import { PlanContent } from '../src/components/plan-view';

async function main() {
  const base = process.argv[2] || 'https://shelfsignal-structured-outputs.vercel.app';
  const evidence: Record<string, unknown> = { checkedAt: new Date().toISOString(), url: base, checks: [] };
  const checks = evidence.checks as Record<string, unknown>[];
  for (const path of ['/', '/guide', '/schema']) {
    const response = await fetch(base + path);
    const html = await response.text();
    assert.equal(response.status, 200, path);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    if (path === '/') assert.match(html, /DELIVERABLE 04/);
    if (path === '/schema') assert.match(html, /machine-readable contract/);
    checks.push({ path, status: response.status, securityHeader: 'nosniff' });
  }
  const cases = [
    { name: 'invalid input', body: JSON.stringify({ brief: 'short', locale: 'en-NG' }), status: 400 },
    { name: 'malformed JSON', body: '{', status: 400 },
    { name: 'wrong media type', body: '{}', type: 'text/plain', status: 415 },
    { name: 'oversized body', body: JSON.stringify({ brief: 'x'.repeat(9000) }), status: 413 },
    { name: 'foreign origin', body: '{}', origin: 'https://example.org', status: 403 },
  ];
  for (const item of cases) {
    const response = await fetch(base + '/api/plan', { method: 'POST', headers: { 'Content-Type': item.type || 'application/json', Origin: item.origin || base }, body: item.body });
    assert.equal(response.status, item.status, item.name);
    checks.push({ name: item.name, status: response.status });
  }
  if (process.argv.includes('--live')) {
    for (const locale of ['en-NG', 'en-GB'] as const) {
      const response = await fetch(base + '/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: base }, body: JSON.stringify({ brief: 'Create a welcoming weekend display using mugs, totes and notebooks. Use only the sample catalog and practical display suggestions.', locale }), signal: AbortSignal.timeout(40000) });
      const data = await response.json();
      if (!response.ok) {
        checks.push({ name: 'live Groq', locale, status: response.status, code: data.code });
        evidence.liveVerified = false;
        continue;
      }
      assert.equal(data.source, 'groq');
      const view = decodePlan(data.output, locale);
      assert.equal(view.status, 'valid');
      const html = renderToStaticMarkup(<PlanContent view={view} source="groq" />);
      assert.match(html, /<table/);
      assert.match(html, /type="checkbox"/);
      checks.push({ name: 'live Groq', locale, status: response.status, source: data.source, schema: view.status, cards: view.cards?.length, priorities: view.priorities?.length, actions: view.actions?.length, reactRendering: 'passed' });
    }
    evidence.liveVerified = checks.filter(check => check.name === 'live Groq').every(check => check.status === 200);
  } else evidence.liveVerified = 'not requested';
  writeFileSync('docs/modules/04/live-verification.json', JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence, null, 2));
  if (evidence.liveVerified === false) process.exitCode = 1;
}
main().catch(error => { console.error(error instanceof Error ? error.message : 'Verification failed'); process.exitCode = 1; });
