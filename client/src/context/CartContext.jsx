import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      return exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        : [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(cart.filter((item) => item.id !== id));

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart(
      cart.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const getTotalItems = () =>
    cart.reduce((acc, item) => acc + item.quantity, 0);

  const getTotalAmount = () =>
    cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        getTotalItems,
        getTotalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
