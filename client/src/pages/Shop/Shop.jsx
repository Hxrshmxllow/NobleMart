import { useRef, useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import "./Shop.css";
import { useNavigate } from "react-router-dom";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function Shop() {
  const MAX_LRU_SIZE = 5;
  const categoryCacheRef = useRef(new Map());

  const getFromLRU = (key) => {
    const cache = categoryCacheRef.current;
    if (!cache.has(key)) return null;
    const value = cache.get(key);
    cache.delete(key);
    cache.set(key, value);
    return value;
  };

  const setToLRU = (key, data) => {
    const cache = categoryCacheRef.current;
    if (cache.has(key)) cache.delete(key);
    else if (cache.size >= MAX_LRU_SIZE) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    cache.set(key, data);
  };
  
  const categories = [
    "All",
    "Men's",
    "Women's",
    "Mini",
    "Gift Sets",
    "Bath & Body",
    "Brand",
  ];

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(true);

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

  const setCache = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  };

  const handleSelect = async (brand) => {
    if (selectedBrand === brand) return;

    setSelectedBrand(brand);
    setSelectedCategory("Brand");

    const cacheKey = `brandCache_${brand}`;
    const cached = getCache(cacheKey);
    if (cached) {
      setProducts(cached);
      console.log(`Loaded ${brand} products from cache`);
      return;
    }

    try {
      console.log(`Fetching ${brand} products from API...`);
      const res = await api.get(`/products/brands/${brand}`);
      const data = res.data.items || res.data;
      setCache(cacheKey, data);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch brand products:", error);
      const fallback = getCache("currBrandCache");
      if (fallback) setProducts(fallback);
    }
  };

  const handleCategorySelect = async (category) => {
  setSelectedCategory(category);
  setSelectedBrand("All Brands");
  if (category === "All") {
    const cached = getCache("productsCache");
    if (cached) {
      setProducts(cached);
      return;
    }
    const res = await api.get("/products");
    const data = res.data.items || res.data;
    setCache("productsCache", data);
    setProducts(data);
    return;
  }

  const cached = getFromLRU(category);
  if (cached) {
    console.log(`Loaded ${category} products from LRU cache`);
    setProducts(cached);
    return;
  }
  try {
    console.log(`Fetching ${category} products from API...`);
    const res = await api.get(
      `/products/category/${encodeURIComponent(category)}`
    );
    const data = res.data.items || res.data;
    setProducts(data);
    setToLRU(category, data);
  } catch (error) {
    console.error("Failed to fetch category products:", error);
    setProducts([]);
  }
};

  useEffect(() => {
    const cached = getCache("productsCache");
    if (cached) {
      setProducts(cached);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data.items || res.data;
        setCache("productsCache", data);
        setProducts(data);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const cached = getCache("brandsCache");
    if (cached) {
      setBrands(cached);
      setLoadingBrands(false);
      return;
    }

    const fetchBrands = async () => {
      try {
        const res = await api.get("/products/get_brands");
        setBrands(res.data);
        setCache("brandsCache", res.data);
      } catch (err) {
        console.error("Failed to fetch brands:", err);
      } finally {
        setLoadingBrands(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest(".brand-dropdown-menu") &&
        !e.target.closest(".filter-btn")
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const filteredProducts =
    selectedCategory === "All" || selectedCategory === "Brand"
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
              className={`filter-btn ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                if (cat === "Brand") {
                  setOpen(!open);
                  handleCategorySelect(cat)
                } else {
                  handleCategorySelect(cat);
                  setOpen(false);
                }
              }}
            >
              {cat === "Brand" && selectedBrand !== "All Brands"
                ? selectedBrand
                : cat}

              {cat === "Brand" && (
                <span className="brand-arrow">
                  {open ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              )}
            </button>
          ))}

          {selectedCategory === "Brand" && open && (
            <div className="brand-dropdown-menu">
              {brands.map((brand) => (
                <div
                  key={brand}
                  className={`brand-option ${
                    brand === selectedBrand ? "active" : ""
                  }`}
                  onClick={() => {
                    handleSelect(brand);
                    setOpen(false);
                  }}
                >
                  {brand}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="shop-grid fade-in">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p, index) => (
            <ProductCard
              key={p.upc}
              product={p}
              onClick={() => navigate(`/product/${p.upc}`)}
              delay={index * 100}
            />
          ))
        ) : (
          <p className="no-results">No products found in this category.</p>
        )}
      </section>
    </div>
  );
}
