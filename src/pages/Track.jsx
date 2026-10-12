import { useSearchParams } from 'react-router-dom';
import { PageHero } from '@/components/ui';
import { TrackForm } from '@/components/forms';
import { Seo } from '@/utils';

export default function Track() {
  const [p] = useSearchParams();
  return (
    <>
      <Seo title="Track your Hajj registration" description="Check the status of your Hajj or Umrah registration with your reference code." />
      <PageHero title="Track your registration" urdu="رجسٹریشن کی صورتحال" crumbs={[{ name: 'Track registration' }]} text="Enter the reference code from your confirmation and the last four digits of the phone number you registered with." />
      <section className="section"><div className="wrap max-w-4xl"><TrackForm initialRef={p.get('ref') || ''} /></div></section>
    </>
  );
}
