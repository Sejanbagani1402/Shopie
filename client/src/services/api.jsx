export const createStripeSession = async (cart) => {
  try {
    const response = await fetch("http://localhost:7000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const data = await response.json();
    return {
      sessionId: data.url?.split("session_id=")[1],
      success: !!data.url,
      url: data.url,
    };
  } catch (err) {
    console.error("Stripe session creation error:", err);
    return { success: false };
  }
};
