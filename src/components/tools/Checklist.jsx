import { Check } from 'lucide-react';
import { useLocalStorage } from '@/utils/hooks';
import { cx } from '@/utils/helpers';
import { useState } from 'react';

export const CHECKLISTS = {
  Documents: ['Passport valid 6+ months beyond return', 'Passport first-page scan', 'Photo with light blue background', 'CNIC / NICOP copy', 'Next of kin CNIC & phone number', 'Blood group report', 'Meningitis vaccination certificate', 'Polio vaccination card', 'Mahram details (for women under 45)'],
  'Ihram & clothing': ['2 sets of ihram (men)', 'Ihram belt with pouch', 'Comfortable abaya / loose clothes (women)', 'Unscented soap & deodorant', 'Flat sandals that show the ankle', 'Light shawl for Muzdalifah night'],
  Health: ['Personal medicines + prescription copy', 'ORS sachets', 'Paracetamol & antacids', 'Blister plasters', 'Small umbrella for sun', 'Refillable water bottle'],
  'Rites & duas': ['Talbiyah memorised', 'Duas for Arafah written down', 'Pocket Hajj guide from our manasik class', 'Small bag for 70 pebbles', 'Tasbeeh'],
};

/** Ticks are saved on this device, so pilgrims can come back while packing. */
export function Checklist() {
  const [done, setDone] = useLocalStorage('krh-checklist', {});
  const [tab, setTab] = useState(Object.keys(CHECKLISTS)[0]);
  const all = Object.values(CHECKLISTS).flat();
  const count = all.filter((x) => done[x]).length;
  return (
    <div className="card p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {Object.keys(CHECKLISTS).map((k) => {
            const n = CHECKLISTS[k].filter((x) => done[x]).length;
            return <button key={k} onClick={() => setTab(k)} className={cx('rounded-full border px-4 py-2 text-[14px]', tab === k ? 'border-gold bg-gold/10 text-gold' : 'hairline text-muted')}>{k} <span className="opacity-60">{n}/{CHECKLISTS[k].length}</span></button>;
          })}
        </div>
        <p className="text-[14px] text-muted">{count} of {all.length} ready</p>
      </div>
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-gold transition-all duration-700" style={{ width: `${(count / all.length) * 100}%` }} /></div>
      <ul className="mt-8 grid gap-2 sm:grid-cols-2">
        {CHECKLISTS[tab].map((x) => (
          <li key={x}>
            <button onClick={() => setDone({ ...done, [x]: !done[x] })} aria-pressed={!!done[x]} className="flex w-full items-center gap-3 rounded-2xl border hairline px-4 py-3.5 text-left text-[15.5px] transition hover:border-gold/50">
              <span className={cx('grid h-6 w-6 shrink-0 place-items-center rounded-full border transition', done[x] ? 'border-gold bg-gold text-black' : 'border-ink/25')}>{done[x] && <Check size={14} />}</span>
              <span className={cx(done[x] && 'text-muted line-through')}>{x}</span>
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => window.print()} className="btn-ghost mt-8 !py-2">Print checklist</button>
    </div>
  );
}
