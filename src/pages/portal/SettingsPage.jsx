import { useEffect, useState } from 'react';
import { useSettings, saveSettings } from '@/utils/api';
import { DEFAULT_THEME } from '@/utils/constants';
import { FieldGrid, PortalHead, SETTINGS_TABS, Toast } from '@/components/portal';
import { Spinner, BrandMark } from '@/components/ui';
import { cx } from '@/utils/helpers';

/** All site-wide content, branding and theme. Saving applies instantly to the live site. */
export default function SettingsPage() {
  const current = useSettings();
  const [data, setData] = useState(current);
  const [tab, setTab] = useState(Object.keys(SETTINGS_TABS)[0]);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  useEffect(() => setData(current), [current]);

  async function save() {
    setBusy(true);
    try { await saveSettings(data); setToast('Saved. The website is updated.'); } catch (e) { setToast(e.message); }
    setBusy(false); setTimeout(() => setToast(''), 2600);
  }
  const t = { ...DEFAULT_THEME, ...(data.theme || {}) };
  return (
    <>
      <PortalHead title="Settings & branding" text="One place for your business details, logo, colours, fonts, home page and SEO.">
        <button onClick={save} disabled={busy} className="btn-gold">{busy ? <Spinner /> : 'Save changes'}</button>
      </PortalHead>
      <div className="mb-6 flex flex-wrap gap-2">
        {Object.keys(SETTINGS_TABS).map((k) => <button key={k} onClick={() => setTab(k)} className={cx('rounded-full border px-4 py-2 text-[14px]', tab === k ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted')}>{k}</button>)}
      </div>
      <div className={cx('grid gap-6', tab === 'Branding & theme' && 'xl:grid-cols-[1fr_340px]')}>
        <div className="card p-6 sm:p-8"><FieldGrid fields={SETTINGS_TABS[tab]} data={data} setData={setData} /></div>
        {tab === 'Branding & theme' && (
          <div className="space-y-4 xl:sticky xl:top-8 xl:self-start">
            <p className="text-[13px] text-muted">Preview</p>
            {[['Dark', t.darkBg, t.darkSurface, t.darkInk, t.darkMuted, t.gold, t.gold2], ['Light', t.lightBg, t.lightSurface, t.lightInk, t.lightMuted, t.lightGold, t.lightGold2]].map(([n, bg, sf, ink, mu, g, g2]) => (
              <div key={n} className="overflow-hidden border border-black/10 p-5" style={{ background: bg, color: ink, borderRadius: `${t.radius}px` }}>
                <div className="flex items-center gap-3">
                  {data.logoUrl ? <img src={data.logoUrl} alt="" className="h-10 w-10 object-contain" /> : <span style={{ color: g }}><BrandMark className="h-10 w-10 !text-current" /></span>}
                  <span style={{ fontFamily: `'${t.displayFont}'` }} className="text-lg">{data.brandName}</span>
                </div>
                <div className="mt-4 p-4" style={{ background: sf, borderRadius: `${t.radius}px` }}>
                  <p style={{ fontFamily: `'${t.displayFont}'` }} className="text-2xl">Hajj 28 Days</p>
                  <p className="text-[13px]" style={{ color: mu, fontFamily: `'${t.bodyFont}'` }}>Swissotel Makkah → Aziziya → Madinah</p>
                  <p className="mt-2 text-xl" style={{ color: g, fontFamily: `'${t.displayFont}'` }}>Rs 2,025,000</p>
                  <span className="mt-3 inline-block rounded-full px-4 py-1.5 text-[13px] text-black" style={{ background: `linear-gradient(135deg, ${g2}, ${g})` }}>Register</span>
                </div>
                <p className="mt-3 text-[12px]" style={{ color: mu }}>{n} mode</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Toast msg={toast} />
    </>
  );
}
