import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { useSettings } from '@/utils/api';
import { ROUTES } from '@/utils/constants';
import { telLink } from '@/utils/helpers';
import { BrandMark } from '../ui/Logo';

export function CtaBand() {
  const s = useSettings();
  return (
    <section className="wrap pb-20 sm:pb-28">
      <div className="relative overflow-hidden rounded-[32px] kiswah-tex px-7 py-14 text-[#f4eee2] sm:px-14 sm:py-20">
        <BrandMark className="pointer-events-none absolute -bottom-16 -right-10 h-[340px] w-[340px] !text-[#d4af6a]/10" />
        <div className="relative max-w-2xl">
          <h2 className="text-[clamp(2rem,4.6vw,3.6rem)]">Hajj {s.hajjYear} seats are allotted in order of registration</h2>
          <p className="mt-5 text-[17px] text-white/65">Register with your documents today. No payment is taken until our team confirms your package with you.</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to={ROUTES.register} className="btn-gold">Register for Hajj {s.hajjYear}</Link>
            <a href={telLink(s.phones?.[0])} className="btn-light"><Phone size={16} />{s.phones?.[0]}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
