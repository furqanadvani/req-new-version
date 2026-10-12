// Builds dist/sitemap.xml from static routes + package slugs.
// Package slugs come from Firestore (REST, public read) when .env has keys, otherwise from seed data.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const env = Object.fromEntries((existsSync('.env') ? readFileSync('.env', 'utf8') : '').split('\n')
  .filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const SITE = (env.VITE_SITE_URL || 'https://www.rfqtravel.com').replace(/\/$/, '');
const PROJECT = env.VITE_FIREBASE_PROJECT_ID;

const staticRoutes = ['/', '/hajj-packages', '/umrah-packages', '/hajj-registration', '/hajj-umrah-for-overseas-pakistanis', '/pilgrim-toolkit', '/services', '/about', '/contact', '/track-registration', '/privacy-policy', '/terms'];

async function slugs(col) {
  if (!PROJECT) return null;
  try {
    const r = await fetch(`https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/${col}?pageSize=300`);
    const j = await r.json();
    return (j.documents || []).filter((d) => d.fields?.published?.booleanValue !== false).map((d) => d.fields?.slug?.stringValue || d.name.split('/').pop());
  } catch { return null; }
}

const seedSrc = readFileSync('src/utils/seed.js', 'utf8');
const seedSlugs = (prefix) => [...seedSrc.matchAll(/slug: '([^']+)'/g)].map((m) => m[1]).filter((s) => s.startsWith(prefix));

const hajj = (await slugs('hajjPackages')) || seedSlugs('hajj-');
const umrah = (await slugs('umrahPackages')) || seedSlugs('umrah-');
const today = new Date().toISOString().slice(0, 10);
const urls = [
  ...staticRoutes.map((p) => [p, p === '/' ? '1.0' : '0.8']),
  ...hajj.map((s) => [`/hajj-packages/${s}`, '0.9']),
  ...umrah.map((s) => [`/umrah-packages/${s}`, '0.8']),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([p, pr]) => `  <url><loc>${SITE}${p}</loc><lastmod>${today}</lastmod><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`;
if (!existsSync('dist')) { console.error('Run vite build first.'); process.exit(1); }
writeFileSync('dist/sitemap.xml', xml);
writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync('dist/app.html', readFileSync('dist/index.html'));
console.log(`sitemap.xml: ${urls.length} URLs`);
