import { useEffect, useState } from "react";
import api from "../../api";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductModal from "../../components/ProductModal/ProductModal";
import "./Shop.css";
import { useNavigate } from "react-router-dom";

export default function Shop() {
  const categories = [
    "All",
    "Men's",
    "Women's",
    "Mini",
    "Gift Sets",
    "Bath & Body",
  ];
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [open, setOpen] = useState(false);

  const handleSelect = (brand) => {
    setSelectedBrand(brand);
    setOpen(false);
  };

  const sampleBrands = [
    "Versace",
    "Dior",
    "Chanel",
    "Gucci",
    "Tom Ford",
    "Armani",
    "YSL",
    "Burberry",
  ];

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

  /*useEffect(() => {
    const fetchFiltered = async () => {
      let endpoint = "/products";
      const params = [];

      if (selectedCategory !== "All") {
        params.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (selectedBrand) {
        params.push(`brand=${encodeURIComponent(selectedBrand)}`);
      }

      if (params.length > 0) {
        endpoint += `?${params.join("&")}`;
      }

      const res = await api.get(endpoint);
      setProducts(res.data.items || res.data);
    };

    fetchFiltered();
  }, [selectedCategory, selectedBrand]);*/

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
          <div className="categories">
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

          <div className="brand-dropdown-wrapper">
            <button
              className="brand-select"
              onClick={() => setOpen(!open)}
            >
              {selectedBrand}
              <span className="arrow">{open ? "▲" : "▼"}</span>
            </button>

            {open && (
              <ul className="brand-menu">
                {sampleBrands.map((brand) => (
                  <li
                    key={brand}
                    className={`brand-option ${
                      brand === selectedBrand ? "active" : ""
                    }`}
                    onClick={() => handleSelect(brand)}
                  >
                    {brand}
                  </li>
                ))}
              </ul>
            )}
          </div>
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

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
