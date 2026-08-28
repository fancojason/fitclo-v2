import assert from "node:assert/strict";
import test from "node:test";

import { onRequestPost } from "./submit.js";
import { onRequest as onCrmRequest } from "./api/crm/[[path]].js";

test("CRM failure never changes a successful inquiry response", async () => {
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  const calls = [];
  const backgroundTasks = [];

  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });

    if (String(url) === "https://api.resend.com/emails") {
      return new Response(JSON.stringify({ id: "email-test-id" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("CRM unavailable", { status: 503 });
  };
  console.error = () => {};

  try {
    const response = await onRequestPost({
      request: {
        json: async () => ({
          name: "Test Buyer",
          email: "buyer@example.com",
          phone: "+1 555 0100",
          company: "Example Activewear",
          country: "United States",
          inquiry_type: "Ready to ship",
          product_type: "Yoga sets",
          quantity: "100 sets",
          colors_sizes: "Black, S-L",
          branding_requirements: "Logo and hang tags",
          message: "Please send current availability.",
          page_url: "https://www.fitcloo.com/inquiry/",
        }),
      },
      env: {
        RESEND_API_KEY: "resend-test-secret",
        CRM_WEBHOOK_URL: "https://crm.example.com/base/path",
        CRM_API_SECRET: "crm-test-secret",
      },
      waitUntil: (task) => backgroundTasks.push(task),
    });

    assert.equal(response.status, 200);
    assert.equal((await response.json()).success, true);
    assert.equal(backgroundTasks.length, 1);

    await Promise.all(backgroundTasks);

    assert.equal(calls.length, 2);
    assert.equal(calls[1].url, "https://crm.example.com/api/crm/leads/website");
    assert.equal(calls[1].options.headers.Authorization, "Bearer crm-test-secret");

    const crmPayload = JSON.parse(calls[1].options.body);
    assert.equal(crmPayload.name, "Test Buyer");
    assert.equal(crmPayload.whatsapp, "+1 555 0100");
    assert.equal(crmPayload.inquiryType, "Ready to ship");
    assert.equal(crmPayload.brandingPackaging, "Logo and hang tags");
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
  }
});

test("CRM inbox requires authorization and supports receive, read and acknowledge", async () => {
  const values = new Map();
  const env = {
    FITCLO_CRM_API_SECRET: "crm-test-secret",
    CRM_INBOX: {
      get: async (key) => values.get(key) ?? null,
      put: async (key, value) => values.set(key, value),
    },
  };
  const authHeaders = {
    Authorization: "Bearer crm-test-secret",
    "Content-Type": "application/json",
  };

  const unauthorized = await onCrmRequest({
    request: new Request("https://www.fitcloo.com/api/crm/inbox"),
    env,
  });
  assert.equal(unauthorized.status, 401);

  const received = await onCrmRequest({
    request: new Request("https://www.fitcloo.com/api/crm/leads/website", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ name: "Test Buyer", email: "buyer@example.com" }),
    }),
    env,
  });
  assert.equal(received.status, 200);
  const receivedBody = await received.json();
  assert.ok(receivedBody.id);

  const inbox = await onCrmRequest({
    request: new Request("https://www.fitcloo.com/api/crm/inbox", {
      headers: authHeaders,
    }),
    env,
  });
  assert.equal(inbox.status, 200);
  assert.equal((await inbox.json()).items.length, 1);

  const acknowledged = await onCrmRequest({
    request: new Request("https://www.fitcloo.com/api/crm/inbox/ack", {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ id: receivedBody.id }),
    }),
    env,
  });
  assert.equal(acknowledged.status, 200);

  const emptyInbox = await onCrmRequest({
    request: new Request("https://www.fitcloo.com/api/crm/inbox", {
      headers: authHeaders,
    }),
    env,
  });
  assert.equal((await emptyInbox.json()).items.length, 0);
});
