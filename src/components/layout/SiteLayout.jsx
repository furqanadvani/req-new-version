import { Suspense, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingActions } from './FloatingActions';
import { RegistrationPopup } from './RegistrationPopup';
import { Intro } from './Intro';
import { SmoothScroll } from './SmoothScroll';
import { Spinner } from '../ui/Section';

export function SiteLayout() {
  const [ready, setReady] = useState(false);
  return (
    <>
      <Intro onDone={() => setReady(true)} />
      <SmoothScroll />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
      <Header />
      <main id="main">
        <Suspense fallback={<div className="grid min-h-[70vh] place-items-center"><Spinner /></div>}>
          <Outlet context={{ ready }} />
        </Suspense>
      </main>
      <Footer />
      <FloatingActions />
      <RegistrationPopup ready={ready} />
    </>
  );
}
