import { useState } from 'react';
import { trackRegistration } from '@/utils/api';
import { REG_STATUS } from '@/utils/constants';
import { fmtDate, cx } from '@/utils/helpers';
import { Spinner } from '../ui/Section';

/** Pilgrims check their registration status with the reference code + last 4 phone digits. */
export function TrackForm({ initialRef = '' }) {
  const [ref, setRef] = useState(initialRef);
  const [last4, setLast4] = useState('');
  const [res, setRes] = useState(null);
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true); setRes(null);
    try {
      const d = await trackRegistration(ref);
      setRes(d && d.phoneLast4 === last4.trim() ? d : { notFound: true });
    } catch (e2) { setRes({ error: e2.message }); }
    setBusy(false);
  }
  const steps = REG_STATUS.filter((x) => x !== 'cancelled');
  const at = res?.status ? steps.indexOf(res.status) : -1;
  return (
    <div className="card p-6 sm:p-10">
      <form onSubmit={go} className="grid gap-4 sm:grid-cols-[1.4fr_1fr_auto] sm:items-end">
        <label><span className="label">Reference code</span><input required className="field uppercase" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="KRH27-XXXXXX" /></label>
        <label><span className="label">Last 4 digits of phone</span><input required inputMode="numeric" maxLength={4} className="field" value={last4} onChange={(e) => setLast4(e.target.value.replace(/\D/g, ''))} /></label>
        <button className="btn-gold" disabled={busy}>{busy ? <Spinner /> : 'Check status'}</button>
      </form>
      {res?.notFound && <p className="mt-6 text-muted" role="status">No registration matches that code and phone number. Check the code in your confirmation, or call us.</p>}
      {res?.error && <p className="mt-6 text-red-500" role="alert">{res.error}</p>}
      {res?.status && (
        <div className="mt-10" role="status">
          <p className="text-muted">{res.package} · {res.pilgrims} pilgrim{res.pilgrims > 1 ? 's' : ''} · updated {fmtDate(res.updatedAt)}</p>
          {res.status === 'cancelled' ? <p className="mt-4 font-display text-2xl text-red-500">This registration was cancelled.</p> : (
            <ol className="mt-6 grid gap-3 sm:grid-cols-5">
              {steps.map((st, i) => (
                <li key={st} className={cx('rounded-2xl border p-4 text-[14px] capitalize', i <= at ? 'border-gold bg-gold/10' : 'hairline text-muted')}>
                  <span className="block text-[12px] opacity-70">Step {i + 1}</span>{st}
                </li>
              ))}
            </ol>
          )}
          {res.note && <p className="mt-6 rounded-2xl bg-raised p-5 text-[15px]"><strong className="font-medium">Note from our team:</strong> {res.note}</p>}
        </div>
      )}
    </div>
  );
}
