import { Link } from 'react-router-dom';
import { Plane, BadgePercent, Globe2, ShieldCheck } from 'lucide-react';
import { PageHero, SectionHead, Reveal } from '@/components/ui';
import { InquiryForm } from '@/components/forms';
import { BudgetCalculator } from '@/components/tools';
import { FaqSection } from '@/components/home';
import { Seo, breadcrumbSchema, faqSchema, useSettings, ROUTES } from '@/utils';

const COUNTRIES = ['United Kingdom', 'United States', 'Canada', 'UAE', 'Saudi Arabia', 'Qatar', 'Australia', 'Europe'];
const POINTS = [
  [Plane, 'Fly from where you live', 'Book your own flight to Jeddah or Madinah and join our group there. USD 800 comes off the Hajj package price.'],
  [Globe2, 'Priced for your passport', 'Saudi rules set different prices for pilgrims living outside Pakistan. We quote you the exact figure for your country.'],
  [BadgePercent, 'Pay in your currency', 'See every price in GBP, USD, CAD, AED, EUR or AUD on this site. Bank transfer details are shared after confirmation.'],
  [ShieldCheck, 'Same group, same care', 'You stay with our Pakistani group in Makkah, Mina and Madinah, guided in Urdu by our scholars.'],
];
const FAQ = [
  { q: 'Can British or American Pakistanis perform Hajj with a Pakistani group?', a: 'Saudi rules for pilgrims living outside Pakistan change from season to season and depend on your passport and country of residence. Send us both and we will confirm, in writing, how you can join our group this year.' },
  { q: 'Is the price different for overseas Pakistanis?', a: 'Yes. Prices for pilgrims living in the USA, Canada, UK, Europe, Australia, the Middle East and the Far East differ from Pakistan prices. If you buy your own ticket, USD 800 is deducted.' },
  { q: 'Can my parents travel from Pakistan and me from London?', a: 'Yes. Families often travel from different countries and meet in Makkah. We place you in the same rooms and the same Maktab where Saudi rules allow.' },
];

export default function Overseas() {
  const s = useSettings();
  return (
    <>
      <Seo title="Hajj & Umrah for Overseas Pakistanis — UK, USA, Canada, UAE"
        description="Hajj and Umrah packages for Pakistanis living in the UK, USA, Canada, UAE, Saudi Arabia and Europe. Fly from your country, join our Karachi group in Makkah, see prices in GBP, USD, CAD, AED."
        schema={[breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Overseas Pakistanis', path: '/hajj-umrah-for-overseas-pakistanis' }]), faqSchema(FAQ)]} />
      <PageHero title="Living abroad? Perform Hajj with a group from home" urdu="بیرونِ ملک مقیم پاکستانیوں کے لیے" crumbs={[{ name: 'Overseas Pakistanis' }]} image={s.heroSlides?.[2]?.image || s.heroSlides?.[0]?.image}
        text="Hajj and Umrah for Pakistanis in the UK, USA, Canada, the Gulf and Europe — with the Urdu-speaking scholars and staff your family knows.">
        <div className="mt-8 flex flex-wrap gap-2">{COUNTRIES.map((c) => <span key={c} className="rounded-full border border-white/20 px-4 py-1.5 text-[14px]">{c}</span>)}</div>
      </PageHero>
      <section className="section">
        <div className="wrap grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(([I, t, d], i) => <Reveal key={t} delay={i * 0.05}><div className="card h-full p-7"><I className="text-gold" /><h2 className="mt-6 text-[24px]">{t}</h2><p className="mt-3 text-[15px] text-muted">{d}</p></div></Reveal>)}
        </div>
      </section>
      <section className="section bg-raised"><div className="wrap"><SectionHead title="Your cost, in your currency" /><BudgetCalculator /></div></section>
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHead title="Get a quote for your passport" text="Tell us where you live and who is travelling. We reply by WhatsApp or email, in your time zone.">
            <Link to={ROUTES.hajj} className="btn-ghost mt-8">See Hajj packages</Link>
          </SectionHead>
          <InquiryForm packageTitle="Overseas Hajj / Umrah" />
        </div>
      </section>
      <section className="section pt-0"><div className="wrap"><SectionHead title="Questions from overseas pilgrims" /><div className="divide-hair border-y hairline">{FAQ.map((f) => <details key={f.q} className="group py-6"><summary className="cursor-pointer list-none font-display text-[21px]">{f.q}</summary><p className="mt-4 max-w-3xl text-muted">{f.a}</p></details>)}</div></div></section>
      <FaqSection limit={4} />
    </>
  );
}
