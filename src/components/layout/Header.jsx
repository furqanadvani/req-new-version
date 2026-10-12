import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, Phone } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { NAV, ROUTES } from '@/utils/constants';
import { useScrolled } from '@/utils/hooks';
import { useTheme } from '@/utils/theme';
import { useSettings } from '@/utils/api';
import { CURRENCIES, useMoney } from '@/utils/currency';
import { cx, telLink } from '@/utils/helpers';
import { lockScroll } from './SmoothScroll';

export function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cx('relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border ring-cur transition', className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ y: 18, opacity: 0, rotate: -40 }} animate={{ y: 0, opacity: 1, rotate: 0 }} exit={{ y: -18, opacity: 0, rotate: 40 }} transition={{ duration: 0.35 }}>
          {theme === 'dark' ? <Moon size={17} /> : <Sun size={17} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

export function CurrencySelect({ className = '' }) {
  const { currency, setCurrency } = useMoney();
  return (
    <label className={cx('relative', className)}>
      <span className="sr-only">Show prices in</span>
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}
        className="h-10 cursor-pointer appearance-none rounded-full border ring-cur bg-transparent px-3.5 text-[13px] font-medium outline-none">
        {CURRENCIES.map((c) => <option key={c} value={c} className="bg-surface text-ink">{c}</option>)}
      </select>
    </label>
  );
}

export function Header() {
  const scrolled = useScrolled(30);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const s = useSettings();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { lockScroll(open); return () => lockScroll(false); }, [open]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);

  // Every public page opens with a dark hero, so the header starts transparent over it.
  const clear = !scrolled && !open;

  return (
    <>
      <header className={cx('fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-silk',
        clear ? 'bg-gradient-to-b from-black/60 to-transparent text-white' : 'border-b hairline bg-bg/85 text-ink backdrop-blur-xl')}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className={cx('wrap flex items-center justify-between gap-3 transition-all duration-500', scrolled || open ? 'h-[64px] sm:h-[68px]' : 'h-[72px] sm:h-[84px]')}>
          <Link to="/" aria-label={`${s.brandName} home`} className="min-w-0"><Logo light={clear} /></Link>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cx('relative whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] transition',
                isActive ? 'text-gold' : clear ? 'text-white/80 hover:text-white' : 'text-ink/75 hover:text-ink')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2 shrink-0">
            <CurrencySelect className="hidden sm:block" />
            <ThemeToggle />
            {s.registrationOpen && <Link to={ROUTES.register} className="btn-gold hidden whitespace-nowrap !py-2.5 md:inline-flex">Hajj {s.hajjYear} registration</Link>}
            <button onClick={() => setOpen((o) => !o)} className="grid w-10 h-10 border rounded-full shrink-0 place-items-center ring-cur xl:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div data-lenis-prevent
            className="fixed inset-0 z-[55] overflow-y-auto overscroll-contain bg-bg xl:hidden"
            initial={{ clipPath: 'circle(0% at 95% 4%)' }} animate={{ clipPath: 'circle(150% at 95% 4%)' }} exit={{ clipPath: 'circle(0% at 95% 4%)' }}
            transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}>
            <div className="wrap flex min-h-full flex-col pt-[88px]" style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}>
              <nav className="flex flex-col" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div key={n.to} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.04 }}>
                    <NavLink to={n.to} className={({ isActive }) => cx('flex items-center justify-between border-b hairline py-3.5 font-display text-[24px] sm:text-[28px]', isActive && 'text-gold')}>
                      {n.label}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="pt-8 mt-auto space-y-3">
                {s.registrationOpen && <Link to={ROUTES.register} className="w-full btn-gold">Hajj {s.hajjYear} registration</Link>}
                <div className="flex items-center gap-3">
                  <a href={telLink(s.phones?.[0])} className="flex-1 btn-ghost"><Phone size={16} />{s.phones?.[0]}</a>
                  <CurrencySelect />
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}