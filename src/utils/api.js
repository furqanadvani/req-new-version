import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  collection, doc, getDocs, getDoc, setDoc, addDoc, updateDoc, deleteDoc,
  onSnapshot, serverTimestamp, query, orderBy, writeBatch,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage, firebaseReady } from './firebase';
import { SEED, seedSettings } from './seed';
import { COLLECTIONS, SITE_ID } from './constants';

/* ───────────── Public, cached reads (with seed fallback) ───────────── */

const cache = new Map();          // name -> { items, loading }
const listeners = new Map();      // name -> Set(fn)
const emit = (name) => listeners.get(name)?.forEach((fn) => fn());

const sortItems = (arr) =>
  [...arr].sort((a, b) => (b.year || 0) - (a.year || 0) || (a.order ?? 999) - (b.order ?? 999));

async function load(name) {
  const seed = SEED[name] || [];
  if (!firebaseReady) { cache.set(name, { items: sortItems(seed), loading: false, source: 'seed' }); emit(name); return; }
  try {
    const snap = await getDocs(collection(db, name));
    const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    cache.set(name, { items: sortItems(items.length ? items : seed), loading: false, source: items.length ? 'db' : 'seed' });
  } catch (e) {
    console.warn(`[data] ${name}:`, e.message);
    cache.set(name, { items: sortItems(seed), loading: false, source: 'seed' });
  }
  emit(name);
}

/** Read a public collection. Unpublished docs (published === false) are hidden. */
export function useCollection(name) {
  const subscribe = (fn) => {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(fn);
    return () => listeners.get(name).delete(fn);
  };
  const get = () => cache.get(name);
  const state = useSyncExternalStore(subscribe, get, get);
  useEffect(() => {
    if (!cache.has(name)) { cache.set(name, { items: [], loading: true }); load(name); }
  }, [name]);
  const s = state || { items: [], loading: true };
  return { ...s, items: s.items.filter((i) => i.published !== false) };
}

export function useItem(name, slug) {
  const { items, loading } = useCollection(name);
  return { item: items.find((i) => i.slug === slug || i.id === slug) || null, loading };
}

let settingsCache = null;
const settingsListeners = new Set();
export function useSettings() {
  const [s, setS] = useState(settingsCache || seedSettings);
  useEffect(() => {
    const fn = () => setS(settingsCache);
    settingsListeners.add(fn);
    if (!settingsCache) {
      settingsCache = seedSettings;
      if (firebaseReady) {
        getDoc(doc(db, COLLECTIONS.settings, SITE_ID))
          .then((d) => { if (d.exists()) { const data = d.data(); settingsCache = { ...seedSettings, ...data, theme: { ...seedSettings.theme, ...(data.theme || {}) } }; settingsListeners.forEach((f) => f()); } })
          .catch((e) => console.warn('[settings]', e.message));
      }
    }
    return () => settingsListeners.delete(fn);
  }, []);
  return s;
}

export const invalidate = (name) => { cache.delete(name); if (name === COLLECTIONS.settings) settingsCache = null; };

/** Portal: save settings and push them live to this tab immediately. */
export async function saveSettings(data) {
  requireDb();
  const clean = JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v)));
  await setDoc(doc(db, COLLECTIONS.settings, SITE_ID), { ...clean, updatedAt: serverTimestamp() }, { merge: true });
  settingsCache = { ...seedSettings, ...clean, theme: { ...seedSettings.theme, ...(clean.theme || {}) } };
  settingsListeners.forEach((f) => f());
}

/* ───────────── Public writes (forms) ───────────── */

function requireDb() {
  if (!firebaseReady) throw new Error('Forms are offline: Firebase keys are missing in .env.');
}

export async function submitQuery(data) {
  requireDb();
  return addDoc(collection(db, COLLECTIONS.queries), {
    ...data, status: 'new', source: window.location.pathname, createdAt: serverTimestamp(),
  });
}

export async function subscribe(email) {
  requireDb();
  const id = email.toLowerCase().replace(/[^a-z0-9@._-]/g, '');
  return setDoc(doc(db, COLLECTIONS.subscribers, id), { email: id, createdAt: serverTimestamp() });
}

export async function submitRegistration(ref, data) {
  requireDb();
  const batch = writeBatch(db);
  batch.set(doc(db, COLLECTIONS.registrations, ref), { ...data, ref, status: 'received', createdAt: serverTimestamp() });
  batch.set(doc(db, COLLECTIONS.status, ref), {
    ref, status: 'received', phoneLast4: String(data.phone || '').replace(/\D/g, '').slice(-4),
    package: data.packageTitle || '', pilgrims: data.pilgrims?.length || 1, updatedAt: serverTimestamp(), note: '',
  });
  return batch.commit();
}

export async function trackRegistration(ref) {
  requireDb();
  const d = await getDoc(doc(db, COLLECTIONS.status, ref.trim().toUpperCase()));
  return d.exists() ? d.data() : null;
}

/* ───────────── Admin (live) ───────────── */

export function useLiveCollection(name, order = null) {
  const [state, setState] = useState({ items: [], loading: true, error: null });
  useEffect(() => {
    if (!firebaseReady) { setState({ items: SEED[name] || [], loading: false, error: 'Firebase is not configured.' }); return; }
    const q = order ? query(collection(db, name), orderBy(order, 'desc')) : collection(db, name);
    return onSnapshot(q,
      (snap) => setState({ items: snap.docs.map((d) => ({ id: d.id, ...d.data() })), loading: false, error: null }),
      (e) => setState({ items: [], loading: false, error: e.message }));
  }, [name, order]);
  return state;
}

export function useLiveDoc(name, id) {
  const [state, setState] = useState({ data: null, loading: true });
  useEffect(() => {
    if (!firebaseReady) { setState({ data: null, loading: false }); return; }
    return onSnapshot(doc(db, name, id), (d) => setState({ data: d.exists() ? d.data() : null, loading: false }));
  }, [name, id]);
  return state;
}

export async function saveItem(name, id, data) {
  requireDb();
  const clean = JSON.parse(JSON.stringify(data, (k, v) => (v === undefined ? null : v)));
  delete clean.id;
  clean.updatedAt = serverTimestamp();
  if (id) await setDoc(doc(db, name, id), clean, { merge: true });
  else await addDoc(collection(db, name), { ...clean, createdAt: serverTimestamp() });
  invalidate(name);
}

export const patchItem = async (name, id, data) => { requireDb(); await updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() }); invalidate(name); };
export const removeItem = async (name, id) => { requireDb(); await deleteDoc(doc(db, name, id)); invalidate(name); };

export async function seedDatabase() {
  requireDb();
  const batch = writeBatch(db);
  Object.entries(SEED).forEach(([name, items]) => items.forEach((it) => {
    const { id, ...rest } = it;
    batch.set(doc(db, name, id), { ...rest, createdAt: serverTimestamp() }, { merge: true });
  }));
  batch.set(doc(db, COLLECTIONS.settings, SITE_ID), seedSettings, { merge: true });
  await batch.commit();
  cache.clear(); settingsCache = null;
}

/* ───────────── Uploads ───────────── */

/** Resize images in the browser (max 2000px, WebP) before uploading. Other files upload as-is. */
async function compress(file, max = 2000) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') return file;
  const img = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((r) => c.toBlob(r, 'image/webp', 0.84));
  return blob && blob.size < file.size ? new File([blob], file.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }) : file;
}

export async function uploadFile(file, folder = 'uploads', onProgress) {
  requireDb();
  const f = await compress(file);
  const path = `${folder}/${Date.now()}-${f.name.replace(/[^\w.-]/g, '_')}`;
  const task = uploadBytesResumable(ref(storage, path), f, { contentType: f.type, cacheControl: 'public,max-age=31536000' });
  await new Promise((res, rej) => task.on('state_changed', (s) => onProgress?.(s.bytesTransferred / s.totalBytes), rej, res));
  return getDownloadURL(task.snapshot.ref);
}
