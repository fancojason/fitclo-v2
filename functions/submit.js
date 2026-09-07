const escapeHtml = (value) => String(value ?? "")
  .slice(0, 5000)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const detailRow = (label, value, fallback = "Not provided") =>
  `<p><strong>${label}:</strong> ${escapeHtml(value || fallback)}</p>`;

const attributionFields = ['landing_page', 'referrer', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const invalid = (error, status = 400) => new Response(JSON.stringify({ error }), {
  status, headers: { 'Content-Type': 'application/json' },
});

function validateAttachment(file) {
  if (!file || typeof file !== 'object' || typeof file.filename !== 'string' ||
      file.filename.length > 180 || /[\\/\x00-\x1f\x7f]/.test(file.filename) ||
      !/\.(png|ai|pdf)$/i.test(file.filename) || typeof file.content !== 'string') {
    throw new Error('Choose a PNG, AI or PDF file up to 10 MB.');
  }
  if (!file.content.length || file.content.length > 4 * Math.ceil(10 * 1024 * 1024 / 3) ||
      file.content.length % 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(file.content)) {
    throw new Error('Invalid attachment or file exceeds 10 MB.');
  }
  const decodedLength = file.content.length * 3 / 4 - (file.content.endsWith('==') ? 2 : file.content.endsWith('=') ? 1 : 0);
  const decoded = atob(file.content.slice(0, 32));
  if (decodedLength > 10 * 1024 * 1024) throw new Error('File exceeds 10 MB.');
  const ext = file.filename.split('.').pop().toLowerCase();
  const valid = ext === 'png' ? decoded.startsWith('\x89PNG\r\n\x1a\n') :
    ext === 'pdf' ? decoded.startsWith('%PDF-') : decoded.startsWith('%PDF-') || decoded.startsWith('%!PS-Adobe-');
  if (!valid) throw new Error('The attachment content does not match PNG, AI or PDF format.');
  return { filename: file.filename, content: file.content };
}

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
        language: data.language || "en",
        pagePath: data.page_path,
        submittedAt: new Date().toISOString(),
        pageUrl: data.page_url || "https://www.fitcloo.com/inquiry/",
        productCode: data.product_code,
        productName: data.product_name,
        attribution: Object.fromEntries(attributionFields.map(key => [key, data[key] || ''])),
        attachmentFilename: data.attachment?.filename,
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

    if (Number(request.headers?.get('content-length')) > 15 * 1024 * 1024) return invalid('Request too large', 413);
    let data;
    try { data = await request.json(); } catch { return invalid('Invalid JSON'); }
    if (!data || typeof data !== 'object' || Array.isArray(data)) return invalid('Invalid inquiry');
    if (Object.entries(data).some(([key, value]) => key !== 'attachment' && (typeof value !== 'string' || value.length > 5000))) return invalid('Invalid field or field too long');

    // Quietly accept bot submissions caught by the hidden website field.
    if (data.website) {
      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Basic validation
    if (!data.name?.trim() || (!data.email?.trim() && !data.phone?.trim()) || !data.product_type?.trim()) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let attachment;
    if (data.attachment !== undefined) {
      try { attachment = validateAttachment(data.attachment); } catch (error) { return invalid(error.message); }
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Fitclo Website <inquiry@fitcloo.com>",
        to: ["sales@fitcloo.com"],
        subject: `New ${escapeHtml(data.inquiry_type || "Website")} Inquiry from ${escapeHtml(data.name)}`,
        reply_to: data.email || undefined,
        ...(attachment ? { attachments: [attachment] } : {}),
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
            ${detailRow("Language", data.language || "en")}
            ${data.page_path ? detailRow("Page Path", data.page_path) : ""}
            ${attributionFields.filter(key => data[key]).map(key => detailRow(key, data[key])).join('')}
            ${attachment ? detailRow('Attachment', attachment.filename) : ''}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">This inquiry was sent from the contact form on fitcloo.com.</p>
          </div>
        `,
      }),
      signal: AbortSignal.timeout(20000),
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
    if (!result.id) return invalid('The email provider did not confirm acceptance. Please try again.', 502);
    console.log(JSON.stringify({ event: 'inquiry_accepted', id: result.id, language: data.language || 'en', page_path: typeof data.page_path === 'string' ? data.page_path.split('?')[0].slice(0,300) : '', has_attachment: Boolean(attachment) }));
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
