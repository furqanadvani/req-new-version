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

export function ThemeToggle({ className = '' }) {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cx('relative grid h-10 w-10 place-items-center overflow-hidden rounded-full border ring-cur transition', className)}>
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
  // Every public page opens with a dark hero, so the header starts transparent over it.
  const clear = !scrolled && !open;

  return (
    <>
      <header className={cx('fixed inset-x-0 top-0 z-[60] transition-all duration-500 ease-silk',
        clear ? 'text-white' : 'border-b hairline bg-bg/80 text-ink backdrop-blur-xl')}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className={cx('wrap flex items-center justify-between gap-4 transition-all duration-500', scrolled ? 'h-[68px]' : 'h-[84px]')}>
          <Link to="/" aria-label={`${s.brandName} home`}><Logo light={clear} /></Link>
          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Main">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cx('relative whitespace-nowrap rounded-full px-3 py-2 text-[14.5px] transition',
                isActive ? 'text-gold' : clear ? 'text-white/80 hover:text-white' : 'text-ink/75 hover:text-ink')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <CurrencySelect className="hidden sm:block" />
            <ThemeToggle />
            {s.registrationOpen && <Link to={ROUTES.register} className="btn-gold hidden whitespace-nowrap !py-2.5 md:inline-flex">Hajj {s.hajjYear} registration</Link>}
            <button onClick={() => setOpen((o) => !o)} className="grid h-10 w-10 place-items-center rounded-full border ring-cur xl:hidden" aria-label="Menu" aria-expanded={open}>
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[55] bg-bg xl:hidden" initial={{ clipPath: 'circle(0% at 95% 4%)' }} animate={{ clipPath: 'circle(150% at 95% 4%)' }} exit={{ clipPath: 'circle(0% at 95% 4%)' }} transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}>
            <div className="wrap flex h-full flex-col pb-10 pt-28">
              <nav className="flex flex-col" aria-label="Mobile">
                {NAV.map((n, i) => (
                  <motion.div key={n.to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <NavLink to={n.to} className={({ isActive }) => cx('block border-b hairline py-4 font-display text-[30px]', isActive && 'text-gold')}>{n.label}</NavLink>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <Link to={ROUTES.register} className="btn-gold flex-1">Register for Hajj {s.hajjYear}</Link>
                <a href={telLink(s.phones?.[0])} className="btn-ghost"><Phone size={16} /> Call</a>
                <CurrencySelect />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
