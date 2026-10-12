import { BookOpen, Bus, Hotel, Landmark, Moon, Stamp, Users, Plane, ShieldCheck, Sparkles } from 'lucide-react';

function Kaaba(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props} width={props.size || 24} height={props.size || 24}>
      <path d="M12 3 3 7v10l9 4 9-4V7z" /><path d="M3 7l9 4 9-4M12 11v10" /><path d="M3 10.2l9 4 9-4" />
    </svg>
  );
}
const MAP = { kaaba: Kaaba, moon: Moon, landmark: Landmark, stamp: Stamp, hotel: Hotel, bus: Bus, book: BookOpen, users: Users, plane: Plane, shield: ShieldCheck };
export const ICON_KEYS = Object.keys(MAP);
export function Icon({ name, ...p }) {
  const C = MAP[name] || Sparkles;
  return <C {...p} />;
}
