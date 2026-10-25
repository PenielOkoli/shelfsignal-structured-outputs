'use client';
import { useRef, useState } from 'react';
import { ArrowDownToLine, ArrowRight, Braces, Check, ChevronDown, CircleHelp, FlaskConical, LoaderCircle, RotateCcw, ShieldCheck, Sparkles, X } from 'lucide-react';
import Link from 'next/link';
import { decodePlan, type Locale, type PlanView } from '@/lib/schema';
import { presets } from '@/lib/catalog';
import { samplePlan, scenarioNames, scenarioPayload, type Scenario } from '@/lib/samples';
import { PlanContent } from './plan-view';
import { ValidationReport } from './validation-report';

const scenarioLabels: Record<Scenario, string> = { complete: 'Valid response', missing: 'Missing cards', invalid: 'Invalid priority', unexpected: 'Unexpected field', truncated: 'Truncated JSON', 'unsafe-text': 'HTML-like text', empty: 'Empty actions', duplicate: 'Duplicate products', 'nested-missing': 'Missing placement', 'locale-mismatch': 'Locale mismatch' };
export function Studio({ liveAvailable }: { liveAvailable: boolean }) {
  const [brief, setBrief] = useState<string>(presets[0].brief);
  const [locale, setLocale] = useState<Locale>('en-NG');
  const [view, setView] = useState<PlanView>(() => decodePlan(samplePlan()));
  const [source, setSource] = useState<'sample' | 'groq' | 'test'>('sample');
  const [raw, setRaw] = useState<unknown>(samplePlan());
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [lab, setLab] = useState(false);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [scenario, setScenario] = useState<Scenario>('complete');
  const [completed, setCompleted] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  function apply(payload: unknown, origin: 'sample' | 'groq' | 'test', expectedLocale: Locale) {
    setRaw(payload); setView(decodePlan(payload, expectedLocale)); setSource(origin); setCompleted([]);
  }
  function restore() { apply(samplePlan(locale), 'sample', locale); setError(''); setScenario('complete'); setNotice('Sample plan restored. This is curated sample data, not a model response.'); }
  async function generate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPending(true); setError(''); setNotice('');
    const id = ++sequence.current;
    const controller = new AbortController(); abortRef.current = controller;
    const timeout = setTimeout(() => controller.abort('timeout'), 32000);
    try {
      const response = await fetch('/api/plan', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ brief, locale }), signal: controller.signal });
      const data: unknown = await response.json();
      if (!response.ok) {
        const message = data && typeof data === 'object' && 'error' in data && typeof data.error === 'string' ? data.error : 'The request could not be completed.';
        throw new Error(message);
      }
      if (!data || typeof data !== 'object' || !('output' in data) || !('source' in data) || data.source !== 'groq') throw new Error('The server returned an unexpected response. Your previous plan is unchanged.');
      if (id !== sequence.current) return;
      apply(data.output, 'groq', locale);
      setNotice('Groq response received and checked. Review all recommendations before using them.');
      setTimeout(() => resultRef.current?.focus(), 30);
    } catch (error) {
      if (id !== sequence.current) return;
      setError(controller.signal.aborted ? 'Generation timed out. Your previous plan is unchanged; please try again.' : error instanceof Error ? error.message : 'Generation failed. Try again.');
    } finally { clearTimeout(timeout); if (id === sequence.current) { setPending(false); abortRef.current = null; } }
  }
  function cancel() { sequence.current++; abortRef.current?.abort(); abortRef.current = null; setPending(false); setNotice('Generation cancelled. Your previous plan is unchanged.'); }
  function runScenario(value: Scenario) { setScenario(value); apply(scenarioPayload(value, locale), 'test', locale); setError(''); setNotice(`Test applied: ${scenarioLabels[value]}. No model call was made.`); }
  function download() {
    if (!view.validated || pending) return;
    const content = { provenance: { source, note: 'Recommendations require human review. Catalog is sample data.' }, plan: view.validated };
    const url = URL.createObjectURL(new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'shelfsignal-plan.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); setNotice('Validated plan exported as JSON.');
  }
  return <>
    <header className="topbar"><Link href="/" className="brand"><span className="brand-icon"><i /><i /><i /></span>shelf<span>signal</span><sup>®</sup></Link><nav aria-label="Main navigation"><Link className="nav-active" href="/">Planning studio</Link><Link href="/guide">How it works <ArrowRight size={13} /></Link></nav><span className="workspace-badge"><span /> INDEPENDENT RETAIL STUDIO</span></header>
    <main id="main" className="studio"><section className="hero"><div><div className="eyebrow"><span className="blue-dot" /> A FRESH PERSPECTIVE FOR YOUR SHOP</div><h1>Less guesswork.<br /><span>More shelf appeal.</span></h1><p>Turn a shop brief into a thoughtful display, clear priorities,<br className="desktop" /> and a few good next steps.</p></div><div className="hero-stamp" aria-hidden="true"><div className="stamp-grid"><i /><i /><i /><i /><i /><i /></div><span>SMALL SHOP.<br />BIG POSSIBILITIES.</span><ArrowUpRightIcon /></div></section>
      <section className="brief-panel" aria-labelledby="brief-title"><div className="brief-heading"><span className="tiny-icon"><Sparkles size={20} /></span><div><h2 id="brief-title">What are you making room for?</h2><p>Describe your next display. We’ll help connect the dots.</p></div><span className={`connection ${liveAvailable ? 'connected' : ''}`}><span />{liveAvailable ? 'Groq connected' : 'Groq key pending'}</span></div><form onSubmit={generate}><label className="sr-only" htmlFor="brief">Shop brief</label><textarea id="brief" minLength={20} maxLength={1000} value={brief} onChange={e => setBrief(e.target.value)} disabled={pending} required rows={3} /><div className="brief-bottom"><div className="presets"><span>TRY A BRIEF</span>{presets.map(preset => <button key={preset.name} type="button" disabled={pending} onClick={() => { setBrief(preset.brief); setNotice('Brief updated. Generate with Groq to create a new plan.'); }}>{preset.name}<ArrowRight size={11} /></button>)}</div><div className="generate-controls"><label className="sr-only" htmlFor="locale">Output locale</label><select id="locale" value={locale} disabled={pending} onChange={e => setLocale(e.target.value as Locale)}><option value="en-NG">English · NG</option><option value="en-GB">English · GB</option></select>{pending ? <button type="button" className="button primary" onClick={cancel}><X size={16} /> Cancel</button> : <button className="button primary" type="submit"><Sparkles size={16} /> Generate with Groq <ArrowRight size={16} /></button>}</div></div></form><div className="privacy-note">Uses the three-product sample catalog below. Your brief is sent to Groq only when you generate. No purchases or inventory changes are made.</div></section>
      {error && <div className="request-error" role="alert"><CircleHelp size={20} /><div><strong>We couldn’t create a new plan.</strong><p>{error}</p><span>The previous plan remains visible below, with its original source label.</span></div></div>}
      <p role="status" className={notice ? 'notice' : 'sr-only'}>{notice}</p>
      <div className="result-toolbar"><div className="result-title"><span className="eyebrow">YOUR MERCHANDISING PLAN</span><span className={`status-badge status-${view.status}`}><ShieldCheck size={13} />{view.status === 'valid' ? 'Schema verified' : view.status === 'partial' ? 'Partially verified' : 'Validation failed'}</span><span className="source-badge">{source === 'sample' ? 'Sample data' : source === 'groq' ? 'Groq output' : 'Test fixture'}</span></div><div className="toolbar-actions"><button onClick={() => setLab(!lab)} aria-expanded={lab} aria-controls="validation-lab" disabled={pending}><FlaskConical size={15} /> Test states</button><button onClick={() => setJsonOpen(!jsonOpen)} aria-expanded={jsonOpen} aria-controls="json-inspector"><Braces size={16} /> JSON</button><button onClick={download} disabled={!view.validated || pending}><ArrowDownToLine size={16} /> Export</button></div></div>
      {lab && <section className="validation-lab" id="validation-lab"><div><h2>See what happens when AI gets it wrong.</h2><p>These deterministic test fixtures run through the same validator as live output. They never call Groq.</p></div><label htmlFor="scenario">Response scenario</label><div className="lab-controls"><select id="scenario" value={scenario} onChange={e => runScenario(e.target.value as Scenario)} disabled={pending}>{scenarioNames.map(name => <option key={name} value={name}>{scenarioLabels[name]}</option>)}</select><button className="button secondary" onClick={restore} disabled={pending}><RotateCcw size={14} /> Restore sample</button></div><ValidationReport view={view} /></section>}
      {jsonOpen && <section className="json-inspector" id="json-inspector"><h2>Response inspector <span>Read-only · {source}</span></h2><p>Natural-language content lives in <code>summary</code>. Cards, priorities, actions, locale, and schema version are explicit fields.</p><pre>{typeof raw === 'string' ? raw : JSON.stringify(raw, null, 2)}</pre></section>}
      <div ref={resultRef} tabIndex={-1} className="results" aria-label="Merchandising plan" aria-busy={pending}>{pending && <div className="loading-banner" role="status"><LoaderCircle className="spin" size={20} /><div><strong>Shaping your next shop edit…</strong><span>Waiting for a complete response, then validating every section. Previous plan shown below.</span></div></div>}<PlanContent view={view} source={source} completed={completed} onToggle={id => setCompleted(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id])} onRestore={restore} /></div>
      <div className="trust-strip"><ShieldCheck size={19} /><span>Structured by design. Reviewed by you.</span><p>Schema validation checks the shape of a response, not the accuracy of every recommendation.</p><Link href="/guide">Explore the foundation <ArrowRight size={14} /></Link></div>
    </main><footer><span className="footer-brand">shelfsignal</span><span>A little structure. A lot of possibility.</span><span>DELIVERABLE 04 / STRUCTURED OUTPUTS</span></footer>
  </>;
}
function ArrowUpRightIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>; }
