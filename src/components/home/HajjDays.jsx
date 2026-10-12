import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SectionHead } from '../ui/Section';
import { Star8 } from '../ui/Ornament';

export const HAJJ_DAYS = [
  { date: '8 Dhul Hijjah', name: 'Yawm al-Tarwiyah', ar: 'يوم التروية', place: 'Mina', text: 'Enter ihram in the morning and travel to Mina. Pray Zuhr to Fajr there in our Maktab tents. Our scholars review the rites with the group that evening.' },
  { date: '9 Dhul Hijjah', name: 'Day of Arafah', ar: 'يوم عرفة', place: 'Arafat, then Muzdalifah', text: 'The heart of Hajj. Stand in dua at Arafat from Zuhr until sunset, then move to Muzdalifah, pray Maghrib and Isha together, and collect pebbles under the open sky.' },
  { date: '10 Dhul Hijjah', name: 'Yawm al-Nahr', ar: 'يوم النحر', place: 'Mina and Makkah', text: 'Stone Jamrat al-Aqabah, the Qurbani is offered, shave or trim, then Tawaf al-Ifadah and Sa’i in Makkah. Eid for the whole Ummah.' },
  { date: '11 – 12 Dhul Hijjah', name: 'Ayyam al-Tashreeq', ar: 'أيام التشريق', place: 'Mina', text: 'Stone all three Jamarat after Zuhr each day. Our staff walk the route with you at the safest times and keep the group together.' },
  { date: '13 Dhul Hijjah', name: 'Farewell', ar: 'طواف الوداع', place: 'Makkah', text: 'Stay for the third day of stoning if you wish, then the farewell Tawaf before leaving Makkah — for Madinah or for home.' },
];

/** Pinned section: scrolling down moves the five days of Hajj sideways (stacked on small screens). */
export function HajjDays() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const PER = 0.56; // each card is 56% of the content width
  const N = HAJJ_DAYS.length;
  const x = useTransform(scrollYProgress, [0.05, 0.95], ['0%', `-${(1 - 1 / (N * PER)) * 100}%`]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const Card = ({ d, i }) => (
    <article className="card relative flex h-full flex-col overflow-hidden p-8 sm:p-10">
      <Star8 className="absolute -right-12 -top-12 h-48 w-48 text-gold/10" />
      <p className="text-[14px] text-gold">Day {i + 1} · {d.date}</p>
      <p lang="ar" dir="rtl" className="mt-6 text-left font-arabic text-[34px] text-gold/80">{d.ar}</p>
      <h3 className="mt-2 text-[32px] sm:text-[40px]">{d.name}</h3>
      <p className="mt-1 text-[15px] text-muted">{d.place}</p>
      <p className="mt-6 max-w-md text-[16.5px] leading-relaxed text-muted">{d.text}</p>
    </article>
  );

  return (
    <section className="relative bg-raised">
      {/* Desktop: pinned horizontal scroll */}
      <div ref={ref} className="relative hidden lg:block" style={{ height: `${HAJJ_DAYS.length * 75}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <div className="wrap">
            <SectionHead urdu="مناسکِ حج" title="Five days that change a life" text="What happens on each day of Hajj, and how our group is with you through every one of them." className="!mb-10" />
          </div>
          <div className="wrap">
            <motion.div style={{ x, width: `${N * PER * 100}%` }} className="flex">
              {HAJJ_DAYS.map((d, i) => <div key={d.name} className="h-[440px] pr-6" style={{ width: `${100 / N}%` }}><Card d={d} i={i} /></div>)}
            </motion.div>
            <div className="mt-10 h-px w-full bg-ink/10"><motion.div style={{ width: bar }} className="h-px bg-gold" /></div>
          </div>
        </div>
      </div>
      {/* Mobile / tablet: swipeable row */}
      <div className="section lg:hidden">
        <div className="wrap"><SectionHead urdu="مناسکِ حج" title="Five days that change a life" text="What happens on each day of Hajj, and how our group is with you through every one of them." /></div>
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:px-8">
          {HAJJ_DAYS.map((d, i) => <div key={d.name} className="w-[86%] shrink-0 snap-center sm:w-[60%]"><Card d={d} i={i} /></div>)}
        </div>
      </div>
    </section>
  );
}
