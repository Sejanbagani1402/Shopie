import React from "react";

const ProductItem = ({ product, addToCart }) => (
  <div className="product-card">
    <div className="product-image-container">
      <img src={product.image} alt={product.title} className="product-image" />
      <div className="product-badge">{product.category}</div>
    </div>
    <div className="product-info">
      <div className="product-header">
        <h3 className="product-title">{product.title}</h3>
        <div className="product-rating">
          <span className="stars">
            {"★".repeat(Math.floor(product.rating))}
          </span>
          <span className="rating-value">{product.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="product-description">{product.description}</p>
      <div className="product-footer">
        <div className="price">₹{product.price.toFixed(2)}</div>
        <button onClick={() => addToCart(product)} className="add-to-cart">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
);

export default ProductItem;
