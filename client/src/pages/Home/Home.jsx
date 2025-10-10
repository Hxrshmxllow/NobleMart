import { useRef, useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const [newProducts, setNewProducts] = useState([]);
  const [mensProducts, setMensProducts] = useState([]);
  const [womensProducts, setWomensProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const setCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };
  const CACHE_TTL = 60 * 60 * 1000; 
  const getCache = (key) => {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    const parsed = JSON.parse(cached);
    if (Date.now() - parsed.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.data;
  };
  useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        const now = Date.now();
        const cachedNew = getCache("newArrivalsCache");
        if (cachedNew) {
          console.log("Using cached new arrivals");
          setNewProducts(cachedNew);
        } else {
          console.log("✨ Fetching new arrivals...");
          const newRes = await api.get("/products/get_new_arrivals");
          const newItems = newRes.data.items || newRes.data;
          setNewProducts(newItems);
          setCache("newArrivalsCache", newItems);
        }
        const cachedMen = getCache("mensCache");
        if (cachedMen) {
          console.log("Using cached men's products");
          setMensProducts(cachedMen);
        } else {
          console.log("Fetching men's products...");
          const menRes = await api.get(`/products/category/${encodeURIComponent("Men's")}`);
          const mens = menRes.data.items || menRes.data;
          setMensProducts(mens);
          setCache("mensCache", mens);
        }
        const cachedWomen = getCache("womensCache");
        if (cachedWomen) {
          console.log("Using cached women's products");
          setWomensProducts(cachedWomen);
        } else {
          console.log("Fetching women's products...");
          const womenRes = await api.get(`/products/category/${encodeURIComponent("Women's")}`);
          const womens = womenRes.data.items || womenRes.data;
          setWomensProducts(womens);
          setCache("womensCache", womens);
        }
      } catch (err) {
        console.error("❌ Failed to fetch homepage products:", err);
      }
    };
    fetchHomepageProducts();
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

      <section id="new-arrivals" className="collection">
        <div className="collection-header">
          <h2>New Arrivals</h2>
          <p>
            Discover the latest additions to our fragrance lineup — fresh scents and
            timeless classics just in.
          </p>
        </div>

        <div className="product-grid">
          {newProducts.length > 0 ? (
            newProducts.map((p, index) => (
              <ProductCard
                key={p.upc}
                product={p}
                onClick={() => navigate(`/product/${p.upc}`)}
                delay={index * 100}
              />
            ))
          ) : (
            <p className="empty-text">No new arrivals available.</p>
          )}
        </div>
      </section>
      <section id="collection-men" className="collection">
        <div className="collection-header">
          <h2>Men’s Fragrance Collection</h2>
          <p>
            Explore our curated selection of bold, sophisticated scents for the modern
            man. Each fragrance is hand-selected for quality and character.
          </p>
        </div>

        <div className="product-grid">
          {mensProducts.length > 0 ? (
            mensProducts.map((p, index) => (
              <ProductCard
                key={p.upc}
                product={p}
                onClick={() => navigate(`/product/${p.upc}`)}
                delay={index * 100}
              />
            ))
          ) : (
            <p className="empty-text">No men’s fragrances found.</p>
          )}
        </div>
      </section>
      <section id="collection-women" className="collection">
        <div className="collection-header">
          <h2>Women’s Fragrance Collection</h2>
          <p>
            Indulge in our signature range of elegant and expressive fragrances designed
            to capture every mood and moment.
          </p>
        </div>
        <div className="product-grid">
          {womensProducts.length > 0 ? (
            womensProducts.map((p, index) => (
              <ProductCard
                key={p.upc}
                product={p}
                onClick={() => navigate(`/product/${p.upc}`)}
                delay={index * 100}
              />
            ))
          ) : (
            <p className="empty-text">No women’s fragrances found.</p>
          )}
        </div>
      </section>

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
