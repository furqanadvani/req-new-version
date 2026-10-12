import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/utils/helpers';

let lenis = null;
export const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

/** Stops page scrolling while a full-screen overlay (mobile menu, modal) is open. */
export function lockScroll(on) {
  if (lenis) (on ? lenis.stop() : lenis.start());
  document.documentElement.style.overflow = on ? 'hidden' : '';
}

/** Lenis smooth scrolling on the public site (off for reduced motion). */
export function SmoothScroll() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (prefersReducedMotion()) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let id;
    const raf = (t) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    return () => { cancelAnimationFrame(id); lenis.destroy(); lenis = null; };
  }, []);
  useEffect(() => { scrollToTop(); }, [pathname]);
  return null;
}