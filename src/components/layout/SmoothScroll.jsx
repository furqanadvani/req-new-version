import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/utils/helpers';

let lenis = null;
export const scrollToTop = () => (lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0));

/** Lenis smooth scrolling on the public site (off for reduced motion and touch is native). */
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
