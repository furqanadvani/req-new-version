import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { prefersReducedMotion } from '@/utils/helpers';

let lenis = null;

/** Jumps to the top even while Lenis is stopped (e.g. the mobile menu is still closing). */
export const scrollToTop = () => {
  lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
};

/** Stops page scrolling while a full-screen overlay (mobile menu, modal) is open. */
export function lockScroll(on) {
  document.documentElement.style.overflow = on ? 'hidden' : '';
  if (!lenis) return;
  if (on) lenis.stop();
  else lenis.start();
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

  // New page → top. Runs now and again on the next frame, after the menu has unlocked scrolling.
  useEffect(() => {
    scrollToTop();
    const id = requestAnimationFrame(scrollToTop);
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}