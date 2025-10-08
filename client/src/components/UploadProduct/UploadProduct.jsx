import './UploadProduct.css'
import { useState } from "react";        
import api from "../../api"; 

export default function UploadProduct() {
  const [upc, setUpc] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Uploading...");
    api.post("/admin/products", { upc })
      .then(() => setStatus("✅ Product uploaded successfully!"))
      .catch(() => setStatus("❌ Error uploading product."));
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
        <button type="submit">Upload Product</button>
      </form>
      {status && <p className="upload-status">{status}</p>}
    </div>
  );
}