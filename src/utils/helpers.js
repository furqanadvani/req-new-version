export const cx = (...a) => a.filter(Boolean).join(' ');

export const slugify = (s = '') =>
  String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export const fmtPKR = (n) => (n || n === 0) ? `Rs ${Number(n).toLocaleString('en-PK')}` : '—';
export const fmtMoney = (n, cur = 'USD') => {
  if (!n && n !== 0) return '—';
  try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n); }
  catch { return `${cur} ${Math.round(n).toLocaleString()}`; }
};

/** Lowest PKR / USD price of a package (prices: [{room, pkr, usd}]) */
export const fromPrice = (pkg) => {
  const rows = (pkg?.prices || []).filter((r) => Number(r.pkr) || Number(r.usd));
  if (!rows.length) return null;
  const pkr = Math.min(...rows.map((r) => Number(r.pkr) || Infinity));
  const usd = Math.min(...rows.map((r) => Number(r.usd) || Infinity));
  return { pkr: isFinite(pkr) ? pkr : null, usd: isFinite(usd) ? usd : null };
};

export const toList = (v) => Array.isArray(v) ? v.filter(Boolean) : String(v || '').split('\n').map((s) => s.trim()).filter(Boolean);

export const waLink = (number, text = '') =>
  `https://wa.me/${String(number || '').replace(/\D/g, '')}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const telLink = (n) => `tel:${String(n || '').replace(/[^\d+]/g, '')}`;

export const tsToDate = (t) => (t?.toDate ? t.toDate() : t ? new Date(t) : null);
export const fmtDate = (t) => {
  const d = tsToDate(t);
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
};

export const refCode = (year = new Date().getFullYear()) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return `KRH${String(year).slice(-2)}-${s}`;
};

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const isPrerender = () =>
  typeof navigator !== 'undefined' && /HeadlessChrome|Prerender/i.test(navigator.userAgent);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function downloadCSV(rows, filename = 'export.csv') {
  if (!rows.length) return;
  const keys = [...new Set(rows.flatMap((r) => Object.keys(r)))];
  const esc = (v) => {
    const s = v?.toDate ? v.toDate().toISOString() : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = filename; a.click();
}

/** Checks the secret portal route segment against VITE_ADMIN_KEY_HASH (SHA-256). */
export async function isValidPortalKey(key) {
  const expected = (import.meta.env.VITE_ADMIN_KEY_HASH || '').trim().toLowerCase();
  if (!expected || !key || !window.crypto?.subtle) return false;
  return (await sha256(key)) === expected;
}
