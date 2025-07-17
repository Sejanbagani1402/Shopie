import React from "react";

const Checkout = ({
  getTotalAmount,
  handleCheckout,
  setView,
  isProcessing,
}) => (
  <div className="checkout-view">
    <div className="checkout-progress">
      <div className="progress-step active">Cart</div>
      <div className="progress-step active">Information</div>
      <div className="progress-step active">Payment</div>
      <div className="progress-step">Confirmation</div>
    </div>

    <div className="checkout-container">
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-items">
          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹{getTotalAmount()}</span>
          </div>
          <div className="summary-item">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="summary-item">
            <span>Tax</span>
            <span>₹0.00</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>₹{getTotalAmount()}</span>
          </div>
        </div>
      </div>

      <div className="payment-container">
        <h2>Secure Payment</h2>
        <p className="payment-notice">
          Your payment is securely processed by Stripe. We do not store your
          payment details.
        </p>

        <div className="stripe-checkout">
          <div className="stripe-logo">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 28 28"
              width="28"
              height="28"
            >
              <path
                fill="#6772e5"
                d="M10.1 13.7c0-3.3 2.8-5.6 6.8-5.6 2.9 0 4.9 1.3 5.4 3.2h-3.3c-.4-.7-1.4-1.2-2.4-1.2-2.1 0-3.5 1.4-3.5 3.5 0 2.1 1.4 3.5 3.5 3.5 1.1 0 2.1-.5 2.5-1.3h3.3c-.6 2-2.6 3.3-5.8 3.3-4.1 0-6.9-2.4-6.9-5.8z"
              />
            </svg>
            <span>Stripe Checkout</span>
          </div>
          <p className="stripe-description">
            You'll be redirected to Stripe's secure payment page to complete
            your purchase.
          </p>
        </div>

        <button
          onClick={handleCheckout}
          className="pay-now"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="spinner"></div>
          ) : (
            `Pay ₹${getTotalAmount()}`
          )}
        </button>

        <button onClick={() => setView("cart")} className="back-to-cart">
          ← Back to Cart
        </button>
      </div>
    </div>
  </div>
);

export default Checkout;
