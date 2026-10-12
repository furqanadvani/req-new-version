import { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Columns3 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useMoney } from '@/utils/currency';
import { ROOM_TYPES } from '@/utils/constants';
import { toList } from '@/utils/helpers';

const Ctx = createContext({ items: [], has: () => false, toggle: () => {} });

/** Visitors pick up to 3 packages and compare prices, hotels and inclusions side by side. */
export function CompareProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const has = (id) => items.some((i) => i.id === id);
  const toggle = (p) => setItems((arr) => (arr.some((i) => i.id === p.id) ? arr.filter((i) => i.id !== p.id) : [...arr, p].slice(-3)));
  return (
    <Ctx.Provider value={{ items, has, toggle }}>
      {children}
      <AnimatePresence>
        {items.length > 0 && (
          <motion.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
            className="fixed left-1/2 z-[52] flex -translate-x-1/2 items-center gap-3 rounded-full border hairline bg-surface/95 p-2 pl-5 shadow-2xl backdrop-blur"
            style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
            <span className="hidden text-[14px] sm:inline">{items.length} of 3 selected</span>
            <div className="flex -space-x-1">{items.map((i) => <span key={i.id} className="grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-gold text-[12px] font-semibold text-black">{i.days}</span>)}</div>
            <button onClick={() => setOpen(true)} disabled={items.length < 2} className="btn-gold !py-2"><Columns3 size={16} />Compare</button>
            <button onClick={() => setItems([])} aria-label="Clear compare" className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5"><X size={16} /></button>
          </motion.div>
        )}
      </AnimatePresence>
      <CompareModal open={open} onClose={() => setOpen(false)} items={items} />
    </Ctx.Provider>
  );
}
export const useCompare = () => useContext(Ctx);

function CompareModal({ open, onClose, items }) {
  const { format } = useMoney();
  const rows = [
    ['Duration', (p) => `${p.days} days`],
    ['Year / season', (p) => p.year || p.season || '—'],
    ...ROOM_TYPES.map((r) => [`${r} room`, (p) => { const x = (p.prices || []).find((q) => q.room === r); return x ? format(x.pkr, x.usd) : '—'; }]),
    ['Hotels', (p) => (p.hotels || []).filter((h) => !/mina|arafat/i.test(h.city)).map((h) => `${h.city}: ${h.hotel}`).join('\n') || '—'],
    ['Included', (p) => toList(p.inclusions).length + ' items'],
  ];
  return (
    <Modal open={open} onClose={onClose} label="Compare packages" className="max-w-5xl">
      <div className="p-6 sm:p-10">
        <h2 className="text-3xl">Compare packages</h2>
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-[14.5px]">
            <thead><tr><th className="w-40 pb-4" />{items.map((p) => <th key={p.id} className="pb-4 pr-4 font-display text-xl font-normal">{p.title}</th>)}</tr></thead>
            <tbody className="divide-hair">
              {rows.map(([label, fn]) => (
                <tr key={label} className="border-t hairline align-top">
                  <th className="py-3 pr-4 font-medium text-muted">{label}</th>
                  {items.map((p) => <td key={p.id} className="whitespace-pre-line py-3 pr-4">{fn(p)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
