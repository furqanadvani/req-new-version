import { PageHero } from '@/components/ui';
import { Seo, useSettings } from '@/utils';

export default function Legal({ kind = 'privacy' }) {
  const s = useSettings();
  const title = kind === 'privacy' ? 'Privacy policy' : 'Terms & refund policy';
  const body = kind === 'privacy' ? s.privacyPolicy : s.terms;
  return (
    <>
      <Seo title={title} />
      <PageHero title={title} crumbs={[{ name: title }]} />
      <section className="section"><div className="wrap max-w-3xl space-y-5 text-[17px] leading-relaxed text-muted">{String(body || '').split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div></section>
    </>
  );
}
