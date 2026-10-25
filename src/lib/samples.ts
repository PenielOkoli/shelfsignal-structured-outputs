import type { StructuredPlan, Locale } from './schema';
export const scenarioNames = ['complete', 'missing', 'invalid', 'unexpected', 'truncated', 'unsafe-text', 'empty', 'duplicate', 'nested-missing', 'locale-mismatch'] as const;
export type Scenario = typeof scenarioNames[number];
export function samplePlan(locale: Locale = 'en-NG'): StructuredPlan {
  return {
    schemaVersion: '1.0', locale, currency: 'NGN',
    summary: { title: 'Small everyday things. A stronger first impression.', narrative: 'Lead with the ceramic mug, pair it with a notebook, and keep the tote within reach. This edit gives each product a clear role without crowding the display. These are merchandising suggestions based on the sample catalog, not sales predictions.' },
    cards: [
      { productId: 'mug', headline: 'A better everyday ritual', description: 'Make the mug your hero. Keep one unboxed so customers can see the shape and imagine their morning coffee.', placement: 'front-table', label: 'Lead the display' },
      { productId: 'tote', headline: 'Ready for the next little adventure', description: 'Hang a tote beside the main display. Its useful shape makes an easy companion to a small gift.', placement: 'eye-level', label: 'Pair it up' },
      { productId: 'notebook', headline: 'Give a good idea somewhere to go', description: 'Open one notebook to a clean page. Place it beside the mug as a thoughtful desk-ready pairing.', placement: 'checkout', label: null },
    ],
    priorities: [
      { productId: 'mug', priority: 'feature', reason: 'Use as the visual anchor for this display.' },
      { productId: 'tote', priority: 'support', reason: 'Keep nearby as a complementary everyday item.' },
      { productId: 'notebook', priority: 'watch', reason: 'The sample catalog has fewer units; verify availability before highlighting it.' },
    ],
    actions: [
      { id: 'display', title: 'Give the hero product room', detail: 'Clear the front table and arrange the mugs in a small group at two heights.', effort: '15-min' },
      { id: 'signage', title: 'Make the pairing easy to understand', detail: 'Add a simple card reading “A little reset for your desk.” Keep individual prices visible.', effort: '5-min' },
      { id: 'stock-check', title: 'Check the notebook shelf', detail: 'Count available notebooks before opening and update your own inventory records.', effort: '5-min' },
    ],
  };
}
export function scenarioPayload(scenario: Scenario, locale: Locale = 'en-NG'): unknown {
  const plan = samplePlan(locale);
  if (scenario === 'missing') { const { cards: omitted, ...rest } = plan; void omitted; return rest; }
  if (scenario === 'invalid') return { ...plan, priorities: [{ productId: 'mug', priority: 'urgent-buy-now', reason: 42 }] };
  if (scenario === 'unexpected') return { ...plan, executePurchase: true };
  if (scenario === 'truncated') return '{"schemaVersion":"1.0","cards":[';
  if (scenario === 'unsafe-text') return { ...plan, summary: { ...plan.summary, title: '<script>alert("hello")</script>' } };
  if (scenario === 'empty') return { ...plan, actions: [] };
  if (scenario === 'duplicate') return { ...plan, cards: [plan.cards[0], plan.cards[0]] };
  if (scenario === 'nested-missing') {
    const { placement: omitted, ...card } = plan.cards[0]; void omitted;
    return { ...plan, cards: [card, ...plan.cards.slice(1)] };
  }
  if (scenario === 'locale-mismatch') return { ...plan, locale: locale === 'en-NG' ? 'en-GB' : 'en-NG' };
  return plan;
}
