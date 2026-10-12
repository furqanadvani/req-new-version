import { useMemo, useState } from 'react';
import { Plus, Pencil, Copy, Trash2, Eye, EyeOff, Search } from 'lucide-react';
import { useLiveCollection, saveItem, patchItem, removeItem } from '@/utils/api';
import { slugify, cx } from '@/utils/helpers';
import { FieldGrid } from './Fields';
import { Drawer, PortalHead, Toast } from './Shell';
import { SCHEMAS, LIST_COLUMNS } from './schemas';
import { Spinner } from '../ui/Section';

const DEFAULTS = {
  hajjPackages: () => ({ type: 'hajj', published: true, year: new Date().getFullYear() + 1, maktab: 'B', prices: [{ room: 'Sharing' }, { room: 'Quad' }, { room: 'Triple' }, { room: 'Double' }], hotels: [] }),
  umrahPackages: () => ({ type: 'umrah', published: true, season: 'All year', prices: [{ room: 'Sharing' }, { room: 'Quad' }, { room: 'Triple' }, { room: 'Double' }], hotels: [] }),
  testimonials: () => ({ published: true, rating: 5 }),
};

/** List + editor for any content collection. Packages get year filters and "copy to next year". */
export function CollectionManager({ name, title, text }) {
  const { items, loading, error } = useLiveCollection(name);
  const [edit, setEdit] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [q, setQ] = useState('');
  const [year, setYear] = useState('all');
  const isHajj = name === 'hajjPackages';
  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2600); };

  const years = useMemo(() => [...new Set(items.map((i) => i.year).filter(Boolean))].sort((a, b) => b - a), [items]);
  const list = useMemo(() => items
    .filter((i) => year === 'all' || i.year === Number(year))
    .filter((i) => !q || JSON.stringify(i).toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (b.year || 0) - (a.year || 0) || (a.order ?? 99) - (b.order ?? 99)), [items, q, year]);

  async function save() {
    setBusy(true);
    try {
      const d = { ...edit };
      if (SCHEMAS[name].some((f) => f.key === 'slug')) d.slug = d.slug ? slugify(d.slug) : slugify(`${d.title} ${d.year || ''}`);
      const id = d.id || (d.slug ? d.slug : undefined);
      await saveItem(name, id, d);
      setEdit(null); flash('Saved. The website shows it now.');
    } catch (e) { flash(e.message); }
    setBusy(false);
  }
  async function duplicate(it, nextYear = false) {
    const { id, createdAt, updatedAt, ...rest } = it;
    const copy = { ...rest, title: nextYear ? rest.title : `${rest.title} (copy)`, published: false };
    if (nextYear) copy.year = (it.year || new Date().getFullYear()) + 1;
    copy.slug = slugify(`${copy.title} ${copy.year || ''}`);
    setEdit(copy);
  }
  async function del(it) {
    if (!confirm(`Delete "${it.title || it.name || it.q || 'this item'}"? This cannot be undone.`)) return;
    try { await removeItem(name, it.id); flash('Deleted.'); } catch (e) { flash(e.message); }
  }

  const cols = LIST_COLUMNS[name];
  return (
    <>
      <PortalHead title={title} text={text}>
        <label className="relative"><Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="field !w-56 !py-2.5 pl-10" /></label>
        <button onClick={() => setEdit((DEFAULTS[name] || (() => ({})))())} className="btn-gold"><Plus size={16} />Add new</button>
      </PortalHead>
      {isHajj && years.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {['all', ...years].map((y) => <button key={y} onClick={() => setYear(String(y))} className={cx('rounded-full border px-4 py-1.5 text-[14px]', String(year) === String(y) ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted')}>{y === 'all' ? 'All years' : y}</button>)}
        </div>
      )}
      {error && <p className="card mb-5 p-4 text-[14px] text-red-500">{error}</p>}
      {loading ? <Spinner /> : (
        <div className="card divide-hair overflow-hidden">
          {list.length === 0 && <p className="p-8 text-center text-muted">Nothing here yet. Use "Add new", or load starter content from the dashboard.</p>}
          {list.map((it) => {
            const [a, b, c] = cols(it);
            return (
              <div key={it.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                {(it.cover || it.image || it.photo) && <img src={it.cover || it.image || it.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{a}</p>
                  <p className="truncate text-[13.5px] text-muted">{[b, c].filter(Boolean).join(' · ')}</p>
                </div>
                {'published' in it && (
                  <button onClick={() => patchItem(name, it.id, { published: !it.published })} className={cx('flex items-center gap-1.5 rounded-full px-3 py-1 text-[12.5px]', it.published ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-ink/5 text-muted')}>
                    {it.published ? <Eye size={13} /> : <EyeOff size={13} />}{it.published ? 'Live' : 'Hidden'}
                  </button>
                )}
                <div className="flex gap-1">
                  {isHajj && <button onClick={() => duplicate(it, true)} className="rounded-full px-3 py-2 text-[13px] text-gold hover:bg-gold/10" title="Copy as next year's package">→ {(it.year || 0) + 1}</button>}
                  <button onClick={() => duplicate(it)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5" aria-label="Duplicate"><Copy size={15} /></button>
                  <button onClick={() => setEdit(it)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5" aria-label="Edit"><Pencil size={15} /></button>
                  <button onClick={() => del(it)} className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-500/10" aria-label="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Drawer open={!!edit} onClose={() => setEdit(null)} title={edit?.id ? 'Edit' : 'Add new'}
        footer={<><button onClick={() => setEdit(null)} className="btn-ghost">Cancel</button><button onClick={save} disabled={busy} className="btn-gold">{busy ? <Spinner /> : 'Save'}</button></>}>
        {edit && <FieldGrid fields={SCHEMAS[name]} data={edit} setData={setEdit} />}
      </Drawer>
      <Toast msg={toast} />
    </>
  );
}
