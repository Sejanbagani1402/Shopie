import React from "react";
import CartItem from "./CartItem";

const Cart = ({
  cart,
  removeFromCart,
  updateQuantity,
  getTotalAmount,
  setView,
}) => (
  <div className="cart-view">
    <h2>Your Shopping Cart</h2>
    {cart.length === 0 ? (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <p>Your cart is empty</p>
        <button
          onClick={() => setView("products")}
          className="continue-shopping"
        >
          Continue Shopping
        </button>
      </div>
    ) : (
      <>
        <div className="cart-items">
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
            />
          ))}
        </div>
        <div className="cart-summary">
          <div className="total-amount">
            <h3>Total:</h3>
            <h3>₹{getTotalAmount()}</h3>
          </div>
          <div className="cart-actions">
            <button
              onClick={() => setView("products")}
              className="continue-shopping"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => setView("checkout")}
              className="checkout-button"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </>
    )}
  </div>
);

export default Cart;
