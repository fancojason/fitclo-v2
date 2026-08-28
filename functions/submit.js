const escapeHtml = (value) => String(value ?? "")
  .slice(0, 5000)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const detailRow = (label, value, fallback = "Not provided") =>
  `<p><strong>${label}:</strong> ${escapeHtml(value || fallback)}</p>`;

const syncCrmLead = async (data, env) => {
  const webhookUrl = String(env.CRM_WEBHOOK_URL || "").trim();
  const apiSecret = String(env.CRM_API_SECRET || "").trim();

  if (!webhookUrl || !apiSecret) {
    console.warn("CRM sync skipped: missing CRM_WEBHOOK_URL or CRM_API_SECRET.");
    return;
  }

  try {
    const endpoint = new URL("/api/crm/leads/website", webhookUrl);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiSecret}`,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        whatsapp: data.whatsapp || data.phone,
        country: data.country,
        inquiryType: data.inquiry_type,
        productType: data.product_type,
        quantity: data.quantity,
        colorsSizes: data.colors_sizes,
        targetLaunch: data.target_launch,
        brandingPackaging: data.branding_requirements,
        referenceLink: data.reference_link,
        material: data.material,
        logoPlacement: data.logo_placement,
        message: data.message,
        submittedAt: new Date().toISOString(),
        pageUrl: data.page_url || "https://www.fitcloo.com/inquiry/",
      }),
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      const responseText = await response.text().catch(() => "");
      console.error(
        "CRM sync failed and was ignored:",
        response.status,
        responseText.slice(0, 500),
      );
    }
  } catch (error) {
    console.error("CRM sync failed and was ignored:", error);
  }
};

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const RESEND_API_KEY = env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
      console.error("Inquiry email is not configured: missing RESEND_API_KEY.");
      return new Response(JSON.stringify({
        error: "The inquiry service is temporarily unavailable. Please contact us on WhatsApp.",
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await request.json();

    // Quietly accept bot submissions caught by the hidden website field.
    if (data.website) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic validation
    if (!data.name || (!data.email && !data.phone) || !data.product_type) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Fitclo Website <inquiry@fitcloo.com>",
        to: ["jason@dgfanco.com"],
        subject: `New ${escapeHtml(data.inquiry_type || "Website")} Inquiry from ${escapeHtml(data.name)}`,
        reply_to: data.email || undefined,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #C9A84C;">New Website Inquiry</h2>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            ${detailRow("Name", data.name)}
            ${detailRow("Email", data.email)}
            ${detailRow("Company", data.company)}
            ${detailRow("Phone / WhatsApp", data.phone)}
            ${detailRow("Country / Region", data.country)}
            ${detailRow("Inquiry Type", data.inquiry_type)}
            ${detailRow("Product Type", data.product_type)}
            ${detailRow("Quantity", data.quantity)}
            ${detailRow("Colors & Sizes", data.colors_sizes)}
            ${detailRow("Target Launch", data.target_launch)}
            ${detailRow("Branding & Packaging", data.branding_requirements)}
            ${detailRow("Reference / Tech Pack Link", data.reference_link)}
            ${detailRow("Material", data.material)}
            ${detailRow("Logo Placement", data.logo_placement)}
            ${detailRow("Message", data.message, "No message")}
            ${data.product_name ? detailRow("Product Name", data.product_name) : ""}
            ${data.product_code ? detailRow("Product Code", data.product_code) : ""}
            ${data.page_url ? detailRow("Page URL", data.page_url) : ""}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">This inquiry was sent from the contact form on fitcloo.com.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Resend API Error:", res.status, errorData);
      return new Response(JSON.stringify({
        error: "We couldn't send your request right now. Please try again or contact us on WhatsApp.",
      }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await res.json();
    const crmTask = syncCrmLead(data, env);

    try {
      context.waitUntil?.(crmTask);
    } catch (error) {
      console.error("Unable to register CRM background sync; failure was ignored:", error);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully",
      id: result.id 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error('Submit Function Error:', err);
    return new Response(JSON.stringify({ error: err.message || "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
