import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Hizam } from '../ui/Ornament';
import { ROUTES } from '@/utils/constants';
import { useSettings, subscribe } from '@/utils/api';
import { telLink, waLink } from '@/utils/helpers';

const cols = [
  { title: 'Travel', links: [['Hajj packages', ROUTES.hajj], ['Umrah packages', ROUTES.umrah], ['Hajj registration', ROUTES.register], ['Track registration', ROUTES.track], ['Overseas Pakistanis', ROUTES.overseas]] },
  { title: 'Company', links: [['About us', ROUTES.about], ['Services', ROUTES.services], ['Pilgrim toolkit', ROUTES.toolkit], ['Contact', ROUTES.contact]] },
];

export function Footer() {
  const s = useSettings();
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  async function onSub(e) {
    e.preventDefault();
    try { await subscribe(email); setMsg('Subscribed. Package alerts will reach your inbox.'); setEmail(''); }
    catch (err) { setMsg(err.message); }
  }
  const socials = [[s.facebook, Facebook, 'Facebook'], [s.instagram, Instagram, 'Instagram'], [s.youtube, Youtube, 'YouTube']].filter(([u]) => u);

  return (
    <footer className="relative kiswah-tex text-[#e9e2d3]">
      <Hizam />
      <div className="wrap grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <Logo light />
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/60">{s.tagline}. {s.licenseText}.</p>
          <ul className="mt-7 space-y-3 text-[14.5px] text-white/75">
            <li><a href={telLink(s.phones?.[0])} className="flex gap-3 hover:text-[#f0d49a]"><Phone size={17} className="mt-0.5 text-[#d4af6a]" />{s.phones?.join('  /  ')}</a></li>
            <li><a href={`mailto:${s.email}`} className="flex gap-3 hover:text-[#f0d49a]"><Mail size={17} className="mt-0.5 text-[#d4af6a]" />{s.email}</a></li>
            <li className="flex gap-3"><MapPin size={17} className="mt-0.5 shrink-0 text-[#d4af6a]" />{s.address}</li>
            <li className="flex gap-3"><Clock size={17} className="mt-0.5 text-[#d4af6a]" />{s.hours}</li>
          </ul>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="md:col-span-2">
            <h3 className="mb-5 font-display text-lg text-[#f0d49a]">{c.title}</h3>
            <ul className="space-y-3 text-[14.5px] text-white/65">
              {c.links.map(([l, to]) => <li key={to}><Link to={to} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </div>
        ))}
        <div className="md:col-span-4">
          <h3 className="mb-3 font-display text-lg text-[#f0d49a]">Package alerts</h3>
          <p className="text-[14.5px] text-white/60">New Hajj and Umrah packages, price changes and registration dates. One email when it matters.</p>
          <form onSubmit={onSub} className="mt-5 flex gap-2">
            <label className="sr-only" htmlFor="ft-email">Email</label>
            <input id="ft-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-[15px] text-white placeholder:text-white/35 outline-none focus:border-[#d4af6a]" />
            <button className="btn-gold !px-5">Subscribe</button>
          </form>
          {msg && <p className="mt-3 text-[13.5px] text-white/60" role="status">{msg}</p>}
          <div className="mt-8 flex gap-2">
            {socials.map(([u, I, l]) => <a key={l} href={u} target="_blank" rel="noreferrer" aria-label={l} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 hover:border-[#d4af6a] hover:text-[#f0d49a]"><I size={18} /></a>)}
            <a href={waLink(s.whatsapp)} target="_blank" rel="noreferrer" className="flex h-11 items-center rounded-full border border-white/15 px-4 text-[14px] hover:border-[#d4af6a]">WhatsApp {s.whatsapp}</a>
          </div>
          <p lang="ar" dir="rtl" className="mt-10 text-left font-arabic text-2xl text-[#d4af6a]/70">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col justify-between gap-3 py-6 text-[13px] text-white/45 sm:flex-row" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
          <p>© {new Date().getFullYear()} {s.legalName}. All rights reserved.</p>
          <p className="flex gap-5"><Link to={ROUTES.terms} className="hover:text-white">Terms & refunds</Link><Link to={ROUTES.privacy} className="hover:text-white">Privacy</Link></p>
        </div>
      </div>
    </footer>
  );
}
