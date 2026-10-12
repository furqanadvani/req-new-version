import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLiveCollection, seedDatabase } from '@/utils/api';
import { COLLECTIONS } from '@/utils/constants';
import { fmtDate } from '@/utils/helpers';
import { PortalHead } from '@/components/portal';
import { Spinner } from '@/components/ui';

export default function Dashboard() {
  const { key } = useParams();
  const q = useLiveCollection(COLLECTIONS.queries);
  const r = useLiveCollection(COLLECTIONS.registrations);
  const h = useLiveCollection(COLLECTIONS.hajj);
  const u = useLiveCollection(COLLECTIONS.umrah);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const base = `/admin/${key}`;
  const newQ = q.items.filter((x) => x.status === 'new');
  const newR = r.items.filter((x) => x.status === 'received');
  const empty = !h.loading && h.items.length === 0;

  async function seed() {
    if (!confirm('Load the starter content (current packages, services, FAQs, testimonials, team, settings) into the database?')) return;
    setBusy(true);
    try { await seedDatabase(); setMsg('Starter content loaded. Review prices and dates before you publish.'); } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  const cards = [
    ['New queries', newQ.length, `${base}/queries`],
    ['New registrations', newR.length, `${base}/registrations`],
    ['Hajj packages', h.items.length, `${base}/hajj`],
    ['Umrah packages', u.items.length, `${base}/umrah`],
  ];
  const recent = [...q.items].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)).slice(0, 6);
  return (
    <>
      <PortalHead title="Dashboard" text="What needs attention today." />
      {empty && (
        <div className="card mb-8 flex flex-wrap items-center justify-between gap-4 border-gold/40 p-6">
          <div><h2 className="text-2xl">The database is empty</h2><p className="mt-1 text-muted">Load the content from the current website as a starting point.</p></div>
          <button onClick={seed} disabled={busy} className="btn-gold">{busy ? <Spinner /> : 'Load starter content'}</button>
        </div>
      )}
      {msg && <p className="card mb-8 p-4 text-[14.5px]">{msg}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(([l, v, to]) => <Link key={l} to={to} className="card p-6 hover:!border-gold"><p className="text-[14px] text-muted">{l}</p><p className="mt-2 font-display text-[44px] leading-none">{v}</p></Link>)}
      </div>
      <h2 className="mb-4 mt-12 text-2xl">Latest queries</h2>
      <div className="card divide-hair">
        {recent.length === 0 && <p className="p-6 text-muted">No queries yet.</p>}
        {recent.map((x) => (
          <Link key={x.id} to={`${base}/queries`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 hover:bg-ink/[.03]">
            <span><span className="font-medium">{x.name}</span><span className="text-muted"> · {x.service || x.package} · {x.country}</span></span>
            <span className="text-[13px] text-muted">{fmtDate(x.createdAt)} · <span className="capitalize">{x.status}</span></span>
          </Link>
        ))}
      </div>
    </>
  );
}
