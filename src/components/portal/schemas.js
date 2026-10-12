import { ROOM_TYPES, MAKTABS, FONT_PRESETS } from '@/utils/constants';
import { ICON_KEYS } from '../ui/Icon';

const hotelRow = [
  { key: 'city', label: 'City' }, { key: 'hotel', label: 'Hotel / building' },
  { key: 'distance', label: 'Distance' }, { key: 'stay', label: 'Dates / nights' },
];
const priceRow = [
  { key: 'room', label: 'Room', type: 'select', options: ROOM_TYPES },
  { key: 'pkr', label: 'Price PKR', type: 'number' }, { key: 'usd', label: 'Price USD', type: 'number' },
];

const packageCommon = (type) => [
  { section: 'Basics' },
  { key: 'title', label: 'Title', placeholder: 'Hajj 28 Days' },
  { key: 'slug', label: 'URL slug', help: 'Leave empty to generate from title + year.' },
  ...(type === 'hajj'
    ? [{ key: 'year', label: 'Hajj year', type: 'number' }, { key: 'maktab', label: 'Maktab', type: 'select', options: MAKTABS }]
    : [{ key: 'season', label: 'Season', placeholder: 'All year / Ramadan / December' }]),
  { key: 'days', label: 'Days', type: 'number' },
  { key: 'order', label: 'Sort order', type: 'number', help: 'Lower shows first.' },
  { key: 'summary', label: 'Short summary', type: 'textarea', span: 2, rows: 2 },
  { key: 'published', label: 'Published on website', type: 'bool' },
  { key: 'featured', label: 'Mark as "Most chosen"', type: 'bool' },
  { section: 'Images' },
  { key: 'cover', label: 'Cover photo (landscape)', type: 'image', folder: 'packages', help: 'Empty = elegant generated cover with the number of days.' },
  { key: 'flyer', label: 'Printable flyer (optional)', type: 'image', folder: 'flyers', help: 'Shown as a download, never as the main image.' },
  { section: 'Prices (per person)' },
  { key: 'prices', label: 'Room prices', type: 'rows', fields: priceRow, span: 2, addLabel: 'Add room type' },
  { section: 'Itinerary' },
  { key: 'hotels', label: 'Hotels in order', type: 'rows', fields: hotelRow, span: 2, addLabel: 'Add stop' },
  { section: 'Details' },
  { key: 'inclusions', label: 'Included', type: 'list' },
  ...(type === 'hajj' ? [{ key: 'food', label: 'Meals', type: 'list' }] : []),
  { key: 'documents', label: 'Documents needed', type: 'list' },
  { key: 'notes', label: 'Notes', type: 'list' },
  { key: 'payment', label: 'Payment terms', type: 'textarea', span: 2, rows: 2 },
];

export const SCHEMAS = {
  hajjPackages: packageCommon('hajj'),
  umrahPackages: packageCommon('umrah'),
  services: [
    { key: 'title', label: 'Title' }, { key: 'tag', label: 'Tag', placeholder: 'Included' },
    { key: 'icon', label: 'Icon', type: 'select', options: ICON_KEYS }, { key: 'order', label: 'Sort order', type: 'number' },
    { key: 'text', label: 'Description', type: 'textarea', span: 2 },
    { key: 'image', label: 'Image (used on the two large tiles)', type: 'image', folder: 'services', span: 2 },
  ],
  testimonials: [
    { key: 'name', label: 'Name' }, { key: 'city', label: 'City' },
    { key: 'trip', label: 'Trip', placeholder: 'Hajj 2025' }, { key: 'rating', label: 'Stars (1–5)', type: 'number' },
    { key: 'text', label: 'Words', type: 'textarea', span: 2 }, { key: 'order', label: 'Sort order', type: 'number' },
    { key: 'published', label: 'Published', type: 'bool' },
  ],
  faqs: [
    { key: 'q', label: 'Question', span: 2 }, { key: 'a', label: 'Answer', type: 'textarea', span: 2 },
    { key: 'category', label: 'Category', placeholder: 'Packages / Documents / Hajj rites / Overseas' }, { key: 'order', label: 'Sort order', type: 'number' },
  ],
  team: [
    { key: 'name', label: 'Name' }, { key: 'role', label: 'Role' },
    { key: 'photo', label: 'Photo (square)', type: 'image', folder: 'team' }, { key: 'order', label: 'Sort order', type: 'number' },
  ],
  gallery: [
    { key: 'image', label: 'Photo', type: 'image', folder: 'gallery', span: 2 },
    { key: 'caption', label: 'Caption' }, { key: 'order', label: 'Sort order', type: 'number' },
  ],
};

export const LIST_COLUMNS = {
  hajjPackages: (p) => [p.title, p.year, `${p.days || '—'} days`],
  umrahPackages: (p) => [p.title, p.season, `${p.days || '—'} days`],
  services: (p) => [p.title, p.tag],
  testimonials: (p) => [p.name, `${p.city || ''} · ${p.trip || ''}`],
  faqs: (p) => [p.q, p.category],
  team: (p) => [p.name, p.role],
  gallery: (p) => [p.caption || 'Photo', ''],
};

/* Settings page tabs */
export const SETTINGS_TABS = {
  'Business': [
    { key: 'brandName', label: 'Brand name' }, { key: 'legalName', label: 'Legal name' },
    { key: 'urduName', label: 'Name in Urdu' }, { key: 'tagline', label: 'Tagline' },
    { key: 'foundedYear', label: 'Founded year', type: 'number', help: 'Used everywhere "since …" appears. Keep one true value.' },
    { key: 'pilgrimsServed', label: 'Pilgrims served', type: 'number' },
    { key: 'licenseText', label: 'Licences line', span: 2 },
    { section: 'Contact' },
    { key: 'phones', label: 'Phone numbers', type: 'list', rows: 3 }, { key: 'whatsapp', label: 'WhatsApp number' },
    { key: 'email', label: 'Email' }, { key: 'hours', label: 'Office hours' },
    { key: 'address', label: 'Address', span: 2 }, { key: 'mapQuery', label: 'Google Maps search text', span: 2 },
    { section: 'Social links' },
    { key: 'facebook', label: 'Facebook URL' }, { key: 'instagram', label: 'Instagram URL' }, { key: 'youtube', label: 'YouTube URL' }, { key: 'tiktok', label: 'TikTok URL' },
  ],
  'Branding & theme': [
    { key: 'logoUrl', label: 'Logo (SVG or transparent PNG)', type: 'image', folder: 'brand', span: 2, help: 'Empty = built-in gold calligraphy (also used by the intro animation).' },
    { key: 'faviconUrl', label: 'Favicon', type: 'image', folder: 'brand', span: 2 },
    { section: 'Theme' },
    { key: 'theme.defaultMode', label: 'Default mode for new visitors', type: 'select', options: [['dark', 'Dark'], ['light', 'Light']] },
    { key: 'theme.radius', label: 'Corner radius (px)', type: 'number' },
    { key: 'theme.displayFont', label: 'Heading font', type: 'select', options: FONT_PRESETS.display },
    { key: 'theme.bodyFont', label: 'Body font', type: 'select', options: FONT_PRESETS.body },
    { section: 'Dark mode colours' },
    { key: 'theme.gold', label: 'Gold', type: 'color' }, { key: 'theme.gold2', label: 'Gold highlight', type: 'color' },
    { key: 'theme.darkBg', label: 'Background', type: 'color' }, { key: 'theme.darkSurface', label: 'Cards', type: 'color' },
    { key: 'theme.darkRaised', label: 'Alternate sections', type: 'color' }, { key: 'theme.darkInk', label: 'Text', type: 'color' },
    { key: 'theme.darkMuted', label: 'Secondary text', type: 'color' },
    { section: 'Light mode colours' },
    { key: 'theme.lightGold', label: 'Gold', type: 'color' }, { key: 'theme.lightGold2', label: 'Gold highlight', type: 'color' },
    { key: 'theme.lightBg', label: 'Background', type: 'color' }, { key: 'theme.lightSurface', label: 'Cards', type: 'color' },
    { key: 'theme.lightRaised', label: 'Alternate sections', type: 'color' }, { key: 'theme.lightInk', label: 'Text', type: 'color' },
    { key: 'theme.lightMuted', label: 'Secondary text', type: 'color' },
  ],
  'Home & popup': [
    { key: 'heroTitle', label: 'Hero headline', span: 2 }, { key: 'heroText', label: 'Hero text', type: 'textarea', span: 2, rows: 2 },
    { key: 'heroSlides', label: 'Hero slides', type: 'rows', span: 2, addLabel: 'Add slide', fields: [
      { key: 'title', label: 'Title' }, { key: 'text', label: 'Text' }, { key: 'cta', label: 'Button text' }, { key: 'link', label: 'Button link' },
      { key: 'image', label: 'Background image (wide, 2400px+)', type: 'image', folder: 'hero', span: 2 },
    ] },
    { section: 'Hajj season' },
    { key: 'hajjYear', label: 'Registration year', type: 'number' }, { key: 'arafahDate', label: 'Expected Day of Arafah', type: 'date' },
    { key: 'registrationOpen', label: 'Registration open', type: 'bool' },
    { section: 'Promo video' },
    { key: 'promoVideo', label: 'Video (MP4, under 20 MB)', type: 'file', accept: 'video/mp4', folder: 'media', span: 2 },
    { key: 'promoPoster', label: 'Poster image', type: 'image', folder: 'media', span: 2 },
    { key: 'promoTitle', label: 'Title' }, { key: 'promoText', label: 'Text', type: 'textarea', rows: 2 },
    { section: 'Popup' },
    { key: 'popupEnabled', label: 'Show registration popup', type: 'bool' }, { key: 'popupDelay', label: 'Delay (seconds)', type: 'number' },
    { key: 'popupTitle', label: 'Popup title', span: 2 }, { key: 'popupText', label: 'Popup text', type: 'textarea', span: 2, rows: 2 },
  ],
  'About & legal': [
    { key: 'aboutStory', label: 'Our story', type: 'textarea', span: 2, rows: 8 },
    { key: 'ceoQuote', label: 'CEO quote', type: 'textarea', span: 2, rows: 2 }, { key: 'ceoName', label: 'CEO name' }, { key: 'ceoTitle', label: 'CEO title' },
    { key: 'certificates', label: 'Certificates', type: 'rows', span: 2, addLabel: 'Add certificate', fields: [{ key: 'title', label: 'Title' }, { key: 'file', label: 'File (PDF / image)', type: 'file', folder: 'certificates', span: 2 }] },
    { key: 'terms', label: 'Terms & refund policy', type: 'textarea', span: 2, rows: 8 },
    { key: 'privacyPolicy', label: 'Privacy policy', type: 'textarea', span: 2, rows: 8 },
  ],
  'SEO & pricing': [
    { key: 'seoTitle', label: 'Default page title', span: 2 }, { key: 'seoDescription', label: 'Default description (150–160 characters)', type: 'textarea', span: 2, rows: 3 },
    { section: 'Exchange rates (PKR per 1 unit)' },
    ...['USD', 'GBP', 'EUR', 'SAR', 'AED', 'CAD', 'AUD'].map((c) => ({ key: `rates.${c}`, label: c, type: 'number' })),
    { key: 'qurbaniPkr', label: 'Qurbani estimate per person (PKR)', type: 'number' },
  ],
};
