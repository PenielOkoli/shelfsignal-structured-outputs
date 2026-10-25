import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import './globals.css';
export const metadata: Metadata = { title: 'ShelfSignal — A fresh perspective for your shop', description: 'Turn a retail brief into structured display cards, merchandising priorities, and practical next steps. Built with Groq and the Vercel AI SDK.' };
export default function Layout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a>{children}</body></html>; }
