/**
 * Seed content — copied from the current rfqtravel.com so the new site works before Firestore
 * has data. In the portal, "Load starter content" writes all of this into Firestore once.
 * ⚠ Prices, dates and hotel names were read from the old flyers: verify them in the portal.
 */

import { DEFAULT_THEME } from './constants';

export const seedSettings = {
  // Branding — change per website. Leave logoUrl empty to use the built-in calligraphy mark.
  logoUrl: '',
  faviconUrl: '/images/logo-gold.png',
  theme: DEFAULT_THEME,

  brandName: 'Karwan-e-Rafeeq ul Harmain',
  legalName: 'Karwan-e-Rafeeq ul Harmain (Pvt) Ltd',
  urduName: 'کاروانِ رفیق الحرمین',
  tagline: 'Hajj, Umrah & Ziarat group from Karachi',
  foundedYear: 2005,
  pilgrimsServed: 25000,
  licenseText: 'Govt. approved Hajj organiser · Form 21 & 29 · IATA',

  phones: ['+92 21 34857005', '+92 21 34856651', '+92 333 2184494'],
  whatsapp: '+92 333 2184494',
  email: 'info@rfqtravel.com',
  address: 'Office #103, Iconic Trade Centre, near KBC Restaurant, Bahadurabad, Karachi',
  hours: 'Monday to Saturday, 9am to 7pm (PKT)',
  mapQuery: 'Iconic Trade Center, Bahadurabad, Karachi',
  facebook: '',
  instagram: '',
  youtube: '',
  tiktok: '',

  // Hero
  heroLine: 'Labbaik Allahumma Labbaik',
  heroTitle: 'Your Hajj, arranged with the care of family',
  heroText: 'Government-approved Hajj and Umrah group from Karachi. Hotels near Haram, Mina and Arafat handled, scholars with you at every rite.',
  heroSlides: [
    { title: 'Hajj 2027 registration is open', text: 'Seats are allotted in order of registration. Secure yours with documents only — no payment today.', image: '/images/hero-haram.jpg', cta: 'Register for Hajj 2027', link: '/hajj-registration' },
    { title: 'Umrah every month of the year', text: 'Economy to 5-star, 7 to 28 days, with visa, flights and transport included.', image: '/images/hero-arafat.jpg', cta: 'See Umrah packages', link: '/umrah-packages' },
    { title: 'Living in the UK, USA or Gulf?', text: 'Fly from where you live and join our group in Makkah. Same care, priced for your passport.', image: '/images/hero-haram.jpg', cta: 'Hajj for overseas Pakistanis', link: '/hajj-umrah-for-overseas-pakistanis' },
  ],
  hajjYear: 2027,
  arafahDate: '2027-05-15',
  registrationOpen: true,

  // Promo video (upload a new one in the portal; leave empty to hide)
  promoVideo: '/media/promo.mp4',
  promoPoster: '/media/promo-poster.jpg',
  promoTitle: 'Hajj is a journey of the heart',
  promoText: 'Hear why thousands of families trust our scholars and staff with the most important journey of their lives.',

  // Popup after first load
  popupEnabled: true,
  popupDelay: 6,
  popupTitle: 'Kya aap is saal Hajj ki saadat hasil karna chahte hain?',
  popupText: 'Hajj 2027 registration is open. Reserve your seat now — our team will call you within 24 hours.',

  // About
  aboutStory: 'Since our founding in 2005, Karwan-e-Rafeeq ul Harmain (Pvt) Ltd has served the guests of Allah with world-class arrangements at honest prices. We grew without advertising — through the trust of pilgrims who came back, and brought their families with them.\n\nWe are a fully licensed travel agency and Hajj & Umrah service provider, offering guidance to pilgrims, business travellers and families. Our relationships with hotels, airlines and maktabs in Saudi Arabia let us offer the best available arrangements, backed by a dedicated team and modern systems.',
  ceoQuote: 'We offer packages tailored to the needs and preferences of every pilgrim — flights, accommodation, transport and guided tours — so every journey is truly yours.',
  ceoName: 'Aamir Anwar',
  ceoTitle: 'CEO',
  certificates: [
    { title: 'Form 21', file: '' },
    { title: 'Form 29', file: '' },
    { title: 'IATA certificate', file: '' },
  ],

  // Currency (PKR per 1 unit) — used by calculators. Update from the portal.
  qurbaniPkr: 75000, // approximate Qurbani coupon per person, used by the budget calculator
  rates: { USD: 280, GBP: 375, EUR: 305, SAR: 74.5, AED: 76, CAD: 205, AUD: 183 },

  // SEO defaults
  seoTitle: 'Hajj & Umrah Packages 2027 from Pakistan',
  seoDescription: 'Government-approved Hajj and Umrah organiser in Karachi. Hajj 2027 registration open — packages near Haram with visa, flights, Mina & Arafat and guided ziyarat. Serving overseas Pakistanis in UK, USA, Canada & UAE.',

  privacyPolicy: 'We collect the information you submit in forms (name, phone, email, travel details and documents) only to arrange your travel and contact you. We never sell or share it outside the authorities, airlines and hotels needed for your booking. Ask us at any time to see or delete your data.',
  terms: 'Package prices are subject to change by Saudi authorities, airlines and currency rates until full payment is received. Hajj payments are non-refundable once visas are processed. Room allocation in Aziziya is on a sharing basis unless stated otherwise. Qurbani is not included unless stated.',
};

const hajjFeatures = [
  'Meet & assist upon arrival at Jeddah airport',
  'Complete accommodation at Makkah, Madinah and Aziziya as listed',
  'Return airfare included (through any indirect airline)',
  'Ziarat of Makkah & Madinah',
  'Seat-by-seat transport in luxury air-conditioned buses',
  'Maktab services as per Saudi company',
];
const hajjFood = ['Makkah: half board', 'Madinah: full board', 'Aziziya: breakfast, lunch & dinner', 'Mina: 3 meals provided by Saudi company'];
const hajjDocs = [
  'Passport (valid at least 6 months), first page scan',
  'Photograph with light blue background',
  'CNIC / NICOP copy (NADRA)',
  'Next of kin ID card and contact number',
  'Blood group',
  'Vaccinations (Meningitis, Polio — as required)',
];
const hajjNotes = [
  'Aziziya rooms are on a sharing basis',
  'Qurbani not included',
  'Stay in Aziziya, Makkah & Madinah may increase or decrease subject to seat availability',
  'Children under 12 are not allowed to travel for Hajj',
  'Pilgrims from USA, Canada, UK, Europe, Australia, Middle East & Far East have different prices. If you buy your own ticket, deduct USD 800 from the package price.',
];

const mk = (o) => ({
  type: 'hajj', published: true, featured: false, maktab: 'B',
  inclusions: hajjFeatures, food: hajjFood, documents: hajjDocs, notes: hajjNotes,
  payment: '100% payment in advance at the time of booking (non-refundable).',
  cover: '', flyer: '', ...o,
});

export const seedHajj = [
  mk({
    id: 'hajj-2026-28-days', slug: 'hajj-2026-28-days', year: 2026, title: 'Hajj 28 Days', days: 28, order: 1, featured: true,
    summary: 'Swissotel Makkah before Hajj, Aziziya building for the days of Hajj, and Artal International near Masjid an-Nabawi.',
    hotels: [
      { city: 'Makkah', hotel: 'Swissotel Makkah', distance: 'Haram front', stay: '25 Zil Qadah – 04 Zil Hajj' },
      { city: 'Aziziya', hotel: 'Aziziya building', distance: 'Shuttle to Haram', stay: '04 – 07 Zil Hajj' },
      { city: 'Mina & Arafat', hotel: 'Maktab B tents', distance: '—', stay: '08 – 12 Zil Hajj' },
      { city: 'Aziziya', hotel: 'Aziziya building', distance: 'Shuttle to Haram', stay: '12 – 17 Zil Hajj' },
      { city: 'Madinah', hotel: 'Artal International', distance: 'Markazia', stay: '17 – 23 Zil Hajj' },
    ],
    prices: [
      { room: 'Sharing', pkr: 2025000, usd: 7340 },
      { room: 'Quad', pkr: 2050000, usd: 7430 },
      { room: 'Triple', pkr: 2125000, usd: 7700 },
      { room: 'Double', pkr: 2225000, usd: 8060 },
    ],
  }),
  mk({
    id: 'hajj-2026-28-days-economy', slug: 'hajj-2026-28-days-economy', year: 2026, title: 'Hajj 28 Days Economy', days: 28, order: 2,
    summary: 'The full 28-day programme at a lower price, with hotels a short walk from Haram.',
    hotels: [
      { city: 'Makkah', hotel: 'Hotel near Haram', distance: '600–800 m', stay: 'Before Hajj' },
      { city: 'Aziziya', hotel: 'Aziziya building', distance: 'Shuttle', stay: 'Days of Hajj' },
      { city: 'Madinah', hotel: 'Hotel in Markazia', distance: '300 m', stay: 'After Hajj' },
    ],
    prices: [
      { room: 'Sharing', pkr: 1925000, usd: 6975 },
      { room: 'Quad', pkr: 2000000, usd: 7240 },
      { room: 'Triple', pkr: 2100000, usd: 7600 },
    ],
  }),
  mk({
    id: 'hajj-2026-23-days', slug: 'hajj-2026-23-days', year: 2026, title: 'Hajj 23 Days', days: 23, order: 3,
    summary: 'A balanced programme for working pilgrims — Makkah, Aziziya and Madinah in 23 days.',
    hotels: [
      { city: 'Makkah', hotel: 'Hotel near Haram', distance: '—', stay: 'Before Hajj' },
      { city: 'Aziziya', hotel: 'Aziziya building', distance: 'Shuttle', stay: 'Days of Hajj' },
      { city: 'Madinah', hotel: 'Hotel in Markazia', distance: '—', stay: 'After Hajj' },
    ],
    prices: [
      { room: 'Sharing', pkr: 1750000, usd: 6290 },
      { room: 'Quad', pkr: 1800000, usd: 6430 },
      { room: 'Triple', pkr: 1850000, usd: 6600 },
    ],
  }),
  mk({
    id: 'hajj-2026-17-days', slug: 'hajj-2026-17-days', year: 2026, title: 'Hajj 17 Days', days: 17, order: 4,
    summary: 'The shortest complete Hajj — ideal if you can only take two and a half weeks away.',
    hotels: [
      { city: 'Makkah', hotel: 'Hotel near Haram', distance: '—', stay: 'Before Hajj' },
      { city: 'Aziziya', hotel: 'Aziziya building', distance: 'Shuttle', stay: 'Days of Hajj' },
      { city: 'Madinah', hotel: 'Hotel in Markazia', distance: '—', stay: 'After Hajj' },
    ],
    prices: [
      { room: 'Sharing', pkr: 2025000, usd: 7335 },
      { room: 'Quad', pkr: 2075000, usd: 7410 },
      { room: 'Triple', pkr: 2175000, usd: 7770 },
    ],
  }),
  mk({
    id: 'hajj-2025-21-days', slug: 'hajj-2025-21-days', year: 2025, title: 'Hajj 21 Days', days: 21, order: 1,
    summary: 'Our 2025 programme — 21 days across Makkah, Aziziya and Madinah.',
    hotels: [],
    prices: [
      { room: 'Sharing', pkr: 1950000, usd: 7065 },
      { room: 'Quad', pkr: 1975000, usd: 7155 },
      { room: 'Triple', pkr: 2000000, usd: 7250 },
      { room: 'Double', pkr: 2100000, usd: 7610 },
    ],
  }),
  mk({
    id: 'hajj-2025-15-days', slug: 'hajj-2025-15-days', year: 2025, title: 'Hajj 15 Days', days: 15, order: 2,
    summary: 'Our 2025 short programme for pilgrims with limited leave.',
    hotels: [],
    prices: [
      { room: 'Sharing', pkr: 1450000, usd: 5250 },
      { room: 'Quad', pkr: 1475000, usd: 5340 },
      { room: 'Triple', pkr: 1525000, usd: 5525 },
    ],
  }),
  mk({ id: 'hajj-2024-21-days', slug: 'hajj-2024-21-days', year: 2024, title: 'Hajj 21 Days', days: 21, order: 1, summary: 'Our 2024 programme.', hotels: [], prices: [{ room: 'Sharing', pkr: null, usd: 6810 }] }),
  mk({ id: 'hajj-2024-27-days', slug: 'hajj-2024-27-days', year: 2024, title: 'Hajj 27 Days', days: 27, order: 2, summary: 'Our 2024 long programme.', hotels: [], prices: [{ room: 'Sharing', pkr: null, usd: 7700 }] }),
];

const umrahIncl = ['Umrah visa', 'Return air ticket', 'Hotels in Makkah & Madinah', 'Airport & intercity transport', 'Ziarat of Makkah & Madinah'];
export const seedUmrah = [
  {
    id: 'umrah-15-days-economy', slug: 'umrah-15-days-economy', type: 'umrah', published: true, featured: true, order: 1,
    title: 'Umrah 15 Days Economy', days: 15, season: 'All year', summary: 'Comfortable hotels within walking distance, ideal for first-time pilgrims and families.',
    hotels: [
      { city: 'Makkah', hotel: '3-star hotel', distance: '700 m', stay: '8 nights' },
      { city: 'Madinah', hotel: '3-star hotel', distance: '400 m', stay: '6 nights' },
    ],
    prices: [{ room: 'Sharing', pkr: 285000, usd: 1020 }, { room: 'Quad', pkr: 305000, usd: 1090 }, { room: 'Triple', pkr: 325000, usd: 1160 }, { room: 'Double', pkr: 365000, usd: 1300 }],
    inclusions: umrahIncl, documents: hajjDocs.slice(0, 4), notes: ['Prices change in Ramadan and school holidays', 'Ask for a group date near you'], cover: '', flyer: '',
  },
  {
    id: 'umrah-21-days-standard', slug: 'umrah-21-days-standard', type: 'umrah', published: true, featured: true, order: 2,
    title: 'Umrah 21 Days Standard', days: 21, season: 'All year', summary: 'More time in the Haramain with 4-star hotels close to the gates.',
    hotels: [
      { city: 'Makkah', hotel: '4-star hotel', distance: '400 m', stay: '12 nights' },
      { city: 'Madinah', hotel: '4-star hotel', distance: '200 m', stay: '8 nights' },
    ],
    prices: [{ room: 'Sharing', pkr: 365000, usd: 1300 }, { room: 'Quad', pkr: 395000, usd: 1410 }, { room: 'Triple', pkr: 425000, usd: 1520 }, { room: 'Double', pkr: 485000, usd: 1730 }],
    inclusions: umrahIncl, documents: hajjDocs.slice(0, 4), notes: ['Prices change in Ramadan and school holidays'], cover: '', flyer: '',
  },
  {
    id: 'umrah-ramadan-last-ashra', slug: 'umrah-ramadan-last-ashra', type: 'umrah', published: true, featured: false, order: 3,
    title: 'Ramadan Last Ashra', days: 12, season: 'Ramadan', summary: 'The last ten nights in Makkah, with Eid in the Haramain if you choose.',
    hotels: [{ city: 'Makkah', hotel: '5-star hotel', distance: 'Haram front', stay: '10 nights' }],
    prices: [{ room: 'Quad', pkr: 725000, usd: 2590 }, { room: 'Double', pkr: 895000, usd: 3200 }],
    inclusions: umrahIncl, documents: hajjDocs.slice(0, 4), notes: ['Very limited rooms — register early'], cover: '', flyer: '',
  },
];

export const seedServices = [
  { id: 'hajj', order: 1, title: 'Hajj', text: 'Government-approved private Hajj with Maktab, Mina and Arafat arrangements, and scholars with your group.', icon: 'kaaba', tag: 'Hajj 2027 open', image: '' },
  { id: 'umrah', order: 2, title: 'Umrah', text: 'Group and family Umrah all year, with hotels near the Haram and ziarat in both cities.', icon: 'moon', tag: 'All year', image: '' },
  { id: 'tours', order: 3, title: 'Islamic tours', text: 'Ziarat tours to Jerusalem, Baghdad, Turkey, Egypt and Jordan on custom dates.', icon: 'landmark', tag: 'Custom dates', image: '' },
  { id: 'visa', order: 4, title: 'Visa processing', text: 'Hajj, Umrah and tourist visas handled end to end, including e-visa for Pakistani passports overseas.', icon: 'stamp', tag: 'Included', image: '' },
  { id: 'hotels', order: 5, title: 'Hotels near Haram', text: 'From Haram-front towers to budget stays, booked through our direct partners in Makkah and Madinah.', icon: 'hotel', tag: 'Included', image: '' },
  { id: 'transport', order: 6, title: 'Transport', text: 'Seat-by-seat air-conditioned buses for airports, intercity travel and ziarat.', icon: 'bus', tag: 'Included', image: '' },
  { id: 'manasik', order: 7, title: 'Manasik training', text: 'Practical Hajj and Umrah training sessions in Karachi before you travel, with printed guides.', icon: 'book', tag: 'Included', image: '' },
  { id: 'guidance', order: 8, title: 'Scholars with you', text: 'Ulama travel with every group to guide each rite, answer masail and lead duas.', icon: 'users', tag: 'Included', image: '' },
];

export const seedTestimonials = [
  { id: 't1', order: 1, name: 'Abdul Rehman Qureshi', city: 'Islamabad', trip: 'Hajj 2024', rating: 5, text: 'I performed Hajj with them after 12 years of waiting. Everything from Mina to Arafat to the Jamarat was well organised. I could focus entirely on my ibadah without any worry.', published: true },
  { id: 't2', order: 2, name: 'Ayesha Siddiqui', city: 'Lahore', trip: 'Umrah 2024', rating: 5, text: 'It was my first Umrah and I was afraid of getting lost or making mistakes. Their guide was with us at every step and made sure our rituals were correct.', published: true },
  { id: 't3', order: 3, name: 'Fatima Noor', city: 'Multan', trip: 'Umrah 2023', rating: 5, text: 'Our hotel was a short walk from the Haram, and the ziarat to Jabal al-Noor and Jannat al-Baqi was deeply moving. Highly recommended.', published: true },
  { id: 't4', order: 4, name: 'Muhammad Usman', city: 'Karachi', trip: 'Umrah 2024', rating: 5, text: 'Every detail was arranged, from the flight to the hotel steps from Masjid al-Haram. The team never let us feel alone.', published: true },
];

export const seedFaqs = [
  { id: 'f1', order: 1, category: 'Packages', q: 'Can I book Hajj 2027 now?', a: 'Yes. Fill the Hajj 2027 registration form with your package, room type and pilgrim details. Seats are allotted in order of registration, and our team calls you within 24 hours to confirm documents and payment.' },
  { id: 'f2', order: 2, category: 'Packages', q: 'What is included in the Hajj package price?', a: 'Return airfare, visa, hotels in Makkah, Aziziya and Madinah, Mina and Arafat tents through the Maktab, meals as listed, all transport, ziarat and guidance by our scholars. Qurbani is not included unless stated.' },
  { id: 'f3', order: 3, category: 'Documents', q: 'What documents do I need for Hajj or Umrah?', a: 'A passport valid for at least 6 months, a photo with light blue background, CNIC or NICOP copy, next-of-kin details, blood group and the required vaccinations. Scanned copies are enough to start.' },
  { id: 'f4', order: 4, category: 'Overseas', q: 'I live in the UK / USA / Gulf. Can I go with your group?', a: 'Yes. Overseas Pakistanis can fly from their own country and join our group in Saudi Arabia. If you buy your own ticket, USD 800 is deducted from the package price. Prices differ by passport — contact us for yours.' },
  { id: 'f5', order: 5, category: 'Hajj rites', q: 'How many days will I spend in Mina?', a: 'Pilgrims usually stay in Mina from 8 Dhul Hijjah, go to Arafat on the 9th, Muzdalifah that night, and return to Mina for the days of stoning until the 12th or 13th.' },
  { id: 'f6', order: 6, category: 'Hajj rites', q: 'Why do pilgrims stop at Muzdalifah?', a: 'After sunset on the day of Arafah, pilgrims spend the night at Muzdalifah in the open, pray Maghrib and Isha together and collect pebbles for the stoning of the Jamarat.' },
  { id: 'f7', order: 7, category: 'Packages', q: 'Is the payment refundable?', a: 'Hajj payments are made in full at booking and become non-refundable once the visa process begins, because they are paid on to Saudi authorities, airlines and hotels.' },
  { id: 'f8', order: 8, category: 'Hajj rites', q: 'What is the significance of the plain of Arafat?', a: 'Standing at Arafat on the 9th of Dhul Hijjah is the essential pillar of Hajj. The Prophet ﷺ said, "Hajj is Arafah." Pilgrims spend the afternoon in dua until sunset.' },
];

export const seedTeam = [
  { id: 'm1', order: 1, name: 'Aamir Anwar', role: 'Chief Executive', photo: '' },
  { id: 'm2', order: 2, name: 'Muhammad Talha', role: 'Director', photo: '' },
  { id: 'm3', order: 3, name: 'Shahzad Najeeb', role: 'Director', photo: '' },
  { id: 'm4', order: 4, name: 'Muhammad Owais', role: 'Accounts', photo: '' },
  { id: 'm5', order: 5, name: 'Zubair Akhtar', role: 'Counter supervisor', photo: '' },
  { id: 'm6', order: 6, name: 'Murad Ali', role: 'Operations', photo: '' },
];

export const seedGallery = [];

export const SEED = {
  hajjPackages: seedHajj,
  umrahPackages: seedUmrah,
  services: seedServices,
  testimonials: seedTestimonials,
  faqs: seedFaqs,
  team: seedTeam,
  gallery: seedGallery,
};
