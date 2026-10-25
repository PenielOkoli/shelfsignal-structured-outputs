import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { z } from 'zod';
import { decodePlan, planSchema } from '../src/lib/schema';
import { samplePlan, scenarioPayload } from '../src/lib/samples';
import { PlanContent } from '../src/components/plan-view';
import { ValidationReport } from '../src/components/validation-report';

test('missing nested placement is traced to a field and blocks the entire card collection', () => {
  const view = decodePlan(scenarioPayload('nested-missing'));
  assert.equal(view.cards, null);
  assert.ok(view.priorities);
  assert.equal(view.issues[0].path, 'cards.0.placement');
  const html = renderToStaticMarkup(<ValidationReport view={view} />);
  assert.match(html, /cards\.0\.placement/);
  assert.match(html, /Fallback shown/);
  assert.match(html, /Export stays disabled/);
});

test('multiple field errors in one section announce one withheld section', () => {
  const view = decodePlan(scenarioPayload('invalid'));
  assert.ok(view.issues.length > 1);
  const html = renderToStaticMarkup(<PlanContent view={view} source="test" />);
  assert.match(html, /1 section couldn’t be verified/);
  assert.doesNotMatch(html, /2 sections couldn’t be verified/);
});

test('empty actions withhold checkboxes while preserving verified product cards', () => {
  const view = decodePlan(scenarioPayload('empty'));
  const html = renderToStaticMarkup(<PlanContent view={view} source="test" />);
  assert.equal(view.validated, null);
  assert.match(html, /Suggested actions couldn’t be verified/);
  assert.match(html, /class="product-card"/);
  assert.doesNotMatch(html, /type="checkbox"/);
});

test('duplicate cards cannot render conflicting component keys', () => {
  const view = decodePlan(scenarioPayload('duplicate'));
  assert.equal(view.cards, null);
  assert.equal(view.status, 'partial');
  const html = renderToStaticMarkup(<PlanContent view={view} source="test" />);
  assert.doesNotMatch(html, /class="product-card"/);
  assert.match(html, /<table/);
});

test('mismatched locale withholds all recommendations for both supported locales', () => {
  for (const locale of ['en-NG', 'en-GB'] as const) {
    const view = decodePlan(scenarioPayload('locale-mismatch', locale), locale);
    assert.equal(view.status, 'invalid');
    const html = renderToStaticMarkup(<PlanContent view={view} source="test" />);
    assert.match(html, /This plan needs another pass/);
    assert.doesNotMatch(html, /<table|type="checkbox"/);
  }
});

test('report treats safe HTML-like text as text and confirms valid export', () => {
  const view = decodePlan(scenarioPayload('unsafe-text'));
  const html = renderToStaticMarkup(<><ValidationReport view={view} /><PlanContent view={view} source="test" /></>);
  assert.match(html, /All sections passed/);
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script/);
});

test('generated JSON schema closes objects and separates all three data layers', () => {
  const schema = z.toJSONSchema(planSchema);
  assert.equal(schema.additionalProperties, false);
  assert.ok(schema.properties?.summary);
  assert.ok(schema.properties?.cards);
  assert.ok(schema.properties?.locale);
  assert.ok(schema.required?.includes('currency'));
});

test('diagnostics do not echo untrusted values and remain bounded per section', () => {
  const plan = samplePlan();
  const payload = { ...plan, cards: Array.from({ length: 100 }, () => ({ productId: 'SECRET-TEST-VALUE' })) };
  const view = decodePlan(payload);
  assert.ok(view.issues.length <= 5);
  assert.doesNotMatch(JSON.stringify(view.issues), /SECRET-TEST-VALUE/);
});
