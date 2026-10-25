import test from 'node:test';
import assert from 'node:assert/strict';
import { decodePlan, planSchema, requestSchema } from '../src/lib/schema';
import { samplePlan, scenarioPayload } from '../src/lib/samples';
import { readJSON } from '../src/lib/http';

test('complete response produces a typed, exportable plan', () => {
  const result = decodePlan(samplePlan()); assert.equal(result.status, 'valid'); assert.equal(result.cards?.length, 3); assert.ok(result.validated);
});
test('required nullable label accepts null but not a missing field', () => {
  const plan = samplePlan(); assert.equal(planSchema.safeParse(plan).success, true);
  const raw = structuredClone(plan) as unknown as { cards: Record<string, unknown>[] }; delete raw.cards[0].label;
  assert.equal(decodePlan(raw).cards, null);
});
test('missing section becomes a fallback, with other sections preserved', () => {
  const result = decodePlan(scenarioPayload('missing')); assert.equal(result.status, 'partial'); assert.equal(result.cards, null); assert.ok(result.summary); assert.ok(result.priorities); assert.equal(result.validated, null);
});
test('invalid enum and wrong field types reject the whole affected section', () => {
  const result = decodePlan(scenarioPayload('invalid')); assert.equal(result.priorities, null); assert.equal(result.status, 'partial'); assert.equal(result.cards?.length, 3);
});
test('unexpected top-level fields reject the envelope', () => { assert.equal(decodePlan(scenarioPayload('unexpected')).status, 'invalid'); });
test('truncated JSON, arrays, null and primitives are never parsed as prose', () => {
  for (const value of [scenarioPayload('truncated'), null, [], 4, true, 'Here is the plan']) assert.equal(decodePlan(value).status, 'invalid');
});
test('unsupported version, locale, currency and locale mismatch fail closed', () => {
  for (const patch of [{ schemaVersion: '2.0' }, { locale: 'xx-XX' }, { currency: 'USD' }]) assert.equal(decodePlan({ ...samplePlan(), ...patch }).status, 'invalid');
  assert.equal(decodePlan(samplePlan('en-GB'), 'en-NG').status, 'invalid');
});
test('unknown product identifiers and nested extra fields cannot select components', () => {
  const plan = samplePlan();
  assert.equal(decodePlan({ ...plan, cards: [{ ...plan.cards[0], productId: 'executeScript' }] }).cards, null);
  assert.equal(decodePlan({ ...plan, cards: [{ ...plan.cards[0], onClick: 'alert(1)' }] }).cards, null);
});
test('duplicate product and action IDs are rejected', () => {
  const plan = samplePlan(); const result = decodePlan({ ...plan, cards: [plan.cards[0], plan.cards[0]], actions: [plan.actions[0], plan.actions[0]] });
  assert.equal(result.cards, null); assert.equal(result.actions, null); assert.equal(result.status, 'partial');
});
test('empty or oversized collections and excessive strings produce fallbacks', () => {
  const plan = samplePlan();
  for (const cards of [[], [plan.cards[0], plan.cards[1], plan.cards[2], plan.cards[0]], [{ ...plan.cards[0], headline: 'x'.repeat(71) }]]) assert.equal(decodePlan({ ...plan, cards }).cards, null);
});
test('all missing sections result in full fallback', () => { assert.equal(decodePlan({ schemaVersion: '1.0', locale: 'en-NG', currency: 'NGN' }).status, 'invalid'); });
test('input schema rejects oversize, too-short, wrong locales, and extra keys', () => {
  for (const input of [{ brief: 'short', locale: 'en-NG' }, { brief: 'x'.repeat(1001), locale: 'en-NG' }, { brief: 'A thoughtful weekend display', locale: 'fr-FR' }, { brief: 'A thoughtful weekend display', locale: 'en-NG', model: 'other' }]) assert.equal(requestSchema.safeParse(input).success, false);
});
test('JSON reader bounds actual bytes and rejects malformed data and content type', async () => {
  const request = (body: string, contentType = 'application/json') => new Request('https://test.local/api/plan', { method: 'POST', headers: { 'Content-Type': contentType }, body });
  await assert.rejects(readJSON(request('x'.repeat(9000))), { status: 413 });
  await assert.rejects(readJSON(request('{')), { status: 400 });
  await assert.rejects(readJSON(request('{}', 'text/plain')), { status: 415 });
  assert.deepEqual(await readJSON(request('{"ok":true}')), { ok: true });
});
