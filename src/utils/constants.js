/** One codebase, many websites: each site reads its own settings doc (settings/{SITE_ID}). */
export const SITE_ID = import.meta.env.VITE_SITE_ID || 'site';

export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://www.rfqtravel.com').replace(/\/$/, '');

export const ROUTES = {
  home: '/',
  about: '/about',
  hajj: '/hajj-packages',
  umrah: '/umrah-packages',
  services: '/services',
  contact: '/contact',
  register: '/hajj-registration',
  toolkit: '/pilgrim-toolkit',
  overseas: '/hajj-umrah-for-overseas-pakistanis',
  track: '/track-registration',
  privacy: '/privacy-policy',
  terms: '/terms',
};

export const NAV = [
  { label: 'Hajj', to: ROUTES.hajj },
  { label: 'Umrah', to: ROUTES.umrah },
  { label: 'Services', to: ROUTES.services },
  { label: 'Toolkit', to: ROUTES.toolkit },
  { label: 'Overseas', to: ROUTES.overseas },
  { label: 'About', to: ROUTES.about },
  { label: 'Contact', to: ROUTES.contact },
];

export const COLLECTIONS = {
  hajj: 'hajjPackages',
  umrah: 'umrahPackages',
  services: 'services',
  testimonials: 'testimonials',
  faqs: 'faqs',
  team: 'team',
  gallery: 'gallery',
  queries: 'queries',
  registrations: 'registrations',
  status: 'registrationStatus',
  subscribers: 'subscribers',
  settings: 'settings',
  admins: 'admins',
};

export const ROOM_TYPES = ['Sharing', 'Quad', 'Triple', 'Double'];
export const MAKTABS = ['A', 'B', 'C', 'D'];
export const QUERY_STATUS = ['new', 'contacted', 'converted', 'closed'];
export const REG_STATUS = ['received', 'documents pending', 'under review', 'confirmed', 'visa issued', 'cancelled'];

/** Fonts the portal can switch between (all on Google Fonts). */
export const FONT_PRESETS = {
  display: ['Marcellus', 'Cinzel', 'Cormorant Garamond', 'Playfair Display', 'Bodoni Moda', 'DM Serif Display'],
  body: ['Figtree', 'Manrope', 'Outfit', 'Plus Jakarta Sans', 'Lato', 'Inter'],
};

export const DEFAULT_THEME = {
  gold: '#D4AF6A', gold2: '#F0D49A',
  darkBg: '#0A0907', darkSurface: '#14120E', darkRaised: '#1D1A14', darkInk: '#F4EEE2', darkMuted: '#A89E8C',
  lightGold: '#96712A', lightGold2: '#C49C52',
  lightBg: '#FAF8F3', lightSurface: '#FFFFFF', lightRaised: '#F3EFE6', lightInk: '#18140E', lightMuted: '#686052',
  displayFont: 'Marcellus', bodyFont: 'Figtree', defaultMode: 'dark', radius: 22,
};
