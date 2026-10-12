import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './api';
import { DEFAULT_THEME } from './constants';

const ThemeCtx = createContext({ theme: 'dark', toggle: () => {} });

const rgb = (hex, fb) => {
  const h = String(hex || fb || '').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  return Number.isNaN(n) ? rgb(fb) : `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

/** Turns the portal's theme settings into CSS variables (both modes) and loads chosen fonts. */
function buildCss(t) {
  const d = { ...DEFAULT_THEME, ...t };
  return `:root{--bg:${rgb(d.lightBg)};--surface:${rgb(d.lightSurface)};--raised:${rgb(d.lightRaised)};--ink:${rgb(d.lightInk)};--muted:${rgb(d.lightMuted)};--line:${rgb(d.lightInk)};--gold:${rgb(d.lightGold)};--gold2:${rgb(d.lightGold2)};--radius:${Number(d.radius) || 22}px;--font-display:'${d.displayFont}','${d.displayFont} Variable';--font-body:'${d.bodyFont}','${d.bodyFont} Variable';}
.dark{--bg:${rgb(d.darkBg)};--surface:${rgb(d.darkSurface)};--raised:${rgb(d.darkRaised)};--ink:${rgb(d.darkInk)};--muted:${rgb(d.darkMuted)};--line:${rgb(d.darkInk)};--gold:${rgb(d.gold)};--gold2:${rgb(d.gold2)};}`;
}

function loadFonts(t) {
  const fams = [t.displayFont, t.bodyFont].filter((f) => f && !['Marcellus', 'Figtree'].includes(f));
  if (!fams.length) return;
  const href = `https://fonts.googleapis.com/css2?${fams.map((f) => `family=${f.replace(/ /g, '+')}:wght@300;400;500;600;700`).join('&')}&display=swap`;
  let el = document.getElementById('krh-fonts');
  if (!el) { el = document.createElement('link'); el.id = 'krh-fonts'; el.rel = 'stylesheet'; document.head.appendChild(el); }
  if (el.href !== href) el.href = href;
}

export function ThemeProvider({ children }) {
  const settings = useSettings();
  const t = settings.theme || DEFAULT_THEME;
  const [theme, setTheme] = useState(() => {
    try { const saved = localStorage.getItem('krh-theme'); if (saved) return saved; } catch {}
    return t.defaultMode || 'dark';
  });

  useEffect(() => {
    let el = document.getElementById('krh-theme');
    if (!el) { el = document.createElement('style'); el.id = 'krh-theme'; document.head.appendChild(el); }
    el.textContent = buildCss(t);
    loadFonts(t);
    const fav = document.querySelector('link[rel="icon"]');
    if (fav && settings.faviconUrl) fav.href = settings.faviconUrl;
  }, [JSON.stringify(t), settings.faviconUrl]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    const bg = theme === 'dark' ? t.darkBg : t.lightBg;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg || '#0a0907');
  }, [theme, t.darkBg, t.lightBg]);

  const toggle = () => setTheme((m) => {
    const next = m === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('krh-theme', next); } catch {}
    return next;
  });
  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}
export const useTheme = () => useContext(ThemeCtx);
