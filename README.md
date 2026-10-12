# Karwan-e-Rafeeq ul Harmain — website + portal

React (Vite) + Firebase. Black & gold theme, dark/light mode, first-visit intro, Swiper sliders,
Lenis smooth scroll, Hajj/Umrah packages by year, registration with tracking, and a management
portal behind a secret route. Everything (content, logo, colours, fonts) is editable from the portal,
so the same code can run another website.

## Folder structure
```
src/
  components/  ui · layout · home · packages · tools · forms · portal   (+ index.js)
  pages/       public pages + portal/                                    (+ index.js, lazy-loaded)
  utils/       firebase, api (data), theme, currency, seo, seed, hooks, helpers
  routing/     index.jsx — all routes, including /admin/:key
scripts/       hash-key, sitemap, prerender
firestore.rules · storage.rules · firebase.json
```

## 1. Setup
```bash
npm install
cp .env.example .env        # fill the Firebase keys
npm run hash-key -- 909090  # paste the printed hash into VITE_ADMIN_KEY_HASH
npm run dev
```
Without Firebase keys the site still runs on the starter content in `src/utils/seed.js` (read-only).

## 2. Firebase (one time)
1. Create a project → add a **Web app** → copy the config into `.env`.
2. Enable **Firestore**, **Storage**, and **Authentication → Email/Password**.
3. Authentication → Users → **Add user** (your admin email + password).
4. Firestore → create collection **`admins`** → document ID = that user's **UID** (any field, e.g. `name: "Owner"`).
5. Deploy rules: `npm i -g firebase-tools && firebase login && firebase use --add && firebase deploy --only firestore:rules,storage`
6. Open `/admin/909090`, sign in → Dashboard → **Load starter content**.
   Then check every price, date and hotel (they were read from the old flyers).

## 3. The portal — `/admin/<your-code>`
- A wrong code shows the normal 404 page. Only the SHA-256 hash is in the code, never the code itself.
- Behind it: Firebase sign-in + `admins` check. Firestore/Storage rules enforce the same on the server.
- Change the code any time: run `hash-key` again, update `.env`, rebuild.

| Section | What you can do |
|---|---|
| Hajj packages | Add/edit by year, publish/hide, "→ next year" copies a package as a draft |
| Umrah packages | Same, by season |
| Queries | All website inquiries, status, notes, WhatsApp/call, CSV export |
| Registrations | Hajj registrations, passport scans, status + note shown on the tracking page, CSV |
| Services, FAQs, Testimonials, Team, Gallery | Full content control |
| Settings & branding | Business details, **logo, favicon, all colours (both modes), fonts, corner radius**, hero slides, countdown date, promo video, popup, About, legal pages, SEO, exchange rates |

## 4. Using this as a template for another website
Create a new Firebase project for the new business, put its keys in that site's `.env`, deploy,
then change logo, colours, fonts and content in **Settings & branding**. No code changes needed.
(`VITE_SITE_ID` lets several brands share one project's settings if you ever need that.)

## 5. Build & deploy (Firebase Hosting)
```bash
npm run build          # app + sitemap.xml + robots.txt
firebase deploy --only hosting
```
For the best SEO, pre-render pages so Google and WhatsApp/Facebook previews see full HTML:
```bash
npm i -D puppeteer
npm run build:seo
```
After deploying: add the site to **Google Search Console**, submit `/sitemap.xml`, and keep the
**Google Business Profile** (Bahadurabad office) updated with the same phone, hours and website.

## SEO built in
Per-page titles/descriptions, canonical URLs, Open Graph, JSON-LD (TravelAgency, TouristTrip offers,
FAQPage, BreadcrumbList, ItemList), sitemap, a dedicated overseas-Pakistanis landing page, prices
in the visitor's currency, old URLs (`/hajj`, `/service`, `/contactUs`, `/features`) kept working.

## Replace before launch
- Hero images: `public/images/hero-*.jpg` are frames from the promo video (low resolution).
  Upload wide 2400px+ photos in Settings → Home & popup.
- Logo: the built-in mark is traced from the video. Upload the official SVG in Settings → Branding.
- Verify: founding year, licence line, Arafah date, all prices, overseas wording.
