import { PackageCard } from './PackageCard';
import { Reveal } from '../ui/Section';

export function PackageGrid({ items }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.08}><PackageCard pkg={p} /></Reveal>)}
    </div>
  );
}
