import { useState } from 'react';
import { Plus, Trash2, Upload, ArrowUp, ArrowDown, X } from 'lucide-react';
import { uploadFile } from '@/utils/api';
import { cx } from '@/utils/helpers';

/**
 * Schema-driven form fields for the portal.
 * field: { key, label, type, options, help, fields (for rows), folder, accept, span }
 * types: text | textarea | number | bool | select | color | image | file | list | rows | date
 */
export function Field({ field, value, onChange }) {
  const f = field;
  const id = `f-${f.key}`;
  const wrap = (child) => (
    <div className={cx(f.span === 2 && 'sm:col-span-2')}>
      {f.type !== 'bool' && <label htmlFor={id} className="label">{f.label}</label>}
      {child}
      {f.help && <p className="mt-1.5 text-[12.5px] text-muted">{f.help}</p>}
    </div>
  );
  switch (f.type) {
    case 'textarea': return wrap(<textarea id={id} rows={f.rows || 4} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />);
    case 'number': return wrap(<input id={id} type="number" className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))} />);
    case 'date': return wrap(<input id={id} type="date" className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />);
    case 'select': return wrap(
      <select id={id} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
        <option value="">—</option>{(f.options || []).map((o) => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}
      </select>);
    case 'bool': return wrap(
      <label className="flex cursor-pointer items-center gap-3 rounded-xl border hairline px-4 py-3">
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-[rgb(var(--gold))]" />
        <span className="text-[15px]">{f.label}</span>
      </label>);
    case 'color': return wrap(
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} className="h-12 w-14 cursor-pointer rounded-xl border hairline bg-transparent" aria-label={f.label} />
        <input id={id} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
      </div>);
    case 'image': case 'file': return wrap(<UploadField id={id} value={value} onChange={onChange} folder={f.folder} accept={f.accept || (f.type === 'image' ? 'image/*' : '*/*')} image={f.type === 'image'} />);
    case 'list': return wrap(
      <textarea id={id} rows={f.rows || 5} className="field font-mono text-[13.5px]" value={Array.isArray(value) ? value.join('\n') : value ?? ''}
        onChange={(e) => onChange(e.target.value.split('\n'))} onBlur={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} placeholder="One item per line" />);
    case 'rows': return wrap(<RowsField fields={f.fields} value={value || []} onChange={onChange} addLabel={f.addLabel} />);
    default: return wrap(<input id={id} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={f.placeholder} />);
  }
}

const getPath = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
const setPath = (o, k, v) => {
  const [h, ...rest] = k.split('.');
  return { ...o, [h]: rest.length ? setPath(o?.[h] || {}, rest.join('.'), v) : v };
};

/** Renders a schema. Keys may be dotted ("theme.gold") to edit nested objects. */
export function FieldGrid({ fields, data, setData }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {fields.map((f) => f.section
        ? <h3 key={f.section} className="mt-4 border-t hairline pt-6 font-display text-xl sm:col-span-2">{f.section}</h3>
        : <Field key={f.key} field={f} value={getPath(data, f.key)} onChange={(v) => setData((d) => setPath(d, f.key, v))} />)}
    </div>
  );
}

export function UploadField({ id, value, onChange, folder = 'uploads', accept, image }) {
  const [p, setP] = useState(null);
  const [err, setErr] = useState('');
  async function pick(e) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(''); setP(0);
    try { onChange(await uploadFile(file, folder, setP)); } catch (er) { setErr(er.message); }
    setP(null); e.target.value = '';
  }
  return (
    <div>
      <div className="flex items-center gap-3">
        {image && value && <img src={value} alt="" className="h-14 w-14 shrink-0 rounded-xl border hairline object-cover" />}
        <input id={id} className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder="Upload, or paste a URL" />
        <label className="btn-ghost shrink-0 cursor-pointer !px-4 !py-3">
          <Upload size={16} />{p != null ? `${Math.round(p * 100)}%` : 'Upload'}
          <input type="file" accept={accept} className="sr-only" onChange={pick} />
        </label>
        {value && <button type="button" onClick={() => onChange('')} className="grid h-11 w-11 shrink-0 place-items-center rounded-full hover:bg-ink/5" aria-label="Remove"><X size={16} /></button>}
      </div>
      {err && <p className="mt-1.5 text-[13px] text-red-500">{err}</p>}
    </div>
  );
}

function RowsField({ fields, value, onChange, addLabel = 'Add row' }) {
  const set = (i, k, v) => onChange(value.map((r, j) => (j === i ? { ...r, [k]: v } : r)));
  const move = (i, d) => { const a = [...value]; const [x] = a.splice(i, 1); a.splice(i + d, 0, x); onChange(a); };
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="rounded-2xl border hairline p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {fields.map((f) => <Field key={f.key} field={{ ...f, span: f.span }} value={row[f.key]} onChange={(v) => set(i, f.key, v)} />)}
          </div>
          <div className="mt-3 flex justify-end gap-1">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30" aria-label="Move up"><ArrowUp size={15} /></button>
            <button type="button" disabled={i === value.length - 1} onClick={() => move(i, 1)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5 disabled:opacity-30" aria-label="Move down"><ArrowDown size={15} /></button>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid h-9 w-9 place-items-center rounded-full text-red-500 hover:bg-red-500/10" aria-label="Remove row"><Trash2 size={15} /></button>
          </div>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, {}])} className="btn-ghost !py-2 text-[14px]"><Plus size={15} />{addLabel}</button>
    </div>
  );
}
