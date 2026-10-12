import { useState } from 'react';
import { PageHero, SectionHead, Empty } from '@/components/ui';
import { PackageGrid } from '@/components/packages';
import { CtaBand } from '@/components/home';
import { InquiryForm } from '@/components/forms';
import { Seo, breadcrumbSchema, useCollection, useSettings, COLLECTIONS, cx } from '@/utils';

export default function UmrahPackages() {
  const s = useSettings();
  const { items, loading } = useCollection(COLLECTIONS.umrah);
  const seasons = ['All', ...new Set(items.map((p) => p.season).filter(Boolean))];
  const [season, setSeason] = useState('All');
  const list = season === 'All' ? items : items.filter((p) => p.season === season);
  return (
    <>
      <Seo title="Umrah Packages from Pakistan — 7 to 28 Days, All Year"
        description="Umrah packages from Karachi and for overseas Pakistanis: visa, flights, hotels near Masjid al-Haram and Masjid an-Nabawi, transport and ziarat. Economy to 5-star, Ramadan and school-holiday groups."
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Umrah packages', path: '/umrah-packages' }])} />
      <PageHero title="Umrah packages" urdu="عمرہ پیکجز" crumbs={[{ name: 'Umrah packages' }]} image={s.heroSlides?.[1]?.image}
        text="Group and family Umrah every month of the year, with hotels close to the Haram and a guide with you for every rite." />
      <section className="section">
        <div className="wrap">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHead title="Choose your season" text="Prices are per person. Ramadan and holiday dates fill first." className="!mb-0" />
            <div className="flex flex-wrap gap-2">{seasons.map((x) => <button key={x} onClick={() => setSeason(x)} className={cx('rounded-full border px-5 py-2.5 text-[15px]', season === x ? 'border-gold bg-gold text-black' : 'hairline text-muted')}>{x}</button>)}</div>
          </div>
          {loading ? null : list.length ? <PackageGrid items={list} /> : <Empty title="No Umrah packages published" text="Ask us for a custom Umrah date below." />}
        </div>
      </section>
      <section className="section bg-raised">
        <div className="wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHead urdu="اپنی تاریخ پر عمرہ" title="Want your own dates?" text="Tell us when and how many. We'll put together hotels, flights and visa and send you a price the same day." />
          <InquiryForm packageTitle="Custom Umrah" />
        </div>
      </section>
      <CtaBand />
    </>
  );
}
