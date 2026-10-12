import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel, Keyboard, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PackageCard } from '../packages/PackageCard';
import { SectionHead, Reveal } from '../ui/Section';
import { useCollection, useSettings } from '@/utils/api';
import { COLLECTIONS, ROUTES } from '@/utils/constants';
import { cx } from '@/utils/helpers';

/** Horizontal, drag-to-scroll rail of this season's packages with a Hajj / Umrah switch. */
export function PackagesRail() {
  const s = useSettings();
  const hajj = useCollection(COLLECTIONS.hajj).items;
  const umrah = useCollection(COLLECTIONS.umrah).items;
  const [tab, setTab] = useState('hajj');
  const latestYear = Math.max(...hajj.map((p) => p.year || 0), 0);
  const items = useMemo(() => (tab === 'hajj' ? hajj.filter((p) => p.year === latestYear) : umrah), [tab, hajj, umrah, latestYear]);
  const id = 'rail';

  return (
    <section className="section overflow-hidden">
      <div className="wrap">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHead urdu="حج و عمرہ پیکجز" className="!mb-0"
            title={tab === 'hajj' ? `Hajj ${latestYear || s.hajjYear} packages` : 'Umrah packages'}
            text={tab === 'hajj' ? 'Every package includes visa, return flights, Mina and Arafat through the Maktab, transport and ziarat.' : 'Year-round Umrah with hotels close to the Haram. Choose your days, we handle the rest.'} />
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border hairline p-1" role="tablist">
              {[['hajj', 'Hajj'], ['umrah', 'Umrah']].map(([k, l]) => (
                <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
                  className={cx('rounded-full px-5 py-2 text-[14.5px] transition', tab === k ? 'bg-ink text-bg' : 'text-muted hover:text-ink')}>{l}</button>
              ))}
            </div>
            <button className={`${id}-prev grid h-11 w-11 place-items-center rounded-full border hairline hover:border-gold`} aria-label="Previous"><ArrowLeft size={17} /></button>
            <button className={`${id}-next grid h-11 w-11 place-items-center rounded-full border hairline hover:border-gold`} aria-label="Next"><ArrowRight size={17} /></button>
          </div>
        </div>
      </div>
      <Reveal className="mt-12">
        <div className="wrap !overflow-visible">
          <Swiper key={tab} modules={[FreeMode, Mousewheel, Keyboard, Navigation]} freeMode={{ enabled: true, sticky: false }} mousewheel={{ forceToAxis: true }} keyboard
            navigation={{ prevEl: `.${id}-prev`, nextEl: `.${id}-next` }} slidesPerView={1.12} spaceBetween={18} grabCursor className="!overflow-visible"
            breakpoints={{ 640: { slidesPerView: 2.1, spaceBetween: 22 }, 1024: { slidesPerView: 3.05, spaceBetween: 26 } }}>
            {items.map((p) => <SwiperSlide key={p.id} className="!h-auto"><PackageCard pkg={p} /></SwiperSlide>)}
            <SwiperSlide className="!h-auto">
              <Link to={tab === 'hajj' ? ROUTES.hajj : ROUTES.umrah} className="card group flex h-full min-h-[300px] flex-col justify-between p-8 hover:!border-gold">
                <span className="font-display text-[30px] leading-tight">See all {tab === 'hajj' ? 'Hajj packages, including past years' : 'Umrah packages'}</span>
                <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-black transition group-hover:translate-x-2"><ArrowRight /></span>
              </Link>
            </SwiperSlide>
          </Swiper>
        </div>
      </Reveal>
    </section>
  );
}
