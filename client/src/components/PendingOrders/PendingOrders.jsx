import React, { useEffect, useState } from "react";
import api from "../../api";
import './PendingOrders.css'

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState({});
  useEffect(() => {
    const token = localStorage.getItem("idToken");
    api
      .get("/admin/orders?status=pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data.orders || []))
      .finally(() => setLoading(false));
  }, []);

   const handleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleStatusChange = async (accountNumber, orderNumber, status) => {
    setSelectedStatus((prev) => ({ ...prev, [orderNumber]: status }));

    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        alert("Please sign in first!");
        return;
      }
      const res = await fetch("http://127.0.0.1:5001/api/admin/orders/update-status", {
        method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            accountNumber: accountNumber,
            orderNumber: orderNumber,
            status: status,
          }),
      });

      if (res.error) {
        console.error("Failed to update status:", res.error);
        alert(res.error);
      } else {
        console.log(`Order ${orderNumber} status updated to ${status}`);
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  }; 

  const formatDate = (iso) => {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  return (
    <div className="orders-section fade-in">
      <h2 className="orders-title">Pending Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No pending orders found.</p>
      ) : (
        <ul className="orders-list">
          {orders.map((o) => (
            <li key={o.orderNumber} className="order-card">
              <div
                className="order-summary"
                onClick={() => handleExpand(o.orderNumber)}
              >
                <div className="order-info">
                  <p className="order-id">#{o.orderNumber}</p>
                  <p className="order-customer">{o.accountNumber}</p>
                  <p className="order-date">{formatDate(o.date)}</p>
                </div>

                <div className="order-meta">
                  <p className="order-total">${parseFloat(o.total).toFixed(2)}</p>
                  <select
                    value={selectedStatus[o.orderNumber] || o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(o.accountNumber, o.orderNumber, e.target.value)}
                    className={`status-dropdown status-${o.status}`}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="preparing">Preparing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div
                className={`order-details ${
                  expandedOrder === o.orderNumber ? "show" : ""
                }`}
              >
                <div className="order-meta-info">
                  <p>
                    <strong>Shipping Address:</strong> {o.shippingAddress}
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status-label ${o.status}`}>
                      {o.status}
                    </span>
                  </p>
                </div>

                <div className="order-items">
                  <h4>Items</h4>
                  <div className="items-grid">
                    {o.items.map((item, i) => (
                      <div key={i} className="product-card" style={{ animationDelay: `${i * 80}ms` }}>
                        <div className="product-image-wrapper">
                          <img
                            src={item.image || "/placeholder.png"}
                            alt={item.name || item.upc}
                            className="product-img"
                          />
                        </div>

                        <div className="product-info">
                          <h3>{item.name || `Item ${i + 1}`}</h3>
                          <p className="product-brand">{item.brand || "NobleMart"}</p>

                          <div className="product-meta">
                            <p className="qty">Qty: {parseInt(item.quantity)}</p>
                            <p className="price">${parseFloat(item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}