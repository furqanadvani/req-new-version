import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { cx } from '@/utils/helpers';

export function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-hair border-y hairline">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.id || i}>
            <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-6 text-left">
              <span className="font-display text-[20px] sm:text-[22px]">{it.q}</span>
              <Plus className={cx('shrink-0 text-gold transition-transform duration-500 ease-silk', isOpen && 'rotate-45')} />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <p className="max-w-3xl pb-7 text-[16.5px] leading-relaxed text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
