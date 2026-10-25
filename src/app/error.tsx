'use client';
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) { return <main id="main" className="guide-page"><h1>Let’s give that another try.</h1><p>The studio hit an unexpected error.</p><button className="button primary" onClick={reset}>Reload studio</button></main>; }
