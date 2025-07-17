import React from "react";

const CancelPage = () => {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <h2>❌ Payment Cancelled</h2>
      <p>You cancelled the payment process. No money was deducted.</p>
      <a href="/">Return to Shop</a>
    </div>
  );
};

export default CancelPage;
