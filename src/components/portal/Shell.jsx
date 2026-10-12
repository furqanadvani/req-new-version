import { NavLink, useParams } from 'react-router-dom';
import { LayoutDashboard, Moon as MoonIcon, Package, Inbox, ClipboardList, Settings, LogOut, MessageSquareQuote, HelpCircle, Users, Image, Sparkles, Mail, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/utils/admin';
import { BrandMark } from '../ui/Logo';
import { ThemeToggle } from '../layout/Header';
import { cx } from '@/utils/helpers';

export const PORTAL_NAV = [
  ['', 'Dashboard', LayoutDashboard],
  ['hajj', 'Hajj packages', Package],
  ['umrah', 'Umrah packages', MoonIcon],
  ['queries', 'Queries', Inbox],
  ['registrations', 'Registrations', ClipboardList],
  ['services', 'Services', Sparkles],
  ['testimonials', 'Testimonials', MessageSquareQuote],
  ['faqs', 'FAQs', HelpCircle],
  ['team', 'Team', Users],
  ['gallery', 'Gallery', Image],
  ['subscribers', 'Subscribers', Mail],
  ['settings', 'Settings & branding', Settings],
];

export function PortalShell({ children }) {
  const { key } = useParams();
  const { user, logout } = useAdmin();
  const base = `/admin/${key}`;
  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="border-b hairline bg-surface lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3 p-5">
          <span className="flex items-center gap-3"><BrandMark className="h-9 w-9" /><span className="font-display text-lg">Portal</span></span>
          <ThemeToggle className="lg:hidden" />
        </div>
        <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible">
          {PORTAL_NAV.map(([to, l, I]) => (
            <NavLink key={to} end={to === ''} to={to ? `${base}/${to}` : base}
              className={({ isActive }) => cx('flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14.5px] transition', isActive ? 'bg-gold/10 text-gold' : 'text-muted hover:bg-ink/5 hover:text-ink')}>
              <I size={17} />{l}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t hairline p-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <p className="truncate text-[13px] text-muted">{user?.email}</p>
          <div className="mt-3 flex items-center gap-2">
            <a href="/" target="_blank" rel="noreferrer" className="btn-ghost flex-1 !px-3 !py-2 text-[13px]"><ExternalLink size={14} />Site</a>
            <ThemeToggle />
            <button onClick={logout} className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5" aria-label="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      <main className="min-w-0 p-5 sm:p-8 lg:p-10">{children}</main>
    </div>
  );
}

export function PortalHead({ title, text, children }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><h1 className="text-[34px]">{title}</h1>{text && <p className="mt-1.5 max-w-2xl text-[15px] text-muted">{text}</p>}</div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Toast({ msg }) {
  if (!msg) return null;
  return <div role="status" className="fixed bottom-6 left-1/2 z-[100] -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-[14px] text-bg shadow-xl">{msg}</div>;
}

export function Drawer({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-3xl flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b hairline px-6 py-4"><h2 className="text-2xl">{title}</h2><button onClick={onClose} className="btn-ghost !px-4 !py-2 text-[14px]">Close</button></div>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t hairline px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
