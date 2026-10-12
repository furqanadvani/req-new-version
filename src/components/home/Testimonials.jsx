import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectCreative, Keyboard } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';
import { Star } from 'lucide-react';
import { SectionHead } from '../ui/Section';
import { useCollection } from '@/utils/api';
import { COLLECTIONS } from '@/utils/constants';

/** One large quote at a time; the next one slides in from behind. */
export function Testimonials() {
  const { items } = useCollection(COLLECTIONS.testimonials);
  const list = [...items].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  if (!list.length) return null;
  return (
    <section className="section overflow-hidden">
      <div className="wrap">
        <SectionHead urdu="حجاج کرام کے تاثرات" title="In their words" align="center" />
        <Swiper modules={[Autoplay, Pagination, EffectCreative, Keyboard]} effect="creative" grabCursor keyboard loop={list.length > 2}
          creativeEffect={{ prev: { translate: ['-20%', 0, -400], opacity: 0 }, next: { translate: ['100%', 0, 0] } }}
          autoplay={{ delay: 6500, disableOnInteraction: false }} pagination={{ clickable: true }} speed={900} className="mx-auto max-w-4xl !pb-14">
          {list.map((t) => (
            <SwiperSlide key={t.id}>
              <figure className="card mx-auto px-7 py-10 text-center sm:px-14 sm:py-14">
                <div className="flex justify-center gap-1 text-gold" aria-label={`${t.rating || 5} out of 5`}>{Array.from({ length: t.rating || 5 }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}</div>
                <blockquote className="mx-auto mt-7 max-w-2xl font-display text-[clamp(1.35rem,2.6vw,2rem)] leading-snug">“{t.text}”</blockquote>
                <figcaption className="mt-8 text-[15px]"><span className="font-medium">{t.name}</span><span className="text-muted">, {t.city} — {t.trip}</span></figcaption>
              </figure>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
