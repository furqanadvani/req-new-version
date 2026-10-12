import { PageHero } from '@/components/ui';
import { RegistrationWizard } from '@/components/forms';
import { Seo, breadcrumbSchema, useSettings } from '@/utils';

export default function Register() {
  const s = useSettings();
  return (
    <>
      <Seo title={`Hajj ${s.hajjYear} Registration — Book Your Seat Online`}
        description={`Register for Hajj ${s.hajjYear} with ${s.brandName}. Choose package, Maktab and room, add pilgrims and upload passport scans. No payment until we confirm with you.`}
        schema={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: `Hajj ${s.hajjYear} registration`, path: '/hajj-registration' }])} />
      <PageHero title={`Hajj ${s.hajjYear} registration`} urdu="حج رجسٹریشن" crumbs={[{ name: 'Registration' }]} image={s.heroSlides?.[0]?.image}
        text="Three short steps. You'll get a reference code to track your registration, and our team calls you within 24 hours." />
      <section className="section">
        <div className="wrap">{s.registrationOpen ? <RegistrationWizard /> : <p className="text-center text-muted">Registration for the next Hajj season opens soon. Leave your number on the contact page and we'll call you first.</p>}</div>
      </section>
    </>
  );
}
