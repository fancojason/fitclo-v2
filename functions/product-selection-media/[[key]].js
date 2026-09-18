export async function onRequestGet(context) {
  if (!context.env.PRODUCT_SELECTION_MEDIA) return new Response('Media storage is not configured.', { status: 503 });
  const parts = Array.isArray(context.params.key) ? context.params.key : [context.params.key];
  const key = parts.filter(Boolean).map(decodeURIComponent).join('/');
  if (!key.startsWith('product-selection/')) return new Response('Not found.', { status: 404 });
  const headers = new Headers();
  let body;
  if (typeof context.env.PRODUCT_SELECTION_MEDIA.getWithMetadata === 'function') {
    const result = await context.env.PRODUCT_SELECTION_MEDIA.getWithMetadata(key, { type: 'arrayBuffer', cacheTtl: 3600 });
    if (!result.value) return new Response('Not found.', { status: 404 });
    body = result.value;
    if (result.metadata?.contentType) headers.set('Content-Type', result.metadata.contentType);
  } else {
    const object = await context.env.PRODUCT_SELECTION_MEDIA.get(key);
    if (!object) return new Response('Not found.', { status: 404 });
    object.writeHttpMetadata(headers);
    headers.set('ETag', object.httpEtag);
    body = object.body;
  }
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(body, { headers });
}
