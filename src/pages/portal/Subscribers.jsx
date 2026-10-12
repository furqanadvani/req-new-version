import { Download } from 'lucide-react';
import { useLiveCollection } from '@/utils/api';
import { COLLECTIONS } from '@/utils/constants';
import { fmtDate, downloadCSV } from '@/utils/helpers';
import { PortalHead } from '@/components/portal';
import { Spinner } from '@/components/ui';

export default function Subscribers() {
  const { items, loading } = useLiveCollection(COLLECTIONS.subscribers);
  return (
    <>
      <PortalHead title="Subscribers" text={`${items.length} people asked for package alerts.`}>
        <button onClick={() => downloadCSV(items, 'subscribers.csv')} className="btn-ghost"><Download size={16} />Export CSV</button>
      </PortalHead>
      {loading ? <Spinner /> : <div className="card divide-hair">{items.map((x) => <div key={x.id} className="flex justify-between px-5 py-3 text-[15px]"><span>{x.email}</span><span className="text-muted">{fmtDate(x.createdAt)}</span></div>)}</div>}
    </>
  );
}
