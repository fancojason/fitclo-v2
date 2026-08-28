const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Cache-Control": "no-store",
  "Content-Type": "application/json",
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: corsHeaders,
});

export async function onRequest({ request, env }) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");
  const secret = String(env.FITCLO_CRM_API_SECRET || "").trim();
  const authorization = request.headers.get("authorization") || "";

  if (!secret) {
    console.error("CRM webhook is not configured: missing FITCLO_CRM_API_SECRET.");
    return json({ error: "CRM webhook unavailable" }, 503);
  }

  if (authorization !== `Bearer ${secret}`) {
    return json({ error: "Unauthorized" }, 401);
  }

  if (!env.CRM_INBOX) {
    console.error("CRM webhook is not configured: missing CRM_INBOX KV binding.");
    return json({ error: "CRM inbox unavailable" }, 503);
  }

  const loadInbox = async () => {
    const raw = await env.CRM_INBOX.get("inbox");
    if (!raw) return { items: [] };

    try {
      const parsed = JSON.parse(raw);
      return { items: Array.isArray(parsed.items) ? parsed.items : [] };
    } catch {
      return { items: [] };
    }
  };

  const saveInbox = (database) =>
    env.CRM_INBOX.put("inbox", JSON.stringify(database));

  if (path === "/api/crm/leads/website" && request.method === "POST") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    if (!payload.email && !payload.phone && !payload.whatsapp) {
      return json({ error: "Missing contact details" }, 400);
    }

    const database = await loadInbox();
    const item = {
      id: `${Date.now()}-${crypto.randomUUID()}`,
      receivedAt: new Date().toISOString(),
      payload,
      processed: false,
    };

    database.items.push(item);
    await saveInbox(database);
    console.log("[CRM] Website inquiry stored:", item.id);
    return json({ ok: true, id: item.id });
  }

  if (path === "/api/crm/inbox" && request.method === "GET") {
    const database = await loadInbox();
    return json({ items: database.items.filter((item) => !item.processed) });
  }

  if (path === "/api/crm/inbox/ack" && request.method === "POST") {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    if (!payload.id) return json({ error: "Missing id" }, 400);

    const database = await loadInbox();
    const item = database.items.find((candidate) => candidate.id === payload.id);
    if (!item) return json({ error: "Not found" }, 404);

    item.processed = true;
    item.processedAt = new Date().toISOString();
    await saveInbox(database);
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
}
