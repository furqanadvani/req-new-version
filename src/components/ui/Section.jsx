import { motion } from 'framer-motion';
import { cx } from '@/utils/helpers';

export function SectionHead({ urdu, title, text, align = 'left', className = '', children }) {
  return (
    <div className={cx('mb-12 sm:mb-16', align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl', className)}>
      {urdu && <p className={cx('kicker', align === 'center' ? 'text-center' : 'text-left')} lang="ur" dir="rtl">{urdu}</p>}
      <h2 className="text-[clamp(2rem,4.4vw,3.4rem)]">{title}</h2>
      {text && <p className="mt-5 text-[17px] leading-relaxed text-muted">{text}</p>}
      {children}
    </div>
  );
}

/** A single, restrained reveal. Use for section blocks, not for every card. */
export function Reveal({ children, delay = 0, className = '', y = 28 }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

export function Empty({ title, text, action }) {
  return (
    <div className="card mx-auto max-w-lg p-10 text-center">
      <h3 className="text-2xl">{title}</h3>
      {text && <p className="mt-3 text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Spinner({ className = '' }) {
  return <span className={cx('inline-block h-5 w-5 animate-spin rounded-full border-2 border-gold/30 border-t-gold', className)} />;
}
