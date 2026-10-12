import { useState } from 'react';
import { Check, Lock } from 'lucide-react';
import { submitQuery, useSettings } from '@/utils/api';
import { Spinner } from '../ui/Section';
import { waLink } from '@/utils/helpers';

const SERVICES = ['Hajj', 'Umrah', 'Islamic tour', 'Visa only', 'Hotel only', 'Other'];

/** Every submission lands in Portal → Queries. `packageTitle` pre-fills from a package page. */
export function InquiryForm({ packageTitle = '', compact = false }) {
  const s = useSettings();
  const [f, setF] = useState({ name: '', phone: '', email: '', country: 'Pakistan', service: packageTitle ? (/umrah/i.test(packageTitle) ? 'Umrah' : 'Hajj') : '', travellers: 1, message: '', website: '' });
  const [state, setState] = useState('idle');
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    if (f.website) return; // honeypot
    setState('sending'); setErr('');
    try {
      const { website, ...data } = f;
      await submitQuery({ ...data, travellers: Number(f.travellers) || 1, package: packageTitle });
      setState('sent');
    } catch (e2) { setErr(e2.message); setState('idle'); }
  }

  if (state === 'sent') return (
    <div className="card p-8 text-center sm:p-12" role="status">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold text-black"><Check /></span>
      <h3 className="mt-5 text-3xl">Message received</h3>
      <p className="mx-auto mt-3 max-w-sm text-muted">Our team will call {f.phone} within 24 hours, in sha Allah. For anything urgent, message us on WhatsApp.</p>
      <a href={waLink(s.whatsapp, `Assalam o Alaikum, I just sent an inquiry${packageTitle ? ` about ${packageTitle}` : ''}. My name is ${f.name}.`)} target="_blank" rel="noreferrer" className="btn-gold mt-7">Continue on WhatsApp</a>
    </div>
  );

  return (
    <form onSubmit={onSubmit} className={compact ? '' : 'card p-6 sm:p-10'} noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label><span className="label">Full name</span><input required className="field" value={f.name} onChange={set('name')} autoComplete="name" /></label>
        <label><span className="label">Phone / WhatsApp</span><input required type="tel" className="field" value={f.phone} onChange={set('phone')} autoComplete="tel" placeholder="+92 3xx xxxxxxx" /></label>
        <label><span className="label">Email (optional)</span><input type="email" className="field" value={f.email} onChange={set('email')} autoComplete="email" /></label>
        <label><span className="label">You live in</span><input className="field" value={f.country} onChange={set('country')} autoComplete="country-name" /></label>
        {!packageTitle && <label><span className="label">Interested in</span><select required className="field" value={f.service} onChange={set('service')}><option value="">Choose one</option>{SERVICES.map((x) => <option key={x}>{x}</option>)}</select></label>}
        <label><span className="label">Travellers</span><input type="number" min="1" className="field" value={f.travellers} onChange={set('travellers')} /></label>
        <label className="sm:col-span-2"><span className="label">Your plans</span><textarea rows={compact ? 3 : 4} className="field resize-none" value={f.message} onChange={set('message')} placeholder="Preferred dates, group size, questions…" /></label>
        <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set('website')} className="hidden" aria-hidden="true" />
      </div>
      {err && <p className="mt-4 text-[14px] text-red-500" role="alert">{err}</p>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-2 text-[13px] text-muted"><Lock size={14} />Used only to contact you about your trip.</p>
        <button disabled={state === 'sending'} className="btn-gold">{state === 'sending' ? <Spinner className="!border-black/30 !border-t-black" /> : 'Send inquiry'}</button>
      </div>
    </form>
  );
}
