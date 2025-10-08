import "./UploadProduct.css";
import { useState } from "react";
import api from "../../api";

export default function UploadProduct() {
  const [upc, setUpc] = useState("");
  const [status, setStatus] = useState("");
  const [productData, setProductData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Fetching product info...");
    try {
      // mock API call (replace with your real one later)
      const mockResponse = {
        name: "Dior Sauvage Eau de Toilette",
        brand: "Dior",
        size: "100ml",
        description:
          "A bold and fresh fragrance with bergamot, pepper, and amberwood notes — a timeless masculine classic.",
        upc,
        price: "149.99",
        image:
          "https://www.dior.com/dw/image/v2/BGXS_PRD/on/demandware.static/-/Sites-master_dior/default/dw3f6987c5/Y0785220/Y0785220_F078524009_E01_GHC.jpg?sw=800",
      };
      await new Promise((r) => setTimeout(r, 800)); 

      setProductData(mockResponse);
      setShowModal(true);
      setStatus("");
    } catch {
      setStatus("❌ Error fetching product info.");
    }
  };

  const handleConfirmUpload = async () => {
    setStatus("Uploading...");
    try {
      //await api.post("/admin/products", productData);
      setStatus("✅ Product uploaded successfully!");
      setShowModal(false);
      setProductData(null);
      setUpc("");
    } catch {
      setStatus("❌ Error uploading product.");
    }
  };

  const handleChange = (field, value) => {
    setProductData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="upload-section fade-in">
      <h2>Upload New Product</h2>

      <form className="upload-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter UPC Code"
          value={upc}
          onChange={(e) => setUpc(e.target.value)}
          required
        />
        <button type="submit">Fetch Product Info</button>
      </form>

      {status && <p className="upload-status">{status}</p>}

      {showModal && productData && (
  <div className="upload-modal">
    <div className="upload-modal-content horizontal">
      {/* LEFT: IMAGE + INFO */}
      <div className="modal-left">
        <img
          src={productData.image}
          alt={productData.name}
          className="modal-image"
        />
        <div className="modal-info">
          <p><strong>UPC:</strong> {productData.upc}</p>
          <p><strong>Size:</strong> {productData.size}</p>
        </div>
      </div>

      {/* RIGHT: EDITABLE FORM */}
      <div className="modal-right">
        <h3>Edit Product Details</h3>
        <div className="modal-form">
          <label>Product Name</label>
          <input
            type="text"
            value={productData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <label>Brand</label>
          <input
            type="text"
            value={productData.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />

          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            value={productData.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <label>Description</label>
          <textarea
            value={productData.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="confirm-btn" onClick={handleConfirmUpload}>
            Confirm Upload
          </button>
          <button className="cancel-btn" onClick={() => setShowModal(false)}>
            Cancel
          </button>
        </div>
      </div>
    </div>
    <div className="upload-modal-overlay" onClick={() => setShowModal(false)} />
  </div>
)}
    </div>
  );
}
