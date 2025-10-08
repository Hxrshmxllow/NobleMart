import { useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import "./Shop.css";

export default function Shop() {
  const categories = [
    "All",
    "Men's",
    "Women's",
    "Unisex",
    "Gifts",
    "Luxury",
    "Discovery Sets",
  ];

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (p) =>
            p.category?.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (
    <div className="shop-page">
      <section className="shop-filters fade-in">
        <h1 className="shop-title">Shop Fragrances</h1>
        <div className="filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${
                selectedCategory === cat ? "active" : ""
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="shop-grid fade-in">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, index) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => setSelectedProduct(p)}
              delay={index * 100}
            />
          ))
        ) : (
          <p className="no-results">No products found in this category.</p>
        )}
      </section>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
