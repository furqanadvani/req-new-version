import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from './constants';
import { useSettings } from './api';

/**
 * Per-page SEO: title, description, canonical, Open Graph, Twitter and JSON-LD.
 * `schema` accepts one object or an array of schema.org objects.
 */
export function Seo({ title, description, image, schema, noindex, type = 'website' }) {
  const s = useSettings();
  const { pathname } = useLocation();
  const url = `${SITE_URL}${pathname === '/' ? '/' : pathname.replace(/\/$/, '')}`;
  const fullTitle = title ? `${title} | ${s.brandName}` : `${s.seoTitle} | ${s.brandName}`;
  const desc = description || s.seoDescription;
  const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : `${SITE_URL}/images/og-cover.jpg`;
  const schemas = [schema].flat().filter(Boolean);
  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="alternate" hrefLang="en" href={url} />
      <link rel="alternate" hrefLang="en-PK" href={url} />
      <link rel="alternate" hrefLang="en-GB" href={url} />
      <link rel="alternate" hrefLang="en-US" href={url} />
      <link rel="alternate" hrefLang="en-AE" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
      {schemas.map((sc, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', ...sc })}</script>
      ))}
    </Helmet>
  );
}

export const breadcrumbSchema = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
});

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const packageSchema = (pkg, path, brand) => {
  const prices = (pkg.prices || []).filter((p) => p.usd || p.pkr);
  return {
    '@type': 'TouristTrip',
    name: `${pkg.title}${pkg.year ? ` ${pkg.year}` : ''}`,
    description: pkg.summary,
    touristType: pkg.type === 'hajj' ? 'Hajj pilgrims' : 'Umrah pilgrims',
    url: `${SITE_URL}${path}`,
    ...(pkg.cover ? { image: pkg.cover } : {}),
    provider: { '@type': 'TravelAgency', name: brand, url: SITE_URL },
    itinerary: (pkg.hotels || []).map((h) => ({ '@type': 'Place', name: `${h.hotel}, ${h.city}` })),
    offers: prices.map((p) => ({
      '@type': 'Offer', name: `${p.room} room`,
      price: p.pkr || p.usd, priceCurrency: p.pkr ? 'PKR' : 'USD',
      availability: 'https://schema.org/InStock', url: `${SITE_URL}${path}`,
    })),
  };
};
