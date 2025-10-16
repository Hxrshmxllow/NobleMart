import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api";
import "./Product.css";

export default function ProductPage() {
  const { upc } = useParams();
  const [product, setProduct] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState([]);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${upc}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    fetchProduct();
  }, [upc]);

  const handleAddToCart = (product) => {
    setPopup("adding");
    try {
      const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItem = existingCart.find((item) => item.upc === product.upc);
      let updatedCart;
      if (existingItem) {
        updatedCart = existingCart.map((item) =>
          item.upc === product.upc
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedCart = [...existingCart, { ...product, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setPopup("success");
      setTimeout(() => setPopup(null), 1800);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setPopup("error");
      setTimeout(() => setPopup(null), 2000);
    }
  };

  const handleToggleNotes = () => {
    if (!showNotes && notes.length === 0) {
      setNotes([
        { label: "Vanilla Woody", percent: 80 },
        { label: "Amber Citrus", percent: 60 },
        { label: "Fresh Spicy", percent: 40 },
        { label: "Powdery Musk", percent: 20 }
      ]);
    }
    setShowNotes(!showNotes);
  };

  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image">
          <img src={product.image || "/placeholder.png"} alt={product.name} />
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="brand">{product.brand}</p>
          <p className="price">${product.price}</p>
          <p className="description">{product.description}</p>
          <p className="size"><strong>Size:</strong> {product.size || "N/A"}</p>
          <p className="upc"><strong>UPC:</strong> {product.upc}</p>
          <button
            className="add-to-cart"
            onClick={() => handleAddToCart(product)}
            disabled={adding}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>

          {message && <p className="cart-message">{message}</p>}

          {/* AI Scent Notes */}
          <div className="ai-notes">
            <div className="ai-notes-header">
              <h2>AI Scent Notes</h2>
              <button className="toggle-notes-btn" onClick={handleToggleNotes}>
                {showNotes ? "Hide Notes" : "Get Notes"}
              </button>
            </div>

            <div className={`notes-content ${showNotes ? "visible" : ""}`}>
              {notes.map((note, i) => (
                <div className="note-bar" key={i}>
                  <span>{note.label}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${note.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {popup === "adding" && (
          <div className="popup-overlay adding">
            <div className="loader"></div>
            <p>Adding to cart...</p>
          </div>
        )}

        {popup === "success" && (
          <div className="popup-overlay success">
            <div className="checkmark">
              <div className="checkmark-stem"></div>
              <div className="checkmark-kick"></div>
            </div>
            <p>Added to cart!</p>
          </div>
        )}

        {popup === "error" && (
          <div className="popup-overlay error">
            <div className="crossmark">
              <div className="crossmark-line left"></div>
              <div className="crossmark-line right"></div>
            </div>
            <p>Failed to add item.</p>
          </div>
        )}
    </div>
    
  );
}
