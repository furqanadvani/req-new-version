import { PageHero, SectionHead, Reveal } from '@/components/ui';
import { ServicesBento, CtaBand } from '@/components/home';
import { Seo, breadcrumbSchema, useSettings } from '@/utils';

const STEPS = [
  ['Talk to us', 'Call, WhatsApp or visit the office. We help you pick the package, room and dates that suit your family.'],
  ['Send documents', 'Passport, photo, CNIC or NICOP and vaccination records. Scans are fine; we check everything.'],
  ['Manasik training', 'Attend our practical Hajj or Umrah class in Karachi and take home a printed guide.'],
  ['Travel with the group', 'From the airport to the farewell Tawaf, our staff and scholars stay with you.'],
];

export default function Services() {
  const s = useSettings();
  return (
    <>
      <Seo title="Hajj & Umrah Services — Visa, Hotels, Transport, Manasik"
        description="Hajj and Umrah visa processing, hotels near Haram, seat-by-seat AC transport, manasik training in Karachi and scholars with every group."
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }])} />
      <PageHero title="Services" urdu="ہماری خدمات" crumbs={[{ name: 'Services' }]} image={s.heroSlides?.[1]?.image}
        text="From visa processing to the final Tawaf, every part of your journey is arranged by one team that answers the phone." />
      <ServicesBento head={false} />
      <section className="section bg-raised">
        <div className="wrap">
          <SectionHead urdu="طریقہ کار" title="How it works" />
          <ol className="grid gap-5 md:grid-cols-4">
            {STEPS.map(([t, d], i) => (
              <Reveal key={t} delay={i * 0.06}>
                <li className="card h-full p-7">
                  <span className="font-display text-[44px] leading-none text-gold">{i + 1}</span>
                  <h3 className="mt-6 text-[22px]">{t}</h3>
                  <p className="mt-3 text-[15px] text-muted">{d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
