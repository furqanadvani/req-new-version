import { useSettings } from '@/utils/api';
import { Star8 } from '../ui/Ornament';

/** Slow marquee of credentials — quiet proof instead of big stat cards. */
export function TrustStrip() {
  const s = useSettings();
  const items = [s.licenseText, `Serving pilgrims since ${s.foundedYear}`, 'Scholars travel with every group', 'Office in Bahadurabad, Karachi', 'Overseas pilgrims join in Makkah', 'Seat-by-seat AC transport'].filter(Boolean);
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-b hairline bg-surface py-5" aria-label="Credentials">
      <div className="marquee flex w-max items-center gap-10 whitespace-nowrap text-[15px] text-muted">
        {row.map((t, i) => <span key={i} className="flex items-center gap-10">{t}<Star8 className="h-3.5 w-3.5 text-gold" /></span>)}
      </div>
    </div>
  );
}
