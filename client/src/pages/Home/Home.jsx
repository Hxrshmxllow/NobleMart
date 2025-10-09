import { useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const cached = localStorage.getItem("productsCache");
        const cacheTTL = 60 * 60 * 1000; 
        const now = Date.now();
        if (cached) {
          const parsed = JSON.parse(cached);
          if (now - parsed.timestamp < cacheTTL) {
            console.log("🟢 Using cached products");
            setProducts(parsed.data);
            return;
          }
        }
        console.log("Fetching products from API...");
        const res = await api.get("/products");
        const products = res.data.items || res.data;
        setProducts(products);
        localStorage.setItem(
          "productsCache",
          JSON.stringify({ data: products, timestamp: now })
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="home">
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
              key={p.upc}
              product={p}
              onClick={() => navigate(`/product/${p.upc}`)}
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
