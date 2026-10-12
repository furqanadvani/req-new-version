import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';
import { SectionHead, Reveal } from '../ui/Section';
import { useCollection } from '@/utils/api';
import { COLLECTIONS, ROUTES } from '@/utils/constants';
import { cx } from '@/utils/helpers';

/** Bento layout: the first two services get large tiles with imagery, the rest sit in a quiet grid. */
export function ServicesBento({ limit = 8, head = true }) {
  const { items } = useCollection(COLLECTIONS.services);
  const list = [...items].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)).slice(0, limit);
  return (
    <section className="section">
      <div className="wrap">
        {head && <SectionHead urdu="ہماری خدمات" title="Everything between your door and the Haram" text="From the first document to the farewell Tawaf, one team handles it." />}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((sv, i) => {
            const big = i < 2;
            return (
              <Reveal key={sv.id} delay={(i % 4) * 0.05} className={cx(big && 'sm:col-span-2 lg:row-span-2')}>
                <article className={cx('card group relative flex h-full flex-col overflow-hidden p-7', big ? 'min-h-[300px] lg:min-h-[420px] kiswah-tex !border-[#d4af6a]/20 text-[#f4eee2]' : 'min-h-[220px]')}>
                  {big && sv.image && <img src={sv.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-[1.4s] ease-silk group-hover:scale-105" />}
                  {big && <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />}
                  <div className="relative flex items-center justify-between">
                    <span className={cx('grid h-12 w-12 place-items-center rounded-2xl', big ? 'bg-[#d4af6a]/15 text-[#f0d49a]' : 'bg-gold/10 text-gold')}><Icon name={sv.icon} size={22} /></span>
                    {sv.tag && <span className={cx('text-[12.5px]', big ? 'text-[#f0d49a]' : 'text-muted')}>{sv.tag}</span>}
                  </div>
                  <div className="relative mt-auto pt-10">
                    <h3 className={cx(big ? 'text-[34px] sm:text-[40px]' : 'text-[24px]')}>{sv.title}</h3>
                    <p className={cx('mt-3 text-[15px] leading-relaxed', big ? 'max-w-md text-white/70' : 'text-muted')}>{sv.text}</p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
        {head && <div className="mt-10 text-center"><Link to={ROUTES.services} className="btn-ghost">All services</Link></div>}
      </div>
    </section>
  );
}
