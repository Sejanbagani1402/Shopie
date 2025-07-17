/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { CartProvider, useCart } from "./context/CartContext";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import { createStripeSession } from "./services/API";

const mockProducts = [
  {
    id: 1,
    title: "Wireless Headphones",
    price: 99.99,
    description: "Premium noise-cancelling headphones",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 199.99,
    description: "Track your fitness and notifications",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400",
    category: "Electronics",
    rating: 4.8,
  },
  {
    id: 3,
    title: "Bluetooth Speaker",
    price: 79.99,
    description: "Portable speaker with rich sound",
    image:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400",
    category: "Electronics",
    rating: 4.3,
  },
  {
    id: 4,
    title: "Gaming Keyboard",
    price: 89.99,
    description: "Mechanical RGB gaming keyboard",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=400",
    category: "Electronics",
    rating: 4.6,
  },
  {
    id: 5,
    title: "Wireless Mouse",
    price: 49.99,
    description: "Ergonomic wireless mouse",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400",
    category: "Electronics",
    rating: 4.2,
  },
  {
    id: 6,
    title: "Laptop Stand",
    price: 39.99,
    description: "Adjustable laptop stand",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=400",
    category: "Accessories",
    rating: 4.4,
  },
];

function AppWrapper() {
  return (
    <CartProvider>
      <Router>
        <App />
      </Router>
    </CartProvider>
  );
}

function App() {
  const [view, setView] = useState("products");
  const [products] = useState(mockProducts);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("default");
  const [isProcessing, setIsProcessing] = useState(false);

  const { cart, getTotalAmount } = useCart();

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const session = await createStripeSession(cart);
      if (session.success) {
        window.location.href = session.url;
      } else {
        throw new Error("Stripe session creation failed");
      }
    } catch (err) {
      alert("Checkout failed. Please try again.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="app">
            <Header view={view} setView={setView} />
            <main className="main-content">
              {view === "products" && (
                <ProductList
                  products={products}
                  filter={filter}
                  setFilter={setFilter}
                  sort={sort}
                  setSort={setSort}
                  addToCart={useCart().addToCart}
                />
              )}
              {view === "cart" && (
                <Cart
                  cart={cart}
                  removeFromCart={useCart().removeFromCart}
                  updateQuantity={useCart().updateQuantity}
                  getTotalAmount={getTotalAmount}
                  setView={setView}
                />
              )}
              {view === "checkout" && (
                <Checkout
                  getTotalAmount={getTotalAmount}
                  handleCheckout={handleCheckout}
                  setView={setView}
                  isProcessing={isProcessing}
                />
              )}
            </main>
            <footer className="footer">
              <p>
                © 2025 QuickShop - Built with React.js and Node.js by Sejan Khan
                as an assignment project.
              </p>
              <div className="footer-links">
                <a href="#">About Us</a>
                <a href="#">Contact</a>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </footer>
          </div>
        }
      />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/canceled=true" element={<CancelPage />} />
    </Routes>
  );
}

export default AppWrapper;
