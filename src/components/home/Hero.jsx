import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { LogoMark } from '../ui/Logo';
import { Hizam } from '../ui/Ornament';
import { useSettings } from '@/utils/api';
import { useCountdown } from '@/utils/hooks';
import { cx } from '@/utils/helpers';

const ease = [0.22, 1, 0.36, 1];
const DELAY = 7000;

function Countdown({ date }) {
  const c = useCountdown(date);
  if (c.done) return null;
  return (
    <div className="flex items-end gap-5">
      {[['days', c.days], ['hrs', c.hours], ['min', c.minutes], ['sec', c.seconds]].map(([l, v]) => (
        <div key={l} className="text-center">
          <div className="font-display text-[34px] leading-none tabular-nums text-[#f0d49a] sm:text-[40px]">{String(v).padStart(2, '0')}</div>
          <div className="mt-1.5 text-[11.5px] text-white/50">{l}</div>
        </div>
      ))}
    </div>
  );
}

/** Full-screen hero: cross-fading slides with slow push-in, giant calligraphy watermark, and the countdown to Arafah. */
export function Hero({ ready = true }) {
  const s = useSettings();
  const slides = (s.heroSlides || []).filter((x) => x.title);
  const [i, setI] = useState(0);
  const [progress, setProgress] = useState(0);
  const swiper = useRef(null);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const markY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const cur = slides[i] || {};
  const show = ready;

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[640px] overflow-hidden bg-black text-white" aria-label="Introduction">
      <motion.div style={{ y }} className="absolute inset-0">
        <Swiper modules={[Autoplay, EffectFade]} effect="fade" fadeEffect={{ crossFade: true }} speed={1600} loop={slides.length > 1}
          autoplay={{ delay: DELAY, disableOnInteraction: false }} allowTouchMove={slides.length > 1}
          onSwiper={(sw) => (swiper.current = sw)} onRealIndexChange={(sw) => setI(sw.realIndex)}
          onAutoplayTimeLeft={(_, __, p) => setProgress(1 - p)} className="h-full w-full">
          {slides.map((sl, k) => (
            <SwiperSlide key={k} className="overflow-hidden bg-black">
              {sl.image
                ? <img src={sl.image} alt="" className={cx('h-full w-full object-cover', k === i && 'kenburns')} fetchpriority={k === 0 ? 'high' : 'auto'} />
                : <div className="h-full w-full kiswah-tex" />}
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(120%_80%_at_70%_30%,transparent_0%,rgba(0,0,0,.55)_60%,rgba(0,0,0,.9)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-2/3 bg-gradient-to-t from-black via-black/70 to-transparent" />

      <motion.div style={{ y: markY }} className="pointer-events-none absolute -right-[12vw] top-[8vh] z-[1] hidden w-[58vw] max-w-[820px] text-[#d4af6a]/[0.13] md:block">
        <LogoMark className="h-auto w-full" />
      </motion.div>

      <motion.div style={{ opacity: fade }} className="wrap relative z-[2] flex h-full flex-col justify-end pb-10 pt-28 sm:pb-14">
        <motion.p lang="ar" dir="rtl" initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease, delay: 0.1 }}
          className="mb-5 text-left font-arabic text-[22px] text-[#e9c98a] sm:text-[26px]">لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ</motion.p>
        <h1 className="max-w-[17ch] text-[clamp(2.5rem,6.2vw,5.6rem)] leading-[1.02]">
          {(s.heroTitle || '').split(' ').map((w, k) => (
            <span key={k} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span className="inline-block" initial={{ y: '105%' }} animate={show ? { y: 0 } : {}} transition={{ duration: 1.1, ease, delay: 0.2 + k * 0.06 }}>{w}&nbsp;</motion.span>
            </span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ duration: 1, delay: 0.9 }}
          className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/70 sm:text-[18px]">{s.heroText}</motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, ease, delay: 1.1 }}
          className="mt-10 grid gap-8 border-t border-white/15 pt-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="min-h-[118px]">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.6, ease }}>
                <p className="font-display text-[22px] text-white sm:text-[26px]">{cur.title}</p>
                <p className="mt-1.5 max-w-lg text-[15px] text-white/60">{cur.text}</p>
                {cur.link && <Link to={cur.link} className="btn-gold mt-5">{cur.cta || 'Learn more'}<ArrowRight size={16} /></Link>}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-6 lg:items-end">
            {s.arafahDate && (
              <div>
                <p className="mb-3 text-[13px] text-white/55 lg:text-right">Day of Arafah, Hajj {s.hajjYear} (expected)</p>
                <Countdown date={s.arafahDate} />
              </div>
            )}
            {slides.length > 1 && (
              <div className="flex gap-2" role="tablist" aria-label="Slides">
                {slides.map((sl, k) => (
                  <button key={k} role="tab" aria-selected={k === i} aria-label={sl.title} onClick={() => swiper.current?.slideToLoop(k)} className="group py-3">
                    <span className="block h-[3px] w-12 overflow-hidden rounded-full bg-white/20 sm:w-16">
                      <span className="block h-full bg-[#f0d49a]" style={{ width: k === i ? `${progress * 100}%` : k < i ? '100%' : '0%', transition: k === i ? 'none' : 'width .3s' }} />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 1.8 }} className="absolute bottom-3 left-1/2 z-[2] -translate-x-1/2 text-white/50 max-sm:hidden">
        <ChevronDown className="animate-bounce" size={20} />
      </motion.div>
      <div className="absolute inset-x-0 bottom-0 z-[3]"><Hizam /></div>
    </section>
  );
}
