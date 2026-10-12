import { Link } from 'react-router-dom';
import { BrandMark } from '@/components/ui';
import { Seo, ROUTES } from '@/utils';

export default function NotFound() {
  return (
    <section className="grid min-h-[80vh] place-items-center px-5 pt-28 text-center">
      <Seo title="Page not found" noindex />
      <div>
        <BrandMark className="mx-auto h-24 w-24 opacity-60" />
        <h1 className="mt-8 text-5xl">This page isn't here</h1>
        <p className="mt-4 text-muted">The link may be old. These will get you back on the way.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3"><Link to="/" className="btn-gold">Home</Link><Link to={ROUTES.hajj} className="btn-ghost">Hajj packages</Link><Link to={ROUTES.umrah} className="btn-ghost">Umrah packages</Link></div>
      </div>
    </section>
  );
}
