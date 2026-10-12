// Usage: npm run hash-key -- 909090
// Prints the SHA-256 hash to paste into .env as VITE_ADMIN_KEY_HASH. Portal URL becomes /admin/909090
import { createHash } from 'node:crypto';
const key = process.argv[2];
if (!key) { console.error('Usage: npm run hash-key -- <your-secret-code>'); process.exit(1); }
console.log(`\nVITE_ADMIN_KEY_HASH=${createHash('sha256').update(key).digest('hex')}\n\nPortal URL: /admin/${key}\n`);
