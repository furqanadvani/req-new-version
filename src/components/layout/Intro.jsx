import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandMark } from '../ui/Logo';
import { useSettings } from '@/utils/api';
import { isPrerender, prefersReducedMotion } from '@/utils/helpers';

const ease = [0.65, 0, 0.35, 1];
const KEY = 'krh-intro-seen';

/**
 * First-visit intro. Seven gold points circle the logo — the seven circuits of Tawaf —
 * while the calligraphy draws itself in. Then the Kiswah parts like a curtain.
 * Shown once per browser session; skipped for bots, prerender and reduced motion.
 */
export function Intro({ onDone }) {
  const s = useSettings();
  const [show] = useState(() => {
    if (typeof window === 'undefined' || isPrerender() || prefersReducedMotion()) return false;
    try { return !sessionStorage.getItem(KEY); } catch { return true; }
  });
  const [phase, setPhase] = useState(show ? 'draw' : 'done');

  useEffect(() => {
    if (!show) { onDone?.(); return; }
    document.documentElement.style.overflow = 'hidden';
    const t1 = setTimeout(() => setPhase('open'), 3300);
    const t2 = setTimeout(finish, 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  function finish() {
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    document.documentElement.style.overflow = '';
    setPhase('done');
    onDone?.();
  }

  if (phase === 'done') return null;
  const open = phase === 'open';

  return (
    <div className="fixed inset-0 z-[200] cursor-pointer select-none" onClick={finish} aria-hidden="true">
      {/* Curtain halves */}
      {['top', 'bottom'].map((side) => (
        <motion.div key={side}
          className={`absolute inset-x-0 ${side === 'top' ? 'top-0' : 'bottom-0'} h-1/2 kiswah-tex`}
          animate={open ? { y: side === 'top' ? '-100%' : '100%' } : { y: 0 }}
          transition={{ duration: 1.1, ease }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: open ? 1 : 0 }} transition={{ duration: 0.3 }} className={`absolute inset-x-0 ${side === 'top' ? 'bottom-0' : 'top-0'} h-[3px] bg-gradient-to-r from-transparent via-[#e9c98a] to-transparent`} />
        </motion.div>
      ))}

      <AnimatePresence>
        {!open && (
          <motion.div className="absolute inset-0 grid place-items-center" exit={{ opacity: 0, scale: 1.08 }} transition={{ duration: 0.5 }}>
            <div className="relative grid h-[min(64vw,300px)] w-[min(64vw,300px)] place-items-center">
              {/* Orbit ring */}
              <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
                <motion.circle cx="100" cy="100" r="96" fill="none" stroke="#d4af6a" strokeOpacity=".35" strokeWidth=".6"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease }} />
              </svg>
              {/* Seven circuits, counter-clockwise like Tawaf */}
              <motion.div className="absolute inset-0" initial={{ rotate: 0 }} animate={{ rotate: -360 }} transition={{ duration: 3.2, ease: [0.4, 0, 0.2, 1] }}>
                {Array.from({ length: 7 }).map((_, i) => (
                  <motion.span key={i} className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -ml-[3px] -mt-[3px] rounded-full bg-[#f0d49a] shadow-[0_0_12px_#f0d49a]"
                    style={{ transform: `rotate(${(i * 360) / 7}deg) translateY(calc(min(64vw,300px) / -2 + 2px))` }}
                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0.6] }} transition={{ delay: 0.15 * i, duration: 2.6 }} />
                ))}
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }}
                className="h-[62%] w-[62%] text-[#d4af6a] drop-shadow-[0_0_30px_rgba(212,175,106,.35)]">
                <BrandMark draw className="h-full w-full !text-[#d4af6a]" />
              </motion.div>
            </div>
            <div className="absolute bottom-[14vh] left-0 right-0 text-center">
              <motion.p lang="ar" dir="rtl" className="font-arabic text-[26px] text-[#e9c98a]"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }}>
                لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ
              </motion.p>
              <motion.p className="mt-2 font-display text-[15px] tracking-[0.2em] text-white/60"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 1 }}>
                {s.brandName}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
