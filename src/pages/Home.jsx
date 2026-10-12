import { useOutletContext } from 'react-router-dom';
import { Hero, TrustStrip, PackagesRail, PromoVideo, HajjDays, ServicesBento, Testimonials, FaqSection, CtaBand } from '@/components/home';
import { PackageFinder } from '@/components/tools';
import { SectionHead, Reveal } from '@/components/ui';
import { Seo, faqSchema, useCollection, useSettings, COLLECTIONS, SITE_URL } from '@/utils';

export default function Home() {
  const { ready } = useOutletContext() || { ready: true };
  const s = useSettings();
  const faqs = useCollection(COLLECTIONS.faqs).items;
  return (
    <>
      <Seo schema={[
        { '@type': 'WebSite', name: s.brandName, url: `${SITE_URL}/` },
        faqs.length ? faqSchema(faqs) : null,
      ]} />
      <Hero ready={ready} />
      <TrustStrip />
      <PackagesRail />
      <PromoVideo />
      <HajjDays />
      <ServicesBento />
      <section className="section bg-raised">
        <div className="wrap">
          <SectionHead urdu="آپ کے لیے بہترین پیکج" title="Not sure which package fits?" text="Answer three questions. We'll show the packages that match your time and the way you'd like to stay." />
          <Reveal><PackageFinder /></Reveal>
        </div>
      </section>
      <Testimonials />
      <FaqSection limit={6} />
      <CtaBand />
    </>
  );
}
