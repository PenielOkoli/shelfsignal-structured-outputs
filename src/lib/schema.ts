import { z } from 'zod';

const text = (max: number) => z.string().trim().min(1).max(max);
export const productIdSchema = z.enum(['mug', 'tote', 'notebook']);
export const localeSchema = z.enum(['en-NG', 'en-GB']);
export const cardSchema = z.object({
  productId: productIdSchema,
  headline: text(70),
  description: text(230),
  placement: z.enum(['front-table', 'eye-level', 'checkout']),
  label: text(35).nullable(),
}).strict();
export const prioritySchema = z.object({
  productId: productIdSchema,
  priority: z.enum(['feature', 'support', 'watch']),
  reason: text(180),
}).strict();
export const actionSchema = z.object({
  id: z.enum(['display', 'signage', 'stock-check']),
  title: text(70),
  detail: text(220),
  effort: z.enum(['5-min', '15-min', '30-min']),
}).strict();
export const summarySchema = z.object({ title: text(90), narrative: text(500) }).strict();
export const cardsSchema = z.array(cardSchema).min(1).max(3);
export const prioritiesSchema = z.array(prioritySchema).min(1).max(3);
export const actionsSchema = z.array(actionSchema).min(1).max(3);

// Provider contract: required fields, closed objects, explicit nullable values.
export const planSchema = z.object({
  schemaVersion: z.literal('1.0'),
  locale: localeSchema,
  currency: z.literal('NGN'),
  summary: summarySchema,
  cards: cardsSchema,
  priorities: prioritiesSchema,
  actions: actionsSchema,
}).strict();
export type StructuredPlan = z.infer<typeof planSchema>;
export type DisplayCard = z.infer<typeof cardSchema>;
export type StockPriority = z.infer<typeof prioritySchema>;
export type SuggestedAction = z.infer<typeof actionSchema>;
export type Summary = z.infer<typeof summarySchema>;
export type Locale = z.infer<typeof localeSchema>;
export const requestSchema = z.object({ brief: z.string().trim().min(20).max(1000), locale: localeSchema }).strict();
export type PlanRequest = z.infer<typeof requestSchema>;

export type SectionName = 'summary' | 'cards' | 'priorities' | 'actions';
export interface ValidationIssue { section: string; message: string; path?: string; code?: string; }
export interface PlanView {
  status: 'valid' | 'partial' | 'invalid';
  locale: Locale;
  summary: Summary | null;
  cards: DisplayCard[] | null;
  priorities: StockPriority[] | null;
  actions: SuggestedAction[] | null;
  issues: ValidationIssue[];
  validated: StructuredPlan | null;
}

const empty = (message: string): PlanView => ({ status: 'invalid', locale: 'en-NG', summary: null, cards: null, priorities: null, actions: null, issues: [{ section: 'response', message }], validated: null });
const unique = <T,>(values: T[], key: (value: T) => string) => new Set(values.map(key)).size === values.length;

// The ONLY entry point from unknown model/network/fixture data into UI props.
// Validate the envelope first, then each complete section. Never render partial items.
export function decodePlan(raw: unknown, expectedLocale?: Locale): PlanView {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return empty('The response was not a complete JSON object.');
  const value = raw as Record<string, unknown>;
  const known = ['schemaVersion', 'locale', 'currency', 'summary', 'cards', 'priorities', 'actions'];
  if (Object.keys(value).some(key => !known.includes(key))) return empty('The response contained unexpected fields.');
  if (value.schemaVersion !== '1.0' || value.currency !== 'NGN' || !localeSchema.safeParse(value.locale).success) return empty('The response version, currency, or locale was not supported.');
  if (expectedLocale && value.locale !== expectedLocale) return empty('The response locale did not match your request.');
  const issues: ValidationIssue[] = [];
  function section<T>(name: SectionName, schema: z.ZodType<T>): T | null {
    const result = schema.safeParse(value[name]);
    if (!result.success) {
      for (const issue of result.error.issues.slice(0, 5)) {
        issues.push({ section: name, path: [name, ...issue.path].join('.'), code: issue.code,
          message: 'This field is missing or does not match the output contract.' });
      }
      return null;
    }
    return result.data;
  }
  const summary = section('summary', summarySchema);
  let cards = section('cards', cardsSchema);
  let priorities = section('priorities', prioritiesSchema);
  let actions = section('actions', actionsSchema);
  if (cards && !unique(cards, card => card.productId)) { cards = null; issues.push({ section: 'cards', message: 'Display cards contained duplicate products.' }); }
  if (priorities && !unique(priorities, item => item.productId)) { priorities = null; issues.push({ section: 'priorities', message: 'Priorities contained duplicate products.' }); }
  if (actions && !unique(actions, item => item.id)) { actions = null; issues.push({ section: 'actions', message: 'Actions contained duplicate identifiers.' }); }
  const status = issues.length === 0 ? 'valid' : summary || cards || priorities || actions ? 'partial' : 'invalid';
  return { status, locale: value.locale as Locale, summary, cards, priorities, actions, issues,
    validated: status === 'valid' ? planSchema.parse(value) : null };
}
