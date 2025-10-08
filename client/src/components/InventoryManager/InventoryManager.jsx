import { useEffect, useState } from "react";
import api from "../../api";
import "./InventoryManager.css";

export default function InventoryManager() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showLowStock, setShowLowStock] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get("/admin/inventory").then((res) => setProducts(res.data));
  }, []);

  const handleUpdate = (id, field, value) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = (id) => {
    const product = products.find((p) => p.id === id);
    api
      .patch(`/admin/inventory/${id}`, {
        stock: product.stock,
        price: product.price,
      })
      .then(() => setStatus("✅ Inventory updated successfully"))
      .catch(() => setStatus("❌ Error updating inventory"));
  };

  // Filter logic
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.brand?.toLowerCase().includes(search.toLowerCase());
    const matchesLowStock = !showLowStock || p.stock < 5;
    return matchesSearch && matchesLowStock;
  });

  return (
    <div className="inventory-section fade-in">
      <h2>Inventory Management</h2>

      {/* Filter Bar */}
      <div className="inventory-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <label className="low-stock-checkbox">
          <input
            type="checkbox"
            checked={showLowStock}
            onChange={(e) => setShowLowStock(e.target.checked)}
          />
          Show low-stock only
        </label>
      </div>

      {/* Inventory Table */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <tr key={p.id} className={p.stock < 5 ? "low-stock-row" : ""}>
                <td>
                  <div className="product-info">
                    <img src={p.image || "/placeholder.jpg"} alt={p.name} />
                    <div>
                      <span className="product-name">{p.name}</span>
                      <span className="product-brand">{p.brand}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    value={p.stock}
                    onChange={(e) => handleUpdate(p.id, "stock", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    value={p.price}
                    onChange={(e) => handleUpdate(p.id, "price", e.target.value)}
                  />
                </td>
                <td>
                  <button onClick={() => handleSave(p.id)}>Save</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="no-results">
                No matching products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {status && <p className="inventory-status">{status}</p>}
    </div>
  );
}