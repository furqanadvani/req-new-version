import { useMemo, useState } from 'react';
import { Accordion } from '../ui/Accordion';
import { SectionHead } from '../ui/Section';
import { useCollection } from '@/utils/api';
import { COLLECTIONS } from '@/utils/constants';
import { cx } from '@/utils/helpers';

export function FaqSection({ title = 'Questions pilgrims ask us', limit }) {
  const { items } = useCollection(COLLECTIONS.faqs);
  const sorted = useMemo(() => [...items].sort((a, b) => (a.order ?? 99) - (b.order ?? 99)), [items]);
  const cats = ['All', ...new Set(sorted.map((f) => f.category).filter(Boolean))];
  const [cat, setCat] = useState('All');
  const list = (cat === 'All' ? sorted : sorted.filter((f) => f.category === cat)).slice(0, limit || 99);
  return (
    <section className="section">
      <div className="wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <SectionHead urdu="سوالات" title={title} text="Can't find yours? Ask us on WhatsApp — a real person replies, usually within the hour." className="!mb-8" />
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)} className={cx('rounded-full border px-4 py-2 text-[14px] transition', cat === c ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted hover:text-ink')}>{c}</button>
            ))}
          </div>
        </div>
        <Accordion key={cat} items={list} />
      </div>
    </section>
  );
}
