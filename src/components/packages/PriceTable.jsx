import { useMoney } from '@/utils/currency';
import { cx } from '@/utils/helpers';

const NOTE = { Sharing: 'Shared room, separate for men and women', Quad: '4 per room', Triple: '3 per room', Double: '2 per room' };

export function PriceTable({ prices = [], selected, onSelect }) {
  const { format, currency } = useMoney();
  const rows = prices.filter((p) => p.pkr || p.usd);
  if (!rows.length) return <p className="text-muted">Prices on request. Call or WhatsApp us for this package.</p>;
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {rows.map((p) => (
        <button key={p.room} type="button" onClick={() => onSelect?.(p.room)}
          className={cx('card flex items-center justify-between gap-4 p-5 text-left transition', selected === p.room ? '!border-gold ring-1 ring-gold' : 'hover:!border-gold/50')}>
          <span>
            <span className="block font-display text-xl">{p.room}</span>
            <span className="text-[13px] text-muted">{NOTE[p.room] || 'Per person'}</span>
          </span>
          <span className="text-right">
            <span className="block whitespace-nowrap font-display text-[20px] text-gold sm:text-[22px]">{format(p.pkr, p.usd)}</span>
            {currency !== 'USD' && p.usd ? <span className="text-[12.5px] text-muted">{format(p.pkr, p.usd, 'USD')}</span> : currency !== 'PKR' && p.pkr ? <span className="text-[12.5px] text-muted">Rs {Number(p.pkr).toLocaleString('en-PK')}</span> : null}
          </span>
        </button>
      ))}
    </div>
  );
}
