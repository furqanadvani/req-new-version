import { Suspense, useEffect, useState } from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import { SiteLayout, Header, Footer } from '@/components/layout';
import { Spinner } from '@/components/ui';
import { ROUTES } from '@/utils/constants';
import { isValidPortalKey } from '@/utils/helpers';
import {
  Home, HajjPackages, UmrahPackages, PackageDetail, Services, About, Contact,
  Register, Track, Toolkit, Overseas, Legal, NotFound, PortalApp,
} from '@/pages';

const Loading = () => <div className="grid min-h-screen place-items-center"><Spinner /></div>;

/**
 * /admin/:key — the portal exists only behind the right key.
 * A wrong key renders the normal 404 page, so the route can't be discovered by guessing.
 * The key is checked against a SHA-256 hash in .env; the plain key never ships in the code.
 * Sign-in (Firebase Auth) and Firestore rules still protect the data behind it.
 */
function PortalGate() {
  const { key } = useParams();
  const [ok, setOk] = useState(null);
  useEffect(() => { let on = true; isValidPortalKey(key).then((v) => on && setOk(v)); return () => { on = false; }; }, [key]);
  if (ok === null) return <Loading />;
  if (!ok) return <><Header /><Suspense fallback={<Loading />}><NotFound /></Suspense><Footer /></>;
  return <Suspense fallback={<Loading />}><PortalApp /></Suspense>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/:key/*" element={<PortalGate />} />
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path={ROUTES.hajj} element={<HajjPackages />} />
        <Route path={`${ROUTES.hajj}/:slug`} element={<PackageDetail type="hajj" />} />
        <Route path={ROUTES.umrah} element={<UmrahPackages />} />
        <Route path={`${ROUTES.umrah}/:slug`} element={<PackageDetail type="umrah" />} />
        <Route path={ROUTES.services} element={<Services />} />
        <Route path={ROUTES.about} element={<About />} />
        <Route path={ROUTES.contact} element={<Contact />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.track} element={<Track />} />
        <Route path={ROUTES.toolkit} element={<Toolkit />} />
        <Route path={ROUTES.overseas} element={<Overseas />} />
        <Route path={ROUTES.privacy} element={<Legal kind="privacy" />} />
        <Route path={ROUTES.terms} element={<Legal kind="terms" />} />
        {/* Old URLs from the previous site */}
        <Route path="/hajj" element={<HajjPackages />} />
        <Route path="/service" element={<Services />} />
        <Route path="/contactUs" element={<Contact />} />
        <Route path="/features" element={<Toolkit />} />
        <Route path="/hajj-registration-form" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
