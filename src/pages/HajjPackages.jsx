import { useMemo, useState } from 'react';
import { PageHero, SectionHead, Empty } from '@/components/ui';
import { PackageGrid } from '@/components/packages';
import { CtaBand, FaqSection } from '@/components/home';
import { Seo, breadcrumbSchema, useCollection, useSettings, COLLECTIONS, SITE_URL, cx } from '@/utils';

export default function HajjPackages() {
  const s = useSettings();
  const { items, loading } = useCollection(COLLECTIONS.hajj);
  const years = useMemo(() => [...new Set(items.map((p) => p.year))].sort((a, b) => b - a), [items]);
  const [year, setYear] = useState(null);
  const active = year ?? years[0];
  const list = items.filter((p) => p.year === active);
  return (
    <>
      <Seo title={`Hajj Packages ${years[0] || s.hajjYear} from Pakistan — Prices & Hotels`}
        description={`Private Hajj packages ${years[0] || ''} from Karachi: 17, 23 and 28 days with hotels near Haram, Maktab tents in Mina, flights and visa. Prices for Sharing, Quad, Triple and Double rooms in PKR and USD.`}
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Hajj packages', path: '/hajj-packages' }]),
          { '@type': 'ItemList', itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE_URL}/hajj-packages/${p.slug}`, name: `${p.title} ${p.year}` })) }]} />
      <PageHero title="Hajj packages" urdu="حج پیکجز" crumbs={[{ name: 'Hajj packages' }]} image={s.heroSlides?.[0]?.image}
        text="Every package includes visa, return flights, hotels in Makkah, Aziziya and Madinah, Mina and Arafat through the Maktab, transport and ziarat — with scholars in the group." />
      <section className="section">
        <div className="wrap">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead title={`Hajj ${active || ''}`} text={active === years[0] ? `Registration for Hajj ${s.hajjYear} is open. Prices below are per person.` : 'Past programmes, kept for reference.'} className="!mb-0" />
            {years.length > 1 && (
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Year">
                {years.map((y) => <button key={y} role="tab" aria-selected={active === y} onClick={() => setYear(y)} className={cx('rounded-full border px-5 py-2.5 text-[15px] transition', active === y ? 'border-gold bg-gold text-black' : 'hairline text-muted hover:text-ink')}>{y}</button>)}
              </div>
            )}
          </div>
          {loading ? null : list.length ? <PackageGrid items={list} /> : <Empty title="No packages for this year yet" text="New packages are published as soon as Saudi quotas are confirmed." />}
        </div>
      </section>
      <FaqSection limit={5} />
      <CtaBand />
    </>
  );
}
