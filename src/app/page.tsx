import { Studio } from '@/components/studio';
import { groqConfigured } from '@/lib/server/groq';
export const dynamic = 'force-dynamic';
export default function Page() { return <Studio liveAvailable={groqConfigured()} />; }
