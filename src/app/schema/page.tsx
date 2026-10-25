import Link from 'next/link';
import { z } from 'zod';
import { ArrowLeft, Braces } from 'lucide-react';
import { planSchema } from '@/lib/schema';

export const metadata = { title: 'The output contract — ShelfSignal' };
export default function SchemaPage() {
  const jsonSchema = z.toJSONSchema(planSchema);
  return <main id="main" className="guide-page schema-page">
    <Link href="/" className="back-link"><ArrowLeft size={16} /> Back to the planning studio</Link>
    <Braces size={38} /><div className="eyebrow">DELIVERABLE 04 / THE OUTPUT CONTRACT</div>
    <h1>A little structure.<br /><span>A clear agreement.</span></h1>
    <p className="lead">One response. Three distinct layers. Each has a defined job before anything reaches the screen.</p>
    <section className="contract-layers">
      <article><span>01 / CONTEXT</span><h2>Metadata</h2><code>schemaVersion · locale · currency</code><p>The envelope selects a supported version and regional format. An unsupported or mismatched envelope withholds the whole plan.</p></article>
      <article><span>02 / EXPLANATION</span><h2>Natural language</h2><code>summary.title · summary.narrative</code><p>A short explanation of the recommendation. It is displayed as escaped text and never parsed into actions.</p></article>
      <article><span>03 / INTERFACE</span><h2>Typed UI data</h2><code>cards · priorities · actions</code><p>Allowlisted IDs and enums drive prebuilt components. Prices and stock come from our catalog, never from model claims.</p></article>
    </section>
    <section><h2>Strict shape. Explicit recovery.</h2><p>All fields are required. A card label can be null when no label is needed. Collections contain one to three items. Unknown keys, wrong types, oversized text, and unsupported identifiers are rejected. Duplicate identifiers and a locale different from the request are checked separately by the shared decoder.</p><p>A broken section shows a fallback while other verified sections remain usable. An invalid envelope shows a full recovery state. Export requires a fully valid plan.</p></section>
    <section><h2>Ready for another locale</h2><p>Content and locale metadata travel separately. The current implementation supports English for Nigeria and the UK; it does not claim translation. Components use the locale for language metadata and number formatting. NGN remains the catalog currency in both locales.</p></section>
    <section><h2>The machine-readable contract</h2><p>This JSON Schema is generated directly from the same Zod schema used by the provider integration and application validators. There is no separately maintained sample contract.</p><details><summary>Inspect JSON Schema</summary><pre>{JSON.stringify(jsonSchema, null, 2)}</pre></details></section>
    <Link className="button primary" href="/">Try the response test lab</Link>
  </main>;
}
