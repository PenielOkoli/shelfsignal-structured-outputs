import Link from 'next/link';
import { CheckCircle2, CircleAlert } from 'lucide-react';
import type { PlanView, SectionName } from '@/lib/schema';

const sections: { key: SectionName; label: string; target: string }[] = [
  { key: 'summary', label: 'Narrative', target: 'Summary panel' },
  { key: 'cards', label: 'Display cards', target: 'Product cards' },
  { key: 'priorities', label: 'Stock priorities', target: 'Catalog table' },
  { key: 'actions', label: 'Next steps', target: 'Action checklist' },
];

export function ValidationReport({ view }: { view: PlanView }) {
  return <div className="validation-report" aria-label="Output validation report">
    <div className="report-heading"><h3>What reached the interface?</h3><Link href="/schema">Explore the output contract ↗</Link></div>
    <div className="report-grid">{sections.map(({ key, label, target }) => {
      const valid = view[key] !== null;
      return <div key={key} className={`report-item ${valid ? 'report-valid' : 'report-rejected'}`}>
        {valid ? <CheckCircle2 size={17} /> : <CircleAlert size={17} />}
        <div><strong>{label}</strong><span>{valid ? target : 'Fallback shown'}</span><code>{key}</code></div>
        <span>{valid ? 'Verified' : 'Withheld'}</span>
      </div>;
    })}</div>
    {view.issues.length > 0 && <ul className="report-issues">{view.issues.map((issue, index) =>
      <li key={index}><code>{issue.path || issue.section}</code><span>{issue.message}</span>{issue.code && <small>{issue.code}</small>}</li>
    )}</ul>}
    <p>{view.validated ? 'All sections passed. Export is available.' : 'Export stays disabled until the complete plan passes every check.'} Values from a rejected section never enter its component.</p>
  </div>;
}
