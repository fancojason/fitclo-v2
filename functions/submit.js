export async function onRequestPost(context) {
  try {
    const data = await context.request.json();
    
    // Here you would typically send an email using Resend, SendGrid, etc.
    // For now, we'll just log it and return a success response.
    console.log("New Inquiry Received:", data);

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
