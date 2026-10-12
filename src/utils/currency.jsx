import { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from './api';

export const CURRENCIES = ['PKR', 'USD', 'GBP', 'EUR', 'SAR', 'AED', 'CAD', 'AUD'];
const CurCtx = createContext({ currency: 'PKR', setCurrency: () => {} });

/** Guess a visitor's currency from their browser locale (overseas Pakistanis see their own). */
function guess() {
  try {
    const saved = localStorage.getItem('krh-cur'); if (saved) return saved;
    const loc = navigator.language || '';
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (/London|en-GB/.test(tz + loc)) return 'GBP';
    if (/Dubai/.test(tz)) return 'AED';
    if (/Riyadh/.test(tz)) return 'SAR';
    if (/Toronto|Vancouver|en-CA/.test(tz + loc)) return 'CAD';
    if (/Australia/.test(tz)) return 'AUD';
    if (/America\//.test(tz)) return 'USD';
    if (/Europe\//.test(tz)) return 'EUR';
  } catch {}
  return 'PKR';
}

export function CurrencyProvider({ children }) {
  const [currency, setC] = useState('PKR');
  useEffect(() => setC(guess()), []);
  const setCurrency = (c) => { setC(c); try { localStorage.setItem('krh-cur', c); } catch {} };
  return <CurCtx.Provider value={{ currency, setCurrency }}>{children}</CurCtx.Provider>;
}

/** Price in the visitor's currency. Uses the package's own USD price when shown in USD. */
export function useMoney() {
  const { currency, setCurrency } = useContext(CurCtx);
  const { rates = {} } = useSettings();
  const convert = (pkr, usd, cur = currency) => {
    pkr = Number(pkr) || null; usd = Number(usd) || null;
    if (cur === 'PKR') return pkr ?? (usd && rates.USD ? usd * rates.USD : null);
    if (cur === 'USD' && usd) return usd;
    const base = pkr ?? (usd && rates.USD ? usd * rates.USD : null);
    return base && rates[cur] ? base / rates[cur] : null;
  };
  const format = (pkr, usd, cur = currency) => {
    const v = convert(pkr, usd, cur);
    if (v == null || Number.isNaN(v)) return '—';
    if (cur === 'PKR') return `Rs ${Math.round(v).toLocaleString('en-PK')}`;
    try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(v); }
    catch { return `${cur} ${Math.round(v).toLocaleString()}`; }
  };
  return { currency, setCurrency, convert, format, rates };
}
