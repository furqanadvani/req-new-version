import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Minus, Plus, Upload, ClipboardCheck, Users, FileCheck2 } from 'lucide-react';
import { useCollection, useSettings, submitRegistration, uploadFile } from '@/utils/api';
import { useMoney } from '@/utils/currency';
import { COLLECTIONS, MAKTABS, ROOM_TYPES, ROUTES } from '@/utils/constants';
import { cx, refCode, waLink } from '@/utils/helpers';
import { Spinner } from '../ui/Section';

const STEPS = [['Booking', ClipboardCheck], ['Pilgrims', Users], ['Review', FileCheck2]];
const blank = () => ({ name: '', gender: '', dob: '', cnic: '', passport: '', passportExpiry: '', relation: '', file: null });

export function RegistrationWizard() {
  const s = useSettings();
  const [params] = useSearchParams();
  const hajj = useCollection(COLLECTIONS.hajj).items;
  const latest = Math.max(...hajj.map((p) => p.year || 0));
  const current = hajj.filter((p) => p.year === latest);
  const { format } = useMoney();

  const [step, setStep] = useState(0);
  const [b, setB] = useState({ packageId: params.get('package') || '', maktab: '', room: params.get('room') || '', count: 1 });
  const [lead, setLead] = useState({ phone: '', email: '', city: '', country: 'Pakistan' });
  const [pilgrims, setPilgrims] = useState([blank()]);
  const [agree, setAgree] = useState(false);
  const [state, setState] = useState({ busy: false, err: '', ref: '', progress: 0 });

  useEffect(() => { setPilgrims((p) => Array.from({ length: b.count }, (_, i) => p[i] || blank())); }, [b.count]);
  const pkg = current.find((p) => p.id === b.packageId);
  useEffect(() => { if (pkg && !b.maktab) setB((x) => ({ ...x, maktab: pkg.maktab || '' })); }, [pkg]);
  const rooms = pkg ? (pkg.prices || []).map((p) => p.room) : ROOM_TYPES;
  const price = pkg && (pkg.prices || []).find((p) => p.room === b.room);

  const valid = [
    b.packageId && b.room && b.maktab && b.count > 0,
    lead.phone && pilgrims.every((p) => p.name && p.gender && p.cnic),
    agree,
  ];
  const setP = (i, k, v) => setPilgrims((arr) => arr.map((p, j) => (j === i ? { ...p, [k]: v } : p)));

  async function submit() {
    const ref = refCode(latest || s.hajjYear);
    setState({ busy: true, err: '', ref: '', progress: 0 });
    try {
      const files = pilgrims.filter((p) => p.file).length;
      let doneFiles = 0;
      const people = [];
      for (const p of pilgrims) {
        const { file, ...rest } = p;
        let doc = '';
        if (file) { doc = await uploadFile(file, `registrations/${ref}`, () => {}); doneFiles++; setState((x) => ({ ...x, progress: doneFiles / files })); }
        people.push({ ...rest, document: doc });
      }
      await submitRegistration(ref, {
        ...b, packageTitle: pkg ? `${pkg.title} ${pkg.year}` : '', priceEach: price || null,
        ...lead, phone: lead.phone, pilgrims: people, leadName: people[0]?.name || '',
      });
      setState({ busy: false, err: '', ref, progress: 1 });
    } catch (e) { setState({ busy: false, err: e.message, ref: '', progress: 0 }); }
  }

  if (state.ref) return (
    <div className="card mx-auto max-w-2xl p-8 text-center sm:p-14" role="status">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold text-black"><Check size={28} /></span>
      <h2 className="mt-6 text-4xl">Registration received</h2>
      <p className="mt-3 text-muted">Your reference code</p>
      <p className="mt-1 font-display text-[40px] tracking-wider text-gold">{state.ref}</p>
      <p className="mx-auto mt-4 max-w-md text-muted">Save this code. Our team will call {lead.phone} within 24 hours to confirm documents and payment. You can check progress any time.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`${ROUTES.track}?ref=${state.ref}`} className="btn-gold">Track my registration</Link>
        <a href={waLink(s.whatsapp, `Assalam o Alaikum, I registered for ${pkg?.title} ${pkg?.year}. Reference: ${state.ref}`)} target="_blank" rel="noreferrer" className="btn-ghost">Send code on WhatsApp</a>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-10 flex items-center justify-center">
        {STEPS.map(([l, I], i) => (
          <li key={l} className="flex items-center">
            <div className="flex flex-col items-center gap-2">
              <span className={cx('grid h-12 w-12 place-items-center rounded-full border transition duration-500', i < step ? 'border-gold bg-gold text-black' : i === step ? 'border-gold text-gold shadow-[0_0_0_6px_rgb(var(--gold)/.12)]' : 'hairline text-muted')}>{i < step ? <Check size={18} /> : <I size={18} />}</span>
              <span className={cx('text-[13px]', i === step ? 'text-gold' : 'text-muted')}>{l}</span>
            </div>
            {i < STEPS.length - 1 && <span className={cx('mx-3 mb-6 h-px w-14 sm:w-24', i < step ? 'bg-gold' : 'bg-ink/15')} />}
          </li>
        ))}
      </ol>

      <div className="card overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35 }} className="p-6 sm:p-10">
            {step === 0 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <h2 className="text-3xl sm:col-span-2">Choose your package</h2>
                <label className="sm:col-span-2"><span className="label">Package</span>
                  <select className="field" value={b.packageId} onChange={(e) => setB({ ...b, packageId: e.target.value, room: '' })}>
                    <option value="">Select a Hajj {latest} package</option>
                    {current.map((p) => <option key={p.id} value={p.id}>{p.title} {p.year}</option>)}
                  </select></label>
                <label><span className="label">Maktab</span>
                  <select className="field" value={b.maktab} onChange={(e) => setB({ ...b, maktab: e.target.value })}><option value="">Select maktab</option>{MAKTABS.map((m) => <option key={m} value={m}>Maktab {m}</option>)}</select></label>
                <label><span className="label">Room</span>
                  <select className="field" value={b.room} onChange={(e) => setB({ ...b, room: e.target.value })}><option value="">Select room</option>{rooms.map((r) => <option key={r}>{r}</option>)}</select></label>
                <div><span className="label">Number of pilgrims</span>
                  <div className="flex items-center rounded-xl border hairline">
                    <button type="button" aria-label="Fewer" onClick={() => setB({ ...b, count: Math.max(1, b.count - 1) })} className="grid h-12 w-12 place-items-center"><Minus size={16} /></button>
                    <span className="flex-1 text-center font-display text-xl tabular-nums">{b.count}</span>
                    <button type="button" aria-label="More" onClick={() => setB({ ...b, count: Math.min(12, b.count + 1) })} className="grid h-12 w-12 place-items-center"><Plus size={16} /></button>
                  </div></div>
                {price && <div className="rounded-2xl bg-raised p-4 text-[15px]"><span className="text-muted">Estimated total</span><span className="block font-display text-2xl text-gold">{format((Number(price.pkr) || 0) * b.count || null, (Number(price.usd) || 0) * b.count || null)}</span></div>}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-3xl">Pilgrim details</h2>
                <p className="mt-2 text-muted">Enter details exactly as on the passport. Uploading a passport scan now saves a visit later; it is optional.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label><span className="label">Contact phone / WhatsApp</span><input required type="tel" className="field" value={lead.phone} onChange={(e) => setLead({ ...lead, phone: e.target.value })} /></label>
                  <label><span className="label">Email</span><input type="email" className="field" value={lead.email} onChange={(e) => setLead({ ...lead, email: e.target.value })} /></label>
                  <label><span className="label">City</span><input className="field" value={lead.city} onChange={(e) => setLead({ ...lead, city: e.target.value })} /></label>
                  <label><span className="label">Country of residence</span><input className="field" value={lead.country} onChange={(e) => setLead({ ...lead, country: e.target.value })} /></label>
                </div>
                <div className="mt-8 space-y-5">
                  {pilgrims.map((p, i) => (
                    <fieldset key={i} className="rounded-2xl border hairline p-5">
                      <legend className="px-2 font-display text-lg">Pilgrim {i + 1}</legend>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <label><span className="label">Full name</span><input required className="field" value={p.name} onChange={(e) => setP(i, 'name', e.target.value)} /></label>
                        <label><span className="label">Gender</span><select required className="field" value={p.gender} onChange={(e) => setP(i, 'gender', e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></label>
                        <label><span className="label">CNIC / NICOP</span><input required className="field" value={p.cnic} onChange={(e) => setP(i, 'cnic', e.target.value)} placeholder="42101-xxxxxxx-x" /></label>
                        <label><span className="label">Date of birth</span><input type="date" className="field" value={p.dob} onChange={(e) => setP(i, 'dob', e.target.value)} /></label>
                        <label><span className="label">Passport number</span><input className="field uppercase" value={p.passport} onChange={(e) => setP(i, 'passport', e.target.value)} /></label>
                        <label><span className="label">Passport expiry</span><input type="date" className="field" value={p.passportExpiry} onChange={(e) => setP(i, 'passportExpiry', e.target.value)} /></label>
                        {i > 0 && <label><span className="label">Relation to pilgrim 1</span><input className="field" value={p.relation} onChange={(e) => setP(i, 'relation', e.target.value)} placeholder="Wife, son, mother…" /></label>}
                        <label className={cx('flex cursor-pointer items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-[14.5px] hairline hover:border-gold', i === 0 && 'sm:col-span-2')}>
                          <Upload size={17} className="text-gold" /><span className="truncate">{p.file ? p.file.name : 'Passport scan (image or PDF, optional)'}</span>
                          <input type="file" accept="image/*,application/pdf" className="sr-only" onChange={(e) => setP(i, 'file', e.target.files?.[0] || null)} />
                        </label>
                      </div>
                    </fieldset>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-3xl">Review and send</h2>
                <dl className="mt-6 divide-hair rounded-2xl border hairline">
                  {[['Package', pkg ? `${pkg.title} ${pkg.year}` : '—'], ['Maktab', b.maktab], ['Room', b.room], ['Pilgrims', pilgrims.map((p) => p.name).join(', ')], ['Contact', `${lead.phone}${lead.email ? ` · ${lead.email}` : ''}`], ['Estimated total', price ? format((Number(price.pkr) || 0) * b.count || null, (Number(price.usd) || 0) * b.count || null) : '—']].map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-6 px-5 py-3.5 text-[15px]"><dt className="text-muted">{k}</dt><dd className="text-right">{v}</dd></div>
                  ))}
                </dl>
                <label className="mt-6 flex items-start gap-3 text-[14.5px]"><input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-1 h-5 w-5 accent-[rgb(var(--gold))]" />
                  <span>I confirm these details are correct and agree to the <Link to={ROUTES.terms} className="text-gold underline">terms and refund policy</Link>. No payment is taken until the team confirms with me.</span></label>
                {state.err && <p className="mt-4 text-[14px] text-red-500" role="alert">{state.err}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex items-center justify-between border-t hairline px-6 py-5 sm:px-10">
          <button onClick={() => setStep((x) => x - 1)} disabled={step === 0 || state.busy} className="btn-ghost !py-2.5">Back</button>
          {step < 2
            ? <button onClick={() => setStep((x) => x + 1)} disabled={!valid[step]} className="btn-gold">Continue</button>
            : <button onClick={submit} disabled={!valid[2] || state.busy} className="btn-gold">{state.busy ? <><Spinner className="!border-black/30 !border-t-black" />{state.progress > 0 && state.progress < 1 ? `Uploading ${Math.round(state.progress * 100)}%` : 'Sending'}</> : 'Send registration'}</button>}
        </div>
      </div>
    </div>
  );
}
