import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useSettings } from '@/utils/api';
import { waLink } from '@/utils/helpers';
import { scrollToTop } from './SmoothScroll';

export function WhatsAppGlyph({ size = 24 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-1 1.2-.4.2-.7.1a8 8 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.8.4 3.5 3.5 0 0 0-1.1 2.6 6 6 0 0 0 1.3 3.2 13.9 13.9 0 0 0 5.3 4.7c2 .8 2.7.9 3.7.8a3.1 3.1 0 0 0 2-1.4 2.5 2.5 0 0 0 .2-1.4c-.1-.2-.3-.3-.6-.4ZM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8Zm8.4-18.2A11.8 11.8 0 0 0 1.8 17.8L.1 24l6.4-1.7a11.8 11.8 0 0 0 5.6 1.4 11.8 11.8 0 0 0 8.3-20.1Z"/></svg>;
}

export function FloatingActions() {
  const s = useSettings();
  const [up, setUp] = useState(false);
  useEffect(() => {
    const on = () => setUp(window.scrollY > 900);
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <div className="fixed right-4 z-[50] flex flex-col items-end gap-3 sm:right-6" style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}>
      <AnimatePresence>
        {up && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={scrollToTop} aria-label="Back to top"
            className="grid h-12 w-12 place-items-center rounded-full border hairline bg-surface/90 text-ink shadow-lg backdrop-blur"><ArrowUp size={18} /></motion.button>
        )}
      </AnimatePresence>
      <a href={waLink(s.whatsapp, `Assalam o Alaikum, I'd like to know about Hajj ${s.hajjYear} packages.`)} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp"
        className="group flex h-14 items-center gap-2 rounded-full bg-[#1fae5b] pl-4 pr-4 text-white shadow-[0_12px_30px_-10px_rgba(31,174,91,.8)] transition hover:pr-5">
        <WhatsAppGlyph />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[14.5px] font-medium transition-all duration-500 group-hover:max-w-[160px]">Ask on WhatsApp</span>
      </a>
    </div>
  );
}
