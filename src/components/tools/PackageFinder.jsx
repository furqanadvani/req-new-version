import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PackageCard } from '../packages/PackageCard';
import { useCollection } from '@/utils/api';
import { useMoney } from '@/utils/currency';
import { COLLECTIONS } from '@/utils/constants';
import { cx } from '@/utils/helpers';

const Q = [
  { key: 'type', q: 'What are you planning?', opts: [['hajj', 'Hajj'], ['umrah', 'Umrah']] },
  { key: 'time', q: 'How much time can you take?', opts: [['short', 'Up to 2½ weeks'], ['mid', '3 weeks'], ['long', '4 weeks']] },
  { key: 'room', q: 'How would you like to stay?', opts: [['Sharing', 'Sharing, lowest price'], ['Quad', '4 per room'], ['Triple', '3 per room'], ['Double', 'Couple / 2 per room']] },
];
const RANGE = { short: [0, 18], mid: [19, 24], long: [25, 99] };

/** Three questions → the packages that fit, ranked by price for the chosen room. */
export function PackageFinder() {
  const hajj = useCollection(COLLECTIONS.hajj).items;
  const umrah = useCollection(COLLECTIONS.umrah).items;
  const { format } = useMoney();
  const [a, setA] = useState({});
  const step = Q.findIndex((q) => !a[q.key]);
  const done = step === -1;

  const results = useMemo(() => {
    if (!done) return [];
    const latest = Math.max(...hajj.map((p) => p.year || 0));
    const pool = a.type === 'hajj' ? hajj.filter((p) => p.year === latest) : umrah;
    const [lo, hi] = RANGE[a.time];
    const price = (p) => { const r = (p.prices || []).find((x) => x.room === a.room); return r ? Number(r.pkr) || Number(r.usd) * 280 : Infinity; };
    const fit = pool.filter((p) => p.days >= lo && p.days <= hi);
    return (fit.length ? fit : pool).sort((x, y) => price(x) - price(y)).slice(0, 3);
  }, [done, a, hajj, umrah]);

  return (
    <div className="card overflow-hidden p-6 sm:p-10">
      <div className="mb-8 flex items-center gap-2">
        {Q.map((q, i) => <span key={q.key} className={cx('h-1 flex-1 rounded-full transition', (done || i < step) ? 'bg-gold' : i === step ? 'bg-gold/40' : 'bg-ink/10')} />)}
      </div>
      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
            <h3 className="text-[28px]">{Q[step].q}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Q[step].opts.map(([v, l]) => (
                <button key={v} onClick={() => setA({ ...a, [Q[step].key]: v })} className="rounded-2xl border hairline px-5 py-4 text-left text-[16px] transition hover:border-gold hover:bg-gold/5">{l}</button>
              ))}
            </div>
            {step > 0 && <button onClick={() => { const k = Q[step - 1].key; const n = { ...a }; delete n[k]; setA(n); }} className="mt-6 text-[14px] text-muted hover:text-ink">Back</button>}
          </motion.div>
        ) : (
          <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h3 className="text-[28px]">{results.length ? 'These fit you best' : 'No package matches yet'}</h3>
              <button onClick={() => setA({})} className="btn-ghost !py-2">Start again</button>
            </div>
            <p className="mt-2 text-muted">Sorted by the {a.room.toLowerCase()} room price{results[0] ? `, from ${format(...(() => { const r = results[0].prices.find((x) => x.room === a.room) || {}; return [r.pkr, r.usd]; })())}` : ''}.</p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">{results.map((p) => <PackageCard key={p.id} pkg={p} />)}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
