import React from "react";

const CartItem = ({ item, removeFromCart, updateQuantity }) => (
  <div className="cart-item">
    <img src={item.image} alt={item.name} className="cart-item-image" />
    <div className="cart-item-details">
      <h3>{item.name}</h3>
      <p>₹{item.price.toFixed(2)}</p>
    </div>
    <div className="quantity-controls">
      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
        -
      </button>
      <span>{item.quantity}</span>
      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
        +
      </button>
    </div>
    <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
    <button onClick={() => removeFromCart(item.id)} className="remove-item">
      ×
    </button>
  </div>
);

export default CartItem;
