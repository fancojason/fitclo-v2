export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const RESEND_API_KEY = "re_DVMnvrEg_46XmM9TV8LdWT3i1k8W1GP7d";
    const data = await request.json();

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
        subject: `New Inquiry from ${data.name}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #C9A84C;">New Website Inquiry</h2>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email || "Not provided"}</p>
            <p><strong>Company:</strong> ${data.company || "N/A"}</p>
            <p><strong>Phone/WhatsApp:</strong> ${data.phone || "N/A"}</p>
            <p><strong>Product Type:</strong> ${data.product_type}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Material:</strong> ${data.material || "N/A"}</p>
            <p><strong>Logo Placement:</strong> ${data.logo_placement || "N/A"}</p>
            <p><strong>Message:</strong> ${data.message || "No message"}</p>
            ${data.product_name ? `<p><strong>Product Name:</strong> ${data.product_name}</p>` : ""}
            ${data.product_code ? `<p><strong>Product Code:</strong> ${data.product_code}</p>` : ""}
            ${data.country ? `<p><strong>Country / Region:</strong> ${data.country}</p>` : ""}
            ${data.inquiry_type ? `<p><strong>Inquiry Type:</strong> ${data.inquiry_type}</p>` : ""}
            ${data.colors_sizes ? `<p><strong>Colors & Sizes:</strong> ${data.colors_sizes}</p>` : ""}
            ${data.branding_requirements ? `<p><strong>Branding Requirements:</strong> ${data.branding_requirements}</p>` : ""}
            ${data.page_url ? `<p><strong>Page URL:</strong> ${data.page_url}</p>` : ""}
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #888;">This inquiry was sent from the contact form on fitcloo.com.</p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Resend API Error:', errorData);
      return new Response(JSON.stringify({ error: errorData.message || "Failed to send email" }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await res.json();
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
