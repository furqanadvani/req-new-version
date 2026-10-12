import { useMemo, useState } from 'react';
import { Phone, Download, Trash2 } from 'lucide-react';
import { useLiveCollection, patchItem, removeItem, useSettings } from '@/utils/api';
import { COLLECTIONS, QUERY_STATUS } from '@/utils/constants';
import { fmtDate, waLink, telLink, downloadCSV, cx } from '@/utils/helpers';
import { PortalHead } from '@/components/portal';
import { WhatsAppGlyph } from '@/components/layout';
import { Spinner } from '@/components/ui';

export default function Queries() {
  const { items, loading, error } = useLiveCollection(COLLECTIONS.queries);
  const st = useSettings();
  const [status, setStatus] = useState('new');
  const list = useMemo(() => items.filter((x) => status === 'all' || x.status === status).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)), [items, status]);
  return (
    <>
      <PortalHead title="Queries" text="Every inquiry from the website. Change the status as you follow up.">
        <button onClick={() => downloadCSV(list, 'queries.csv')} className="btn-ghost"><Download size={16} />Export CSV</button>
      </PortalHead>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...QUERY_STATUS].map((s) => <button key={s} onClick={() => setStatus(s)} className={cx('rounded-full border px-4 py-1.5 text-[14px] capitalize', status === s ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted')}>{s} {s !== 'all' && <span className="opacity-60">{items.filter((x) => x.status === s).length}</span>}</button>)}
      </div>
      {error && <p className="card mb-5 p-4 text-red-500">{error}</p>}
      {loading ? <Spinner /> : (
        <div className="grid gap-4">
          {list.length === 0 && <p className="card p-8 text-center text-muted">No {status === 'all' ? '' : status} queries.</p>}
          {list.map((x) => (
            <article key={x.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl">{x.name} <span className="text-[14px] text-muted">· {x.travellers || 1} traveller{x.travellers > 1 ? 's' : ''}</span></h3>
                  <p className="mt-1 text-[14px] text-muted">{[x.service, x.package, x.country, x.email].filter(Boolean).join(' · ')}</p>
                </div>
                <span className="text-[13px] text-muted">{fmtDate(x.createdAt)} · from {x.source}</span>
              </div>
              {x.message && <p className="mt-4 whitespace-pre-line rounded-xl bg-raised p-4 text-[15px]">{x.message}</p>}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a href={waLink(x.phone, `Assalam o Alaikum ${x.name}, this is ${st.brandName} about your inquiry.`)} target="_blank" rel="noreferrer" className="btn !py-2 bg-[#1fae5b] text-[14px] text-white"><WhatsAppGlyph size={16} />{x.phone}</a>
                <a href={telLink(x.phone)} className="btn-ghost !py-2 text-[14px]"><Phone size={15} />Call</a>
                <select value={x.status} onChange={(e) => patchItem(COLLECTIONS.queries, x.id, { status: e.target.value })} className="field !w-auto !py-2 capitalize">{QUERY_STATUS.map((s) => <option key={s}>{s}</option>)}</select>
                <input defaultValue={x.note || ''} onBlur={(e) => e.target.value !== (x.note || '') && patchItem(COLLECTIONS.queries, x.id, { note: e.target.value })} placeholder="Internal note" className="field !py-2 min-w-[200px] flex-1" />
                <button onClick={() => confirm('Delete this query?') && removeItem(COLLECTIONS.queries, x.id)} className="grid h-10 w-10 place-items-center rounded-full text-red-500 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={16} /></button>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
