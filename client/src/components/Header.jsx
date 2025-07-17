import React from "react";
import { useCart } from "../context/CartContext";

const Header = ({ view, setView }) => {
  const { getTotalItems } = useCart();

  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo">🛒</div>
        <h1>QuickShop</h1>
      </div>
      <nav>
        <button
          onClick={() => setView("products")}
          className={view === "products" ? "active" : ""}
        >
          Products
        </button>
        <button
          onClick={() => setView("cart")}
          className={view === "cart" ? "active" : ""}
        >
          Cart ({getTotalItems()})
        </button>
      </nav>
    </header>
  );
};

export default Header;
