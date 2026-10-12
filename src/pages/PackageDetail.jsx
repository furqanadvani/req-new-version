import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Info, FileText, Utensils, CreditCard, MapPin, Share2, Download } from 'lucide-react';
import { PageHero, SectionHead, Reveal, Empty, Modal } from '@/components/ui';
import { PackageCover, PriceTable, PackageCard } from '@/components/packages';
import { InquiryForm } from '@/components/forms';
import { CtaBand } from '@/components/home';
import { WhatsAppGlyph } from '@/components/layout';
import { Seo, breadcrumbSchema, packageSchema, useCollection, useItem, useSettings, useMoney, COLLECTIONS, ROUTES, fromPrice, toList, waLink } from '@/utils';

function ListBlock({ icon: I, title, items }) {
  const list = toList(items);
  if (!list.length) return null;
  return (
    <div className="card p-7">
      <h3 className="flex items-center gap-3 text-[22px]"><I size={20} className="text-gold" />{title}</h3>
      <ul className="mt-5 space-y-3 text-[15.5px]">
        {list.map((x) => <li key={x} className="flex gap-3"><Check size={17} className="mt-1 shrink-0 text-gold" /><span className="text-muted">{x}</span></li>)}
      </ul>
    </div>
  );
}

export default function PackageDetail({ type = 'hajj' }) {
  const { slug } = useParams();
  const s = useSettings();
  const name = type === 'hajj' ? COLLECTIONS.hajj : COLLECTIONS.umrah;
  const { item: p, loading } = useItem(name, slug);
  const all = useCollection(name).items;
  const { format } = useMoney();
  const [room, setRoom] = useState('');
  const [ask, setAsk] = useState(false);
  const [flyer, setFlyer] = useState(false);
  const base = type === 'hajj' ? ROUTES.hajj : ROUTES.umrah;
  const label = type === 'hajj' ? 'Hajj packages' : 'Umrah packages';

  if (loading) return <div className="min-h-screen" />;
  if (!p) return <div className="pt-40 pb-24"><Seo title="Package not found" noindex /><Empty title="This package is no longer available" text="It may have been replaced by a newer one." action={<Link to={base} className="btn-gold">See current packages</Link>} /></div>;

  const fp = fromPrice(p);
  const path = `${base}/${p.slug || p.id}`;
  const title = `${p.title}${p.year ? ` ${p.year}` : ''}`;
  const related = all.filter((x) => x.id !== p.id && (x.year === p.year || !p.year)).slice(0, 3);
  const msg = `Assalam o Alaikum, I'm interested in ${title}${room ? ` (${room} room)` : ''}. Please share details.`;
  const share = async () => { try { await navigator.share({ title, url: window.location.href }); } catch { navigator.clipboard?.writeText(window.location.href); } };

  return (
    <>
      <Seo title={`${title} Package — Price${fp ? ` from ${fp.pkr ? `Rs ${Number(fp.pkr).toLocaleString('en-PK')}` : `$${fp.usd}`}` : ''}`}
        description={`${title}: ${p.summary} ${p.days} days. Hotels: ${(p.hotels || []).map((h) => h.hotel).filter(Boolean).slice(0, 3).join(', ')}. Visa, flights and transport included.`}
        image={p.cover || undefined} type="product"
        schema={[packageSchema(p, path, s.brandName), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: label, path: base }, { name: title, path }])]} />
      <PageHero title={title} urdu={type === 'hajj' ? 'حج پیکج' : 'عمرہ پیکج'} crumbs={[{ name: label, path: base }, { name: title }]} text={p.summary} image={p.cover || s.heroSlides?.[0]?.image}>
        <div className="mt-8 flex flex-wrap gap-2 text-[14px]">
          <span className="rounded-full border border-white/20 px-4 py-1.5">{p.days} days</span>
          {p.maktab && <span className="rounded-full border border-white/20 px-4 py-1.5">Maktab {p.maktab}</span>}
          {p.season && <span className="rounded-full border border-white/20 px-4 py-1.5">{p.season}</span>}
          {fp && <span className="rounded-full bg-[#d4af6a] px-4 py-1.5 text-black">From {format(fp.pkr, fp.usd)}</span>}
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.25fr_.75fr]">
          <div className="space-y-14">
            <Reveal>
              <SectionHead title="Prices per person" text="Choose a room to see it in your enquiry. Change currency from the menu at the top." className="!mb-8" />
              <PriceTable prices={p.prices} selected={room} onSelect={setRoom} />
            </Reveal>

            {(p.hotels || []).length > 0 && (
              <Reveal>
                <SectionHead title="Where you'll stay" className="!mb-8" />
                <ol className="relative space-y-4 border-l hairline pl-8">
                  {p.hotels.map((h, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[41px] top-5 grid h-5 w-5 place-items-center rounded-full border-2 border-gold bg-bg"><span className="h-1.5 w-1.5 rounded-full bg-gold" /></span>
                      <div className="card flex flex-wrap items-center justify-between gap-4 p-5">
                        <div><p className="text-[13px] text-gold">{h.city}</p><p className="font-display text-[21px]">{h.hotel}</p></div>
                        <div className="text-right text-[14px] text-muted">{h.stay && <p>{h.stay}</p>}{h.distance && h.distance !== '—' && <p className="flex items-center justify-end gap-1"><MapPin size={13} />{h.distance}</p>}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            <div className="grid gap-5 md:grid-cols-2">
              <ListBlock icon={Check} title="Included" items={p.inclusions} />
              <ListBlock icon={Utensils} title="Meals" items={p.food} />
              <ListBlock icon={FileText} title="Documents needed" items={p.documents} />
              <ListBlock icon={Info} title="Please note" items={p.notes} />
            </div>
            {p.payment && <div className="card flex gap-4 p-7"><CreditCard className="shrink-0 text-gold" /><div><h3 className="text-[22px]">Payment</h3><p className="mt-2 text-muted">{p.payment}</p></div></div>}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="card overflow-hidden">
              <div className="aspect-[4/3]"><PackageCover pkg={p} big /></div>
              <div className="space-y-3 p-6">
                {type === 'hajj' && s.registrationOpen && p.year >= s.hajjYear - 1 && (
                  <Link to={`${ROUTES.register}?package=${p.id}${room ? `&room=${room}` : ''}`} className="btn-gold w-full">Register for this package</Link>
                )}
                <a href={waLink(s.whatsapp, msg)} target="_blank" rel="noreferrer" className="btn w-full bg-[#1fae5b] text-white hover:brightness-110"><WhatsAppGlyph size={18} />Ask on WhatsApp</a>
                <button onClick={() => setAsk(true)} className="btn-ghost w-full">Send a question</button>
                <div className="flex gap-2 pt-1">
                  <button onClick={share} className="btn-ghost flex-1 !py-2 text-[14px]"><Share2 size={15} />Share</button>
                  {p.flyer && <button onClick={() => setFlyer(true)} className="btn-ghost flex-1 !py-2 text-[14px]"><Download size={15} />Flyer</button>}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section bg-raised">
          <div className="wrap">
            <SectionHead title="Other packages" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((x) => <PackageCard key={x.id} pkg={x} />)}</div>
          </div>
        </section>
      )}
      <CtaBand />

      <Modal open={ask} onClose={() => setAsk(false)} label="Ask about this package" className="max-w-2xl">
        <div className="p-6 sm:p-10"><h2 className="mb-6 text-3xl">Ask about {title}</h2><InquiryForm packageTitle={`${title}${room ? ` · ${room}` : ''}`} compact /></div>
      </Modal>
      <Modal open={flyer} onClose={() => setFlyer(false)} label="Package flyer" className="max-w-3xl">
        <div className="p-4"><img src={p.flyer} alt={`${title} flyer`} className="w-full rounded-2xl" /><a href={p.flyer} download target="_blank" rel="noreferrer" className="btn-gold mt-4 w-full">Download flyer</a></div>
      </Modal>
    </>
  );
}
