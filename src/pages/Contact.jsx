import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { PageHero, SectionHead } from '@/components/ui';
import { InquiryForm } from '@/components/forms';
import { WhatsAppGlyph } from '@/components/layout';
import { Seo, breadcrumbSchema, useSettings, telLink, waLink } from '@/utils';

export default function Contact() {
  const s = useSettings();
  const rows = [
    [Phone, 'Call', s.phones?.join('\n'), telLink(s.phones?.[0])],
    [WhatsAppGlyph, 'WhatsApp', s.whatsapp, waLink(s.whatsapp)],
    [Mail, 'Email', s.email, `mailto:${s.email}`],
    [MapPin, 'Office', s.address, `https://maps.google.com/?q=${encodeURIComponent(s.mapQuery || s.address)}`],
    [Clock, 'Hours', s.hours],
  ];
  return (
    <>
      <Seo title="Contact — Hajj & Umrah Office in Bahadurabad, Karachi" description={`Call ${s.phones?.[0]}, WhatsApp ${s.whatsapp} or visit ${s.address}. ${s.hours}.`}
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])} />
      <PageHero title="Talk to us" urdu="رابطہ" crumbs={[{ name: 'Contact' }]} image={s.heroSlides?.[0]?.image} text="A real person answers. Most WhatsApp messages get a reply within the hour, during office hours." />
      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <ul className="divide-hair border-y hairline">
              {rows.map(([I, l, v, href]) => {
                const inner = <><span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/10 text-gold"><I size={18} /></span><span><span className="block text-[13px] text-muted">{l}</span><span className="whitespace-pre-line text-[16px]">{v}</span></span></>;
                return <li key={l}>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="flex gap-4 py-5 hover:text-gold">{inner}</a> : <div className="flex gap-4 py-5">{inner}</div>}</li>;
              })}
            </ul>
            <div className="mt-8 overflow-hidden rounded-[22px] border hairline">
              <iframe title="Office location" src={`https://www.google.com/maps?q=${encodeURIComponent(s.mapQuery || s.address)}&output=embed`} className="h-[320px] w-full grayscale-[.4] dark:invert-[.9] dark:hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
          <div>
            <SectionHead title="Send us a message" text="Tell us about your plans. We reply within 24 hours." className="!mb-8" />
            <InquiryForm />
          </div>
        </div>
      </section>
    </>
  );
}
