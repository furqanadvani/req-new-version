import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cx } from '@/utils/helpers';

export function Modal({ open, onClose, children, className = '', label = 'Dialog' }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = ''; };
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label={label}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ y: 40, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cx('relative max-h-[92vh] w-full overflow-auto rounded-t-[28px] bg-surface sm:rounded-[28px]', className)}>
            <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink/5 hover:bg-ink/10"><X size={18} /></button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
