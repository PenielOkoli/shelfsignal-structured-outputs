import { NoObjectGeneratedError, NoOutputGeneratedError } from 'ai';
import { decodePlan, requestSchema } from '@/lib/schema';
import { readJSON, RequestError } from '@/lib/http';
import { generatePlan, groqConfigured } from '@/lib/server/groq';

export const runtime = 'nodejs';
export const maxDuration = 30;
const reply = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
// Best-effort single-instance abuse guard, not a distributed quota.
let windowStart = 0; let calls = 0; let active = 0;
export async function POST(request: Request) {
  if (request.headers.get('origin') && request.headers.get('origin') !== new URL(request.url).origin) return reply({ error: 'This origin is not allowed.', code: 'request' }, 403);
  let input: unknown;
  try { input = await readJSON(request); }
  catch (error) { return reply({ error: error instanceof RequestError ? error.message : 'Invalid request.', code: 'request' }, error instanceof RequestError ? error.status : 400); }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) return reply({ error: 'Use a brief of 20–1,000 characters and a supported locale.', code: 'request' }, 400);
  if (!groqConfigured()) return reply({ error: 'Live generation is not configured yet. You can explore the sample or test the validation states.', code: 'configuration' }, 503);
  if (Date.now() - windowStart > 60000) { windowStart = Date.now(); calls = 0; }
  if (calls >= 10 || active >= 2) return reply({ error: 'The studio is busy. Please wait a minute and try again.', code: 'limit' }, 429);
  calls++; active++;
  try {
    const output = await generatePlan(parsed.data);
    const checked = decodePlan(output, parsed.data.locale);
    // SDK validates shape; this catches semantic constraints such as duplicate IDs.
    if (checked.status !== 'valid') return reply({ error: 'The model response did not pass our checks. No new plan was applied.', code: 'validation' }, 422);
    return reply({ output: checked.validated, source: 'groq' });
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) || NoOutputGeneratedError.isInstance(error)) return reply({ error: 'The model returned an incomplete or invalid plan. Please try again.', code: 'validation' }, 422);
    return reply({ error: 'Groq could not complete this request. Check the provider configuration or try again later.', code: 'provider' }, 502);
  } finally { active--; }
}
