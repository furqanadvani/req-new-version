import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Star8, Hizam } from './Ornament';

/** Inner page header — always dark (Kiswah), whatever the theme. */
export function PageHero({ title, urdu, text, crumbs = [], image, children }) {
  return (
    <header className="relative overflow-hidden kiswah-tex text-[#f4eee2]">
      {image && <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35 kenburns" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-[#0a0907]" />
      <Star8 className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] text-[#d4af6a]/10 animate-[spin_120s_linear_infinite]" />
      <div className="wrap relative pb-16 pt-36 sm:pb-20 sm:pt-44">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-[13px] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            {crumbs.map((c) => (
              <span key={c.name} className="flex items-center gap-1">
                <ChevronRight size={14} />
                {c.path ? <Link to={c.path} className="hover:text-white">{c.name}</Link> : <span className="text-[#f0d49a]">{c.name}</span>}
              </span>
            ))}
          </nav>
        )}
        {urdu && <p lang="ur" dir="rtl" className="mb-3 font-urdu text-xl leading-[2.2] text-[#d4af6a] text-left">{urdu}</p>}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-[clamp(2.4rem,6.5vw,5rem)]">{title}</motion.h1>
        {text && <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70">{text}</p>}
        {children}
      </div>
      <Hizam />
    </header>
  );
}
