import { PageHero, SectionHead, Reveal } from '@/components/ui';
import { BudgetCalculator, Checklist, PrayerTimes, PackageFinder } from '@/components/tools';
import { HajjDays } from '@/components/home';
import { Seo, breadcrumbSchema, useSettings } from '@/utils';

export default function Toolkit() {
  const s = useSettings();
  return (
    <>
      <Seo title="Hajj & Umrah Toolkit — Budget Calculator, Checklist, Prayer Times"
        description="Free tools for pilgrims: Hajj cost calculator in PKR, GBP, USD, AED; document and packing checklist; live Makkah and Madinah prayer times; the five days of Hajj explained."
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Pilgrim toolkit', path: '/pilgrim-toolkit' }])} />
      <PageHero title="Pilgrim toolkit" urdu="حاجی کے لیے رہنمائی" crumbs={[{ name: 'Pilgrim toolkit' }]} image={s.heroSlides?.[1]?.image}
        text="Plan the cost, pack the right things and know the timings — before you've spoken to anyone." />
      <div className="wrap space-y-24 py-20 sm:py-28">
        <section id="budget"><SectionHead title="What will the trip cost?" text="Pick a package, room and number of travellers. See the total in your own currency." /><Reveal><BudgetCalculator /></Reveal></section>
        <section id="finder"><SectionHead title="Find your package" text="Three questions, a short list that fits." /><Reveal><PackageFinder /></Reveal></section>
        <section id="checklist"><SectionHead title="Documents & packing checklist" text="Tick as you go. Your progress stays saved on this phone or computer." /><Reveal><Checklist /></Reveal></section>
        <section id="prayer"><SectionHead title="Prayer times in the Haramain" text="Today's times in Makkah and Madinah." /><Reveal><PrayerTimes /></Reveal></section>
      </div>
      <HajjDays />
    </>
  );
}
