import { Link } from 'react-router-dom';
import { ArrowUpRight, Plus, Check } from 'lucide-react';
import { Hizam, Star8 } from '../ui/Ornament';
import { useMoney } from '@/utils/currency';
import { fromPrice, cx } from '@/utils/helpers';
import { useCompare } from './Compare';

export const packagePath = (p) => `/${p.type === 'umrah' ? 'umrah-packages' : 'hajj-packages'}/${p.slug || p.id}`;

/** Cover art: the uploaded cover, or a generated Kiswah plate with the number of days. */
export function PackageCover({ pkg, className = '', big = false }) {
  if (pkg.cover) return <img src={pkg.cover} alt={`${pkg.title} ${pkg.year || ''}`} loading="lazy" className={cx('h-full w-full object-cover', className)} />;
  return (
    <div className={cx('relative h-full w-full overflow-hidden kiswah-tex', className)}>
      <Star8 className="absolute -right-10 -top-10 h-56 w-56 text-[#d4af6a]/15" />
      <div className="absolute inset-x-0 top-[38%]"><Hizam /></div>
      <div className="absolute bottom-5 left-6 text-[#f0d49a]">
        <span className={cx('block font-display leading-none', big ? 'text-[120px]' : 'text-[84px]')}>{pkg.days}</span>
        <span className="text-[13px] text-white/60">days{pkg.maktab ? ` · Maktab ${pkg.maktab}` : ''}</span>
      </div>
      {pkg.year && <span className="absolute right-6 top-5 font-display text-lg text-white/70">{pkg.year}</span>}
    </div>
  );
}

export function PackageCard({ pkg, className = '' }) {
  const { format } = useMoney();
  const fp = fromPrice(pkg);
  const { has, toggle } = useCompare();
  const inCompare = has(pkg.id);
  const cities = [...new Set((pkg.hotels || []).map((h) => h.city).filter((c) => !/mina|arafat/i.test(c)))];
  return (
    <article className={cx('group card relative flex h-full flex-col overflow-hidden transition duration-500 ease-silk hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgb(var(--gold)/.45)]', className)}>
      <Link to={packagePath(pkg)} className="relative block aspect-[4/3] overflow-hidden" aria-label={pkg.title}>
        <div className="h-full w-full transition duration-[1.2s] ease-silk group-hover:scale-[1.04]"><PackageCover pkg={pkg} /></div>
        {pkg.featured && <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] text-[#f0d49a] backdrop-blur">Most chosen</span>}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-[24px]"><Link to={packagePath(pkg)} className="hover:text-gold">{pkg.title}</Link></h3>
        <p className="mt-2 line-clamp-2 text-[15px] text-muted">{pkg.summary}</p>
        {cities.length > 0 && <p className="mt-4 text-[13.5px] text-muted">{cities.join('  →  ')}</p>}
        <div className="mt-auto flex items-end justify-between gap-3 pt-6">
          <div>
            <span className="block text-[12.5px] text-muted">From, per person</span>
            <span className="whitespace-nowrap font-display text-[22px] text-gold sm:text-[26px]">{fp ? format(fp.pkr, fp.usd) : 'On request'}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => toggle(pkg)} aria-pressed={inCompare} aria-label={inCompare ? 'Remove from compare' : 'Add to compare'} title="Compare"
              className={cx('grid h-11 w-11 place-items-center rounded-full border transition', inCompare ? 'border-gold bg-gold/15 text-gold' : 'hairline hover:border-gold')}>
              {inCompare ? <Check size={17} /> : <Plus size={17} />}
            </button>
            <Link to={packagePath(pkg)} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-bg transition group-hover:bg-gold group-hover:text-black" aria-label={`View ${pkg.title}`}><ArrowUpRight size={18} /></Link>
          </div>
        </div>
      </div>
    </article>
  );
}
