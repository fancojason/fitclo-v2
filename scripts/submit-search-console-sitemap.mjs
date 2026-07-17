import { createSign } from 'node:crypto';

const serviceAccountJson = process.env.GSC_SERVICE_ACCOUNT_JSON;
const siteUrl = process.env.GSC_SITE_URL ?? 'https://www.fitcloo.com/';
const sitemapUrl = process.env.GSC_SITEMAP_URL ?? `${siteUrl}sitemap-index.xml`;

if (!serviceAccountJson) {
  console.log('GSC_SERVICE_ACCOUNT_JSON is not configured; sitemap submission skipped.');
  process.exit(0);
}

let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountJson);
} catch {
  throw new Error('GSC_SERVICE_ACCOUNT_JSON must contain valid service-account JSON.');
}

if (!serviceAccount.client_email || !serviceAccount.private_key) {
  throw new Error('The service-account JSON is missing client_email or private_key.');
}

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');
const now = Math.floor(Date.now() / 1000);
const unsignedToken = `${encode({ alg: 'RS256', typ: 'JWT' })}.${encode({
  iss: serviceAccount.client_email,
  scope: 'https://www.googleapis.com/auth/webmasters',
  aud: 'https://oauth2.googleapis.com/token',
  iat: now,
  exp: now + 3600,
})}`;

const signer = createSign('RSA-SHA256');
signer.update(unsignedToken);
signer.end();
const assertion = `${unsignedToken}.${signer.sign(serviceAccount.private_key, 'base64url')}`;

const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  headers: { 'content-type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion,
  }),
});

if (!tokenResponse.ok) {
  throw new Error(`Google OAuth failed: ${tokenResponse.status} ${await tokenResponse.text()}`);
}

const { access_token: accessToken } = await tokenResponse.json();
const sitemapResponse = await fetch(sitemapUrl, { redirect: 'follow' });

if (!sitemapResponse.ok) {
  throw new Error(`Live sitemap is unavailable: ${sitemapResponse.status} ${sitemapUrl}`);
}

const submitEndpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
const submitResponse = await fetch(submitEndpoint, {
  method: 'PUT',
  headers: { authorization: `Bearer ${accessToken}` },
});

if (!submitResponse.ok) {
  throw new Error(`Search Console sitemap submission failed: ${submitResponse.status} ${await submitResponse.text()}`);
}

console.log(`Submitted ${sitemapUrl} for ${siteUrl}.`);
