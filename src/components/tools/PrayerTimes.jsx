import { useState } from 'react';
import { usePrayerTimes } from '@/utils/hooks';
import { cx } from '@/utils/helpers';

const NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/** Today's prayer times in Makkah and Madinah (Umm al-Qura), with the Hijri date. */
export function PrayerTimes() {
  const [city, setCity] = useState('Makkah');
  const d = usePrayerTimes(city);
  return (
    <div className="card p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full border hairline p-1">
          {['Makkah', 'Madinah'].map((c) => <button key={c} onClick={() => setCity(c)} className={cx('rounded-full px-5 py-2 text-[14.5px]', city === c ? 'bg-ink text-bg' : 'text-muted')}>{c}</button>)}
        </div>
        {d?.hijri && <p className="text-[14.5px] text-muted">{d.hijri.day} {d.hijri.month.en} {d.hijri.year} AH</p>}
      </div>
      {d?.error ? <p className="mt-8 text-muted">Prayer times could not load. Check your connection and refresh.</p> : (
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {NAMES.map((n) => (
            <div key={n} className="rounded-2xl bg-raised px-4 py-5 text-center">
              <div className="text-[13px] text-muted">{n}</div>
              <div className="mt-1 font-display text-[26px] tabular-nums">{d?.timings?.[n] || '··:··'}</div>
            </div>
          ))}
        </div>
      )}
      <p className="mt-5 text-[13px] text-muted">Local time in {city} (Saudi Arabia, GMT+3).</p>
    </div>
  );
}
