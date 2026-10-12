import { useMemo, useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Download, Phone, FileText } from 'lucide-react';
import { db } from '@/utils/firebase';
import { useLiveCollection, patchItem, useSettings } from '@/utils/api';
import { COLLECTIONS, REG_STATUS } from '@/utils/constants';
import { fmtDate, waLink, telLink, downloadCSV, cx } from '@/utils/helpers';
import { PortalHead, Drawer, Toast } from '@/components/portal';
import { WhatsAppGlyph } from '@/components/layout';
import { Spinner } from '@/components/ui';

/** Status changes are mirrored to registrationStatus/{ref}, which pilgrims see on the tracking page. */
async function setStatus(r, status, note) {
  await patchItem(COLLECTIONS.registrations, r.id, { status, publicNote: note ?? r.publicNote ?? '' });
  await setDoc(doc(db, COLLECTIONS.status, r.id), { status, note: note ?? r.publicNote ?? '', updatedAt: serverTimestamp() }, { merge: true });
}

export default function Registrations() {
  const s = useSettings();
  const { items, loading, error } = useLiveCollection(COLLECTIONS.registrations);
  const [filter, setFilter] = useState('all');
  const [open, setOpen] = useState(null);
  const [note, setNote] = useState('');
  const [toast, setToast] = useState('');
  const list = useMemo(() => items.filter((x) => filter === 'all' || x.status === filter).sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)), [items, filter]);
  const flat = (rows) => rows.flatMap((r) => (r.pilgrims || [{}]).map((p, i) => ({ ref: r.ref, status: r.status, package: r.packageTitle, maktab: r.maktab, room: r.room, phone: r.phone, email: r.email, city: r.city, country: r.country, pilgrim: i + 1, ...p, createdAt: r.createdAt })));

  return (
    <>
      <PortalHead title="Hajj registrations" text="Pilgrims see the status and the public note on their tracking page.">
        <button onClick={() => downloadCSV(flat(list), 'registrations.csv')} className="btn-ghost"><Download size={16} />Export CSV (one row per pilgrim)</button>
      </PortalHead>
      <div className="mb-5 flex flex-wrap gap-2">
        {['all', ...REG_STATUS].map((x) => <button key={x} onClick={() => setFilter(x)} className={cx('rounded-full border px-4 py-1.5 text-[14px] capitalize', filter === x ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted')}>{x}</button>)}
      </div>
      {error && <p className="card mb-5 p-4 text-red-500">{error}</p>}
      {loading ? <Spinner /> : (
        <div className="card divide-hair overflow-hidden">
          {list.length === 0 && <p className="p-8 text-center text-muted">No registrations.</p>}
          {list.map((r) => (
            <button key={r.id} onClick={() => { setOpen(r); setNote(r.publicNote || ''); }} className="flex w-full flex-wrap items-center gap-4 px-5 py-4 text-left hover:bg-ink/[.03]">
              <span className="font-mono text-[14px] text-gold">{r.ref}</span>
              <span className="min-w-0 flex-1"><span className="font-medium">{r.leadName}</span><span className="text-muted"> · {r.packageTitle} · {r.room} · {(r.pilgrims || []).length} pilgrim(s)</span></span>
              <span className="rounded-full bg-ink/5 px-3 py-1 text-[12.5px] capitalize">{r.status}</span>
              <span className="text-[13px] text-muted">{fmtDate(r.createdAt)}</span>
            </button>
          ))}
        </div>
      )}
      <Drawer open={!!open} onClose={() => setOpen(null)} title={open?.ref}
        footer={open && <button className="btn-gold" onClick={async () => { await setStatus(open, open.status, note); setToast('Saved'); setTimeout(() => setToast(''), 2000); }}>Save note</button>}>
        {open && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <a href={waLink(open.phone, `Assalam o Alaikum, this is ${s.brandName} about registration ${open.ref}.`)} target="_blank" rel="noreferrer" className="btn !py-2 bg-[#1fae5b] text-[14px] text-white"><WhatsAppGlyph size={16} />{open.phone}</a>
              <a href={telLink(open.phone)} className="btn-ghost !py-2 text-[14px]"><Phone size={15} />Call</a>
            </div>
            <label className="block"><span className="label">Status</span>
              <select className="field capitalize" value={open.status} onChange={async (e) => { const st = e.target.value; await setStatus(open, st, note); setOpen({ ...open, status: st }); }}>{REG_STATUS.map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="block"><span className="label">Note shown to the pilgrim on the tracking page</span><textarea className="field" rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Please send a clearer passport photo." /></label>
            <dl className="grid gap-x-6 gap-y-3 rounded-2xl bg-raised p-5 text-[14.5px] sm:grid-cols-2">
              {[['Package', open.packageTitle], ['Maktab', open.maktab], ['Room', open.room], ['Email', open.email], ['City', open.city], ['Country', open.country]].map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd>{v || '—'}</dd></div>)}
            </dl>
            {(open.pilgrims || []).map((p, i) => (
              <div key={i} className="rounded-2xl border hairline p-5">
                <h3 className="font-display text-xl">Pilgrim {i + 1}: {p.name}</h3>
                <dl className="mt-3 grid gap-x-6 gap-y-2 text-[14px] sm:grid-cols-2">
                  {[['Gender', p.gender], ['CNIC / NICOP', p.cnic], ['Date of birth', p.dob], ['Passport', p.passport], ['Expiry', p.passportExpiry], ['Relation', p.relation]].map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd>{v || '—'}</dd></div>)}
                </dl>
                {p.document && <a href={p.document} target="_blank" rel="noreferrer" className="btn-ghost mt-4 !py-2 text-[14px]"><FileText size={15} />Open passport scan</a>}
              </div>
            ))}
          </div>
        )}
      </Drawer>
      <Toast msg={toast} />
    </>
  );
}
