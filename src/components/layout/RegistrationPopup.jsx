import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { BrandMark } from '../ui/Logo';
import { useSettings } from '@/utils/api';
import { useCountdown } from '@/utils/hooks';
import { ROUTES } from '@/utils/constants';
import { isPrerender } from '@/utils/helpers';

const KEY = 'krh-popup-dismissed';

/** Shown once after the intro, after `popupDelay` seconds, never on the registration page. Dismissal lasts 3 days. */
export function RegistrationPopup({ ready }) {
  const s = useSettings();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const cd = useCountdown(s.arafahDate);

  useEffect(() => {
    if (!ready || !s.popupEnabled || !s.registrationOpen || isPrerender() || pathname === ROUTES.register) return;
    try { const t = Number(localStorage.getItem(KEY)); if (t && Date.now() - t < 3 * 864e5) return; } catch {}
    const id = setTimeout(() => setOpen(true), (Number(s.popupDelay) || 6) * 1000);
    return () => clearTimeout(id);
  }, [ready, s.popupEnabled, pathname]);

  const close = () => { setOpen(false); try { localStorage.setItem(KEY, String(Date.now())); } catch {} };

  return (
    <Modal open={open} onClose={close} label="Hajj registration" className="max-w-[520px]">
      <div className="relative overflow-hidden">
        <div className="kiswah-tex relative px-8 pb-8 pt-10 text-center text-[#f4eee2]">
          <BrandMark className="mx-auto h-16 w-16 !text-[#d4af6a]" />
          <p className="mt-5 text-[13px] text-[#f0d49a]">Hajj {s.hajjYear} registration is open</p>
          <h2 className="mx-auto mt-2 max-w-sm text-[28px] leading-tight">{s.popupTitle}</h2>
          {!cd.done && (
            <div className="mx-auto mt-6 grid max-w-xs grid-cols-3 gap-2">
              {[['Days', cd.days], ['Hours', cd.hours], ['Min', cd.minutes]].map(([l, v]) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-white/5 py-3">
                  <div className="font-display text-2xl text-[#f0d49a] tabular-nums">{v}</div>
                  <div className="text-[11.5px] text-white/50">{l} to Arafah</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-8 py-7">
          <p className="text-center text-[15.5px] text-muted">{s.popupText}</p>
          <ul className="mt-5 grid grid-cols-2 gap-2 text-[14px]">
            {['Visa & flights', 'Hotels near Haram', 'Guided ziarat', 'Scholars with group'].map((t) => (
              <li key={t} className="flex items-center gap-2"><Check size={16} className="text-gold" />{t}</li>
            ))}
          </ul>
          <div className="mt-7 flex gap-3">
            <Link to={ROUTES.register} onClick={close} className="btn-gold flex-1">Register now</Link>
            <button onClick={close} className="btn-ghost">Maybe later</button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
