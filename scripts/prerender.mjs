// Optional SEO step: opens every URL from the sitemap in headless Chrome and saves the rendered HTML,
// so Google, WhatsApp and Facebook previews see full content and correct meta tags without running JS.
// Needs: npm i -D puppeteer   — then: npm run build:seo
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join } from 'node:path';

let puppeteer;
try { puppeteer = (await import('puppeteer')).default; } catch { console.log('Skipping prerender: run "npm i -D puppeteer" to enable.'); process.exit(0); }

const DIST = 'dist';
const shell = readFileSync(join(DIST, 'index.html'), 'utf8');
const types = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain' };
const server = createServer((req, res) => {
  const path = decodeURIComponent(req.url.split('?')[0]);
  try { const f = readFileSync(join(DIST, path)); res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' }); return res.end(f); }
  catch { res.writeHead(200, { 'Content-Type': 'text/html' }); res.end(shell); }
}).listen(4789);

writeFileSync(join(DIST, 'app.html'), shell); // untouched SPA shell for non-prerendered routes
const urls = [...readFileSync(join(DIST, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setUserAgent('Mozilla/5.0 Prerender HeadlessChrome');
for (const u of urls) {
  await page.goto(`http://localhost:4789${u}`, { waitUntil: 'networkidle0', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 600));
  const html = '<!doctype html>' + (await page.evaluate(() => document.documentElement.outerHTML));
  const dir = join(DIST, u === '/' ? '' : u);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), html);
  console.log('prerendered', u);
}
await browser.close(); server.close();
