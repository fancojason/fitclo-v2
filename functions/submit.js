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
        to: ["sales@fitcloo.com"], // Assuming sales@fitcloo.com based on domain
        subject: `New B2B Inquiry from ${data.name}`,
        html: `
          <h1>New Inquiry Received</h1>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Company:</strong> ${data.company || 'N/A'}</p>
          <p><strong>Category:</strong> ${data.category}</p>
          <p><strong>Est. Annual Order:</strong> ${data.quantity || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || "Failed to send email via Resend");
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
