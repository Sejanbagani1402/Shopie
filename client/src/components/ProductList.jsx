import React from "react";
import ProductItem from "./ProductItem";

const ProductList = ({
  products,
  addToCart,
  filter,
  setFilter,
  sort,
  setSort,
}) => {
  const filtered =
    filter === "all" ? products : products.filter((p) => p.category === filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="product-grid-container">
      <div className="product-grid-controls">
        <div className="filter-controls">
          <label>Filter by Category:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
          </select>
        </div>
        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>
      <div className="product-grid">
        {sorted.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
