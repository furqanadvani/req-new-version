import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';
import { FileText } from 'lucide-react';
import { PageHero, SectionHead, Reveal, BrandMark } from '@/components/ui';
import { Testimonials, CtaBand } from '@/components/home';
import { Seo, breadcrumbSchema, useCollection, useSettings, COLLECTIONS } from '@/utils';

const VALUES = [
  ['Ibada first', 'Every plan is judged by one question: does it leave the pilgrim free to focus on worship?'],
  ['Scholars with the group', 'Ulama travel with us to guide each rite and answer masail in Urdu, on the spot.'],
  ['Honest prices', 'What is on the package page is what you pay. Changes by Saudi authorities are shown in writing.'],
  ['Families come back', 'Most of our pilgrims come through people who travelled with us before.'],
];

export default function About() {
  const s = useSettings();
  const team = [...useCollection(COLLECTIONS.team).items].sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
  const gallery = useCollection(COLLECTIONS.gallery).items;
  const years = new Date().getFullYear() - (s.foundedYear || 2005);
  return (
    <>
      <Seo title={`About ${s.brandName} — Hajj & Umrah since ${s.foundedYear}`}
        description={`${s.legalName}: licensed Hajj and Umrah organiser in Karachi since ${s.foundedYear}. Over ${Number(s.pilgrimsServed).toLocaleString()} pilgrims served.`}
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} />
      <PageHero title={`Trusted with the guests of Allah since ${s.foundedYear}`} urdu={s.urduName} crumbs={[{ name: 'About' }]} image={s.heroSlides?.[1]?.image} />
      <section className="section">
        <div className="wrap grid items-start gap-14 lg:grid-cols-[1.1fr_.9fr]">
          <Reveal>
            {String(s.aboutStory || '').split('\n').filter(Boolean).map((p, i) => <p key={i} className={i === 0 ? 'text-[21px] leading-relaxed' : 'mt-6 text-[17px] leading-relaxed text-muted'}>{p}</p>)}
            {s.ceoQuote && (
              <figure className="pl-6 mt-10 border-l-2 border-gold">
                <blockquote className="font-display text-[24px] leading-snug">“{s.ceoQuote}”</blockquote>
                <figcaption className="mt-4 text-[15px] text-muted">{s.ceoName}, {s.ceoTitle}</figcaption>
              </figure>
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <div className="card relative overflow-hidden kiswah-tex p-10 text-[#f4eee2]">
              <BrandMark className="mx-auto h-48 w-48 !text-[#d4af6a]" />
              <dl className="grid grid-cols-2 gap-6 pt-8 mt-10 text-center border-t border-white/10">
                <div><dt className="text-[13px] text-white/55">Years of service</dt><dd className="font-display text-4xl text-[#f0d49a]">{years}+</dd></div>
                <div><dt className="text-[13px] text-white/55">Pilgrims served</dt><dd className="font-display text-4xl text-[#f0d49a]">{Number(s.pilgrimsServed).toLocaleString()}+</dd></div>
              </dl>
              <p className="mt-6 text-center text-[13.5px] text-white/55">{s.licenseText}</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-raised">
        <div className="wrap">
          <SectionHead urdu="ہمارے اصول" title="What we hold to" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map(([t, d], i) => <Reveal key={t} delay={i * 0.05}><div className="h-full card p-7"><h3 className="text-[22px]">{t}</h3><p className="mt-3 text-[15px] text-muted">{d}</p></div></Reveal>)}
          </div>
        </div>
      </section>

      {(s.certificates || []).length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead urdu="اسناد" title="Licences and certificates" text="Open any document to view the original." />
            <div className="grid gap-4 sm:grid-cols-3">
              {s.certificates.map((c) => (
                <a key={c.title} href={c.file || undefined} target="_blank" rel="noreferrer" aria-disabled={!c.file}
                  className="card flex items-center gap-4 p-6 transition hover:!border-gold aria-disabled:pointer-events-none">
                  <span className="grid w-12 h-12 place-items-center rounded-2xl bg-gold/10 text-gold"><FileText /></span>
                  <span><span className="block text-xl font-display">{c.title}</span><span className="text-[13px] text-muted">{c.file ? 'View document' : 'Available at our office'}</span></span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead urdu="ہماری ٹیم" title="The people you'll meet" />
            <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
              {team.map((m) => (
                <div key={m.id} className="text-center">
                  <div className="mx-auto aspect-square w-full overflow-hidden rounded-[24px] bg-raised">
                    {m.photo ? <img src={m.photo} alt={m.name} loading="lazy" className="object-cover w-full h-full" /> :
                      <div className="grid h-full w-full place-items-center kiswah-tex font-display text-4xl text-[#d4af6a]">{m.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}</div>}
                  </div>
                  <p className="mt-4 text-lg font-display">{m.name}</p>
                  <p className="text-[13.5px] text-muted">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {gallery.length > 0 && (
        <section className="overflow-hidden section bg-raised">
          <div className="wrap"><SectionHead urdu="یادیں" title="From our groups" /></div>
          <Swiper modules={[Autoplay, FreeMode]} freeMode loop slidesPerView={1.3} spaceBetween={16} autoplay={{ delay: 0, disableOnInteraction: false }} speed={6000}
            breakpoints={{ 640: { slidesPerView: 2.4 }, 1024: { slidesPerView: 4.2 } }} className="!px-5">
            {gallery.map((g) => <SwiperSlide key={g.id}><img src={g.image} alt={g.caption || ''} loading="lazy" className="aspect-[4/5] w-full rounded-[22px] object-cover" /></SwiperSlide>)}
          </Swiper>
        </section>
      )}
      <Testimonials />
      <CtaBand />
    </>
  );
}
