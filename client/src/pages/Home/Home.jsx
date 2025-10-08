import { useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Elevate Your Essence</h1>
          <p>
            Discover timeless fragrances for him and her — handpicked from
            luxury brands and boutique collections.
          </p>
          <a href="#collection" className="shop-btn">Shop Now</a>
        </div>
        <img src="/banner.jpg" alt="Fragrance Banner" className="hero-image" />
      </section>

      {/* Modern Collection Section */}
      <section id="collection" className="collection">
        <div className="collection-header">
          <h2>Men’s Fragrance Collection</h2>
          <p>
            Explore our curated selection of bold, sophisticated scents for the
            modern man. Each fragrance is hand-selected for quality and character.
          </p>
        </div>

        <div className="product-grid">
          {products.map((p, index) => (
            <ProductCard
              key={p.id}
              product={p}
              onClick={() => setSelected(p)}
              delay={index * 100}
            />
          ))}
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
