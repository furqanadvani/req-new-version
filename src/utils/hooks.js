import { useEffect, useRef, useState } from 'react';

export function useCountdown(target) {
  const t = new Date(target).getTime();
  const calc = () => Math.max(0, t - Date.now());
  const [left, setLeft] = useState(calc);
  useEffect(() => { const id = setInterval(() => setLeft(calc()), 1000); return () => clearInterval(id); }, [t]);
  const s = Math.floor(left / 1000);
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60, done: left === 0 };
}

export function useLocalStorage(key, initial) {
  const [v, setV] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} }, [key, v]);
  return [v, setV];
}

export function useScrolled(y = 40) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > y);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [y]);
  return s;
}

export function useInView(opts = { rootMargin: '0px' }) {
  const ref = useRef(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => set(e.isIntersecting), opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

/** Today's prayer times for a city (Aladhan public API, Umm al-Qura method). */
export function usePrayerTimes(city, country = 'Saudi Arabia') {
  const [data, setData] = useState(null);
  useEffect(() => {
    let off = false;
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=4`)
      .then((r) => r.json())
      .then((j) => !off && setData({ timings: j.data.timings, hijri: j.data.date.hijri }))
      .catch(() => !off && setData({ error: true }));
    return () => { off = true; };
  }, [city, country]);
  return data;
}
