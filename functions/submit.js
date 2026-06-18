export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    const RESEND_API_KEY = "re_DVMnvrEg_46XmM9TV8LdWT3i1k8W1GP7d";

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FITCLO Website <onboarding@resend.dev>",
        to: ["jason@dgfanco.com"],
        subject: `New B2B Inquiry from ${data.name}`,
        html: `
          <h1>New Inquiry Received</h1>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
          <p><strong>Phone/WhatsApp:</strong> ${data.phone || 'N/A'}</p>
          <p><strong>Product Type:</strong> ${data.product_type || 'N/A'}</p>
          <p><strong>Quantity:</strong> ${data.quantity || 'N/A'}</p>
          <p><strong>Material:</strong> ${data.material || 'N/A'}</p>
          <p><strong>Logo Placement:</strong> ${data.logo_placement || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message || 'No message provided'}</p>
        `,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Resend Error (${res.status}): ${resData.message || JSON.stringify(resData)}` 
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Success" 
    }), {
      headers: { "Content-Type": "application/json" },
    });


    if (!res.ok) {
      const errorData = await res.json();
      const detailedError = errorData.message || JSON.stringify(errorData);
      throw new Error(`Resend Error: ${detailedError}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Thank you for your inquiry! Our team will contact you within 12 hours." 
    }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
