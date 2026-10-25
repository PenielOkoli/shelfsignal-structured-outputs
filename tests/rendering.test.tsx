import React from 'react';
import test from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlanContent } from '../src/components/plan-view';
import { decodePlan } from '../src/lib/schema';
import { samplePlan, scenarioPayload } from '../src/lib/samples';
const render = (raw: unknown) => renderToStaticMarkup(<PlanContent view={decodePlan(raw)} source="test" />);
test('valid structured output renders real cards, table, and checkbox controls', () => {
  const html = render(samplePlan()); assert.match(html, /product-card/); assert.match(html, /<table/); assert.match(html, /type="checkbox"/); assert.match(html, /Everyday ceramic mug/); assert.match(html, /24/);
});
test('missing cards renders section fallback and preserves priorities table', () => {
  const html = render(scenarioPayload('missing')); assert.match(html, /Display cards couldn’t be verified/); assert.match(html, /<table/); assert.doesNotMatch(html, /class="product-card"/);
});
test('invalid table renders a fallback without losing display cards', () => {
  const html = render(scenarioPayload('invalid')); assert.match(html, /Stock priorities couldn’t be verified/); assert.doesNotMatch(html, /<table/); assert.match(html, /class="product-card"/);
});
test('bad envelope renders full fallback with recovery button and no recommendations', () => {
  for (const scenario of ['unexpected', 'truncated'] as const) { const html = render(scenarioPayload(scenario)); assert.match(html, /This plan needs another pass/); assert.match(html, /Restore sample plan/); assert.doesNotMatch(html, /<table|class="product-card"/); }
});
test('HTML-like model text is escaped, never executed as markup', () => {
  const html = render(scenarioPayload('unsafe-text')); assert.match(html, /&lt;script&gt;/); assert.doesNotMatch(html, /<script/);
});
test('nullable label is omitted rather than rendered as null or undefined', () => {
  const html = render(samplePlan()); assert.doesNotMatch(html, />null<|>undefined</); assert.equal((html.match(/class="art-label"/g) || []).length, 2);
});
test('locale metadata reaches content without changing catalog currency', () => {
  const html = render(samplePlan('en-GB')); assert.match(html, /lang="en-GB"/); assert.match(html, /NGN|₦/);
});
