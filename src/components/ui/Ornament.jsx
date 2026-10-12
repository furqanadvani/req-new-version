import { cx } from '@/utils/helpers';

/** Eight-point star (Rub el Hizb) — the geometric unit used across the brand. */
export function Star8({ className = '', strokeWidth = 1.2, filled = false }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={strokeWidth} vectorEffect="non-scaling-stroke">
        <rect x="21" y="21" width="58" height="58" />
        <rect x="21" y="21" width="58" height="58" transform="rotate(45 50 50)" />
      </g>
    </svg>
  );
}

/** The Hizam: gold band of the Kiswah, rendered as a repeating geometric strip. */
export function Hizam({ className = '' }) {
  return (
    <div aria-hidden="true" className={cx('relative h-[14px] w-full overflow-hidden', className)}>
      <div className="absolute inset-x-0 top-0 h-px bg-gold/50" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold/50" />
      <svg className="absolute inset-0 h-full w-full text-gold/60" preserveAspectRatio="none">
        <defs>
          <pattern id="hz" width="28" height="14" patternUnits="userSpaceOnUse">
            <path d="M0 7 L7 2 L14 7 L7 12 Z M14 7 L21 2 L28 7 L21 12 Z" fill="none" stroke="currentColor" strokeWidth=".8" />
            <circle cx="14" cy="7" r="1.1" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hz)" />
      </svg>
    </div>
  );
}
