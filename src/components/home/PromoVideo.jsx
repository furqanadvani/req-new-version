import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSettings } from '@/utils/api';
import { Reveal } from '../ui/Section';

/** Apple-style: the video frame grows into place as you scroll; plays muted in view, tap for sound. */
export function PromoVideo() {
  const s = useSettings();
  const wrap = useRef(null);
  const vid = useRef(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 28]);

  useEffect(() => {
    const v = vid.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().then(() => setPlaying(true)).catch(() => {}); else { v.pause(); setPlaying(false); } }, { threshold: 0.4 });
    io.observe(v); return () => io.disconnect();
  }, [s.promoVideo]);

  if (!s.promoVideo) return null;
  const toggle = () => { const v = vid.current; if (v.paused) { v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); } };

  return (
    <section ref={wrap} className="section relative overflow-hidden kiswah-tex text-[#f4eee2]">
      <div className="star-tex absolute inset-0 opacity-60" />
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr]">
        <Reveal>
          <p lang="ur" dir="rtl" className="kicker !text-[#d4af6a] text-left">علمائے کرام کی رہنمائی میں</p>
          <h2 className="text-[clamp(2.2rem,5vw,4rem)]">{s.promoTitle}</h2>
          <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/65">{s.promoText}</p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-white/10 pt-8">
            <div><div className="font-display text-4xl text-[#f0d49a]">{new Date().getFullYear() - (s.foundedYear || 2005)}+</div><div className="mt-1 text-[14px] text-white/55">years of Hajj groups</div></div>
            <div><div className="font-display text-4xl text-[#f0d49a]">{Number(s.pilgrimsServed || 0).toLocaleString()}+</div><div className="mt-1 text-[14px] text-white/55">pilgrims served</div></div>
          </div>
        </Reveal>
        <motion.div style={{ scale, borderRadius: radius }} className="relative mx-auto aspect-[9/16] w-full max-w-[380px] overflow-hidden border border-[#d4af6a]/30 bg-black shadow-[0_40px_120px_-40px_rgba(212,175,106,.45)]">
          <video ref={vid} src={s.promoVideo} poster={s.promoPoster} muted={muted} loop playsInline preload="metadata" className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
            <button onClick={toggle} aria-label={playing ? 'Pause video' : 'Play video'} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur hover:bg-white/25">{playing ? <Pause size={18} /> : <Play size={18} />}</button>
            <button onClick={() => setMuted((m) => !m)} className="flex h-11 items-center gap-2 rounded-full bg-white/15 px-4 text-[13.5px] backdrop-blur hover:bg-white/25">{muted ? <VolumeX size={17} /> : <Volume2 size={17} />}{muted ? 'Tap for sound' : 'Sound on'}</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
