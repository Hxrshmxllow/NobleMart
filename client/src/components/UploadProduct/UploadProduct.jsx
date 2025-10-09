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
      const res = await api.post("/admin/fetch-product", { upc });

      if (res.status === 200) {
        setProductData(res.data);
        setShowModal(true);
        setStatus("");
      } else {
        setStatus("Product not found.");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setStatus("Error fetching product info.");
    }
  };

  const handleConfirmUpload = async () => {
    if (!productData?.price || !productData?.size) {
      setStatus("Please enter both price and size before uploading.");
      return;
    }

    setStatus("Uploading...");

    try {
      const uploadData = { ...productData, upc };

      await api.post("/admin/upload-product", uploadData);

      setStatus("Product uploaded successfully!");
      setShowModal(false);
      setProductData(null);
      setUpc("");
    } catch (error) {
      console.error("Error uploading product:", error);
      setStatus("Error uploading product.");
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
      <div className="modal-left">
        <img
          src={productData.image}
          alt={productData.name}
          className="modal-image"
        />
        <div className="modal-info">
          <p><strong>UPC:</strong> {upc}</p>

          <div className="floating-label-input">
            <input
              type="text"
              id="size"
              value={productData.size || ""}
              onChange={(e) => handleChange("size", e.target.value)}
              placeholder=" " 
            />
            <label htmlFor="size">Size</label>
          </div>
        </div>
      </div>
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
            value={productData.price || ""}
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
      {status && <p className="upload-status">{status}</p>}
    </div>
    <div className="upload-modal-overlay" onClick={() => setShowModal(false)} />
  </div>
)}
    </div>
  );
}
