import { useMemo, useState } from 'react';
import { useCollection, useSettings } from '@/utils/api';
import { useMoney, CURRENCIES } from '@/utils/currency';
import { COLLECTIONS, ROOM_TYPES } from '@/utils/constants';

/** Total family cost in any currency, including the overseas own-ticket deduction and spending money. */
export function BudgetCalculator() {
  const s = useSettings();
  const hajj = useCollection(COLLECTIONS.hajj).items;
  const umrah = useCollection(COLLECTIONS.umrah).items;
  const { currency, setCurrency, format, rates } = useMoney();
  const latest = Math.max(...hajj.map((p) => p.year || 0));
  const all = [...hajj.filter((p) => p.year === latest), ...umrah];
  const [pkgId, setPkg] = useState('');
  const [room, setRoom] = useState('Sharing');
  const [people, setPeople] = useState(2);
  const [ownTicket, setOwnTicket] = useState(false);
  const [qurbani, setQurbani] = useState(true);
  const [spend, setSpend] = useState(100000);
  const pkg = all.find((p) => p.id === pkgId) || all[0];
  const row = (pkg?.prices || []).find((r) => r.room === room) || (pkg?.prices || [])[0];

  const total = useMemo(() => {
    if (!row) return null;
    const usdRate = rates.USD || 280;
    const per = (Number(row.pkr) || Number(row.usd) * usdRate) - (ownTicket && pkg.type === 'hajj' ? 800 * usdRate : 0);
    const q = qurbani && pkg.type === 'hajj' ? Number(s.qurbaniPkr) || 0 : 0; // set in portal > Settings
    return { per, all: (per + q) * people + Number(spend) * people, q };
  }, [row, people, ownTicket, qurbani, spend, pkg, rates]);

  const f = (pkr) => format(pkr, null);
  return (
    <div className="card grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.1fr_.9fr]">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="sm:col-span-2"><span className="label">Package</span>
          <select className="field" value={pkg?.id || ''} onChange={(e) => setPkg(e.target.value)}>
            {all.map((p) => <option key={p.id} value={p.id}>{p.title}{p.year ? ` ${p.year}` : ''}</option>)}
          </select></label>
        <label><span className="label">Room</span>
          <select className="field" value={room} onChange={(e) => setRoom(e.target.value)}>{ROOM_TYPES.map((r) => <option key={r}>{r}</option>)}</select></label>
        <label><span className="label">Travellers</span>
          <input className="field" type="number" min="1" max="20" value={people} onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))} /></label>
        <label className="sm:col-span-2"><span className="label">Spending money per person (PKR): {Number(spend).toLocaleString()}</span>
          <input type="range" min="0" max="500000" step="10000" value={spend} onChange={(e) => setSpend(e.target.value)} className="w-full accent-[rgb(var(--gold))]" /></label>
        {pkg?.type === 'hajj' && <>
          <label className="flex items-center gap-3 text-[15px]"><input type="checkbox" checked={ownTicket} onChange={(e) => setOwnTicket(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--gold))]" />I'm buying my own flight (overseas)</label>
          <label className="flex items-center gap-3 text-[15px]"><input type="checkbox" checked={qurbani} onChange={(e) => setQurbani(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--gold))]" />Add Qurbani (approx.)</label>
        </>}
      </div>
      <div className="flex flex-col rounded-[20px] kiswah-tex p-7 text-[#f4eee2]">
        <label className="flex items-center justify-between text-[14px] text-white/60">Show in
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="rounded-full border border-white/20 bg-transparent px-3 py-1.5 text-white">{CURRENCIES.map((c) => <option key={c} className="text-black">{c}</option>)}</select>
        </label>
        {total && <>
          <dl className="mt-8 space-y-3 text-[15px]">
            <div className="flex justify-between"><dt className="text-white/60">Package, per person</dt><dd>{f(total.per)}</dd></div>
            {total.q > 0 && <div className="flex justify-between"><dt className="text-white/60">Qurbani, per person</dt><dd>{f(total.q)}</dd></div>}
            <div className="flex justify-between"><dt className="text-white/60">Spending, per person</dt><dd>{f(Number(spend))}</dd></div>
            <div className="flex justify-between"><dt className="text-white/60">Travellers</dt><dd>× {people}</dd></div>
          </dl>
          <div className="mt-auto border-t border-white/10 pt-6">
            <p className="text-[13px] text-white/55">Estimated total</p>
            <p className="font-display text-[44px] leading-tight text-[#f0d49a]">{f(total.all)}</p>
            <p className="mt-2 text-[12.5px] text-white/45">Estimate only, at Rs {rates[currency === 'PKR' ? 'USD' : currency] || '—'} per {currency === 'PKR' ? 'USD' : currency}. Final price is confirmed by {s.brandName}.</p>
          </div>
        </>}
      </div>
    </div>
  );
}
