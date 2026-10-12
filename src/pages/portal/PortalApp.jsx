import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AdminProvider, useAdmin } from '@/utils/admin';
import { firebaseReady } from '@/utils/firebase';
import { PortalShell, CollectionManager } from '@/components/portal';
import { BrandMark, Spinner } from '@/components/ui';
import Dashboard from './Dashboard';
import Queries from './Queries';
import Registrations from './Registrations';
import Subscribers from './Subscribers';
import SettingsPage from './SettingsPage';

function Login() {
  const { login, reset } = useAdmin();
  const [f, setF] = useState({ email: '', pw: '' });
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  async function go(e) {
    e.preventDefault(); setBusy(true); setMsg('');
    try { await login(f.email, f.pw); } catch { setMsg('Email or password is incorrect.'); }
    setBusy(false);
  }
  return (
    <div className="grid min-h-screen place-items-center bg-bg p-5">
      <form onSubmit={go} className="card w-full max-w-sm p-8">
        <BrandMark className="mx-auto h-16 w-16" />
        <h1 className="mt-6 text-center text-3xl">Sign in to the portal</h1>
        {!firebaseReady && <p className="mt-4 rounded-xl bg-red-500/10 p-3 text-[13.5px] text-red-500">Firebase keys are missing in .env, so sign-in is unavailable.</p>}
        <label className="mt-8 block"><span className="label">Email</span><input type="email" required className="field" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="username" /></label>
        <label className="mt-4 block"><span className="label">Password</span><input type="password" required className="field" value={f.pw} onChange={(e) => setF({ ...f, pw: e.target.value })} autoComplete="current-password" /></label>
        {msg && <p className="mt-4 text-[14px] text-red-500" role="alert">{msg}</p>}
        <button disabled={busy || !firebaseReady} className="btn-gold mt-6 w-full">{busy ? <Spinner /> : 'Sign in'}</button>
        <button type="button" onClick={async () => { if (!f.email) return setMsg('Enter your email first.'); await reset(f.email); setMsg('Password reset email sent.'); }} className="mt-4 w-full text-[13.5px] text-muted hover:text-ink">Forgot password</button>
      </form>
    </div>
  );
}

function Gate() {
  const { user, isAdmin, loading, logout } = useAdmin();
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner /></div>;
  if (!user) return <Login />;
  if (!isAdmin) return (
    <div className="grid min-h-screen place-items-center p-5">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-3xl">This account isn't an admin yet</h1>
        <p className="mt-4 text-muted">In Firebase Console → Firestore, create a document in the <code>admins</code> collection with this ID:</p>
        <code className="mt-4 block break-all rounded-xl bg-raised p-3 text-[13px]">{user.uid}</code>
        <button onClick={logout} className="btn-ghost mt-6">Sign out</button>
      </div>
    </div>
  );
  return (
    <PortalShell>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="hajj" element={<CollectionManager name="hajjPackages" title="Hajj packages" text="Add, edit and publish packages by year. Use → next year to copy a package as a draft for the coming season." />} />
        <Route path="umrah" element={<CollectionManager name="umrahPackages" title="Umrah packages" />} />
        <Route path="queries" element={<Queries />} />
        <Route path="registrations" element={<Registrations />} />
        <Route path="services" element={<CollectionManager name="services" title="Services" />} />
        <Route path="testimonials" element={<CollectionManager name="testimonials" title="Testimonials" text="Only publish words a pilgrim gave permission to share." />} />
        <Route path="faqs" element={<CollectionManager name="faqs" title="FAQs" text="Also used for Google's FAQ results." />} />
        <Route path="team" element={<CollectionManager name="team" title="Team" />} />
        <Route path="gallery" element={<CollectionManager name="gallery" title="Gallery" />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </PortalShell>
  );
}

export default function PortalApp() {
  return (
    <AdminProvider>
      <Helmet><title>Portal</title><meta name="robots" content="noindex, nofollow" /></Helmet>
      <Gate />
    </AdminProvider>
  );
}
