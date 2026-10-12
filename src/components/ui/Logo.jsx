import { LOGO_PATH, LOGO_VIEWBOX } from './logoPath';
import { cx } from '@/utils/helpers';
import { useSettings } from '@/utils/api';

/** Built-in calligraphy mark. `draw` traces the outline, then fills it (used by the intro). */
export function LogoMark({ className = '', draw = false, title = 'Logo' }) {
  return (
    <svg viewBox={LOGO_VIEWBOX} className={cx('block', className)} role="img" aria-label={title}>
      {draw ? (
        <>
          <path d={LOGO_PATH} fill="none" stroke="currentColor" strokeWidth="1.6" pathLength="1"
            className="[stroke-dasharray:1] [stroke-dashoffset:1] animate-[logoDraw_1.9s_cubic-bezier(.65,0,.35,1)_.35s_forwards]" />
          <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd"
            className="opacity-0 animate-[logoFill_.9s_ease-out_1.75s_forwards]" />
        </>
      ) : (
        <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
      )}
    </svg>
  );
}

/** Brand mark from settings: uploaded logo if set, otherwise the built-in calligraphy. */
export function BrandMark({ className = '', draw = false }) {
  const s = useSettings();
  if (s.logoUrl) return <img src={s.logoUrl} alt={s.brandName} className={cx('object-contain', className)} />;
  return <LogoMark className={cx('text-gold', className)} draw={draw} title={s.brandName} />;
}

export function Logo({ className = '', compact = false, light = false }) {
  const s = useSettings();
  const short = (s.brandName || '').replace(/^Karwan-e-/i, '');
  return (
    <span className={cx('flex items-center gap-3', className)}>
      <BrandMark className="h-11 w-11 shrink-0" />
      {!compact && (
        <span className="whitespace-nowrap leading-tight">
          <span className="block font-display text-[17px] tracking-wide">{short}</span>
          <span className={cx('block text-[11.5px]', light ? 'text-white/55' : 'text-muted')}>Hajj, Umrah & Ziarat since {s.foundedYear}</span>
        </span>
      )}
    </span>
  );
}
