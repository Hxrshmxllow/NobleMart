import { useState, useEffect } from "react";
import api from "../../api";
import "./Account.css";

export default function Account() {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    accountNumber: "",
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("idToken");
        const res = await api.get("/account/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      await api.put(
        "/users/update",
        { name: user.name, address: user.address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated successfully.");
      setEditMode(false);
    } catch (err) {
      console.error(err);
      setMessage("Failed to update profile.");
    }
  };

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await api.get("/orders/myorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  if (loading) return <div className="loading">Loading your dashboard...</div>;

  return (
    <div className="dashboard-page fade-in">
      <div className="dashboard-box">
        <div className="tabs">
          <button
            className={activeTab === "info" ? "tab active" : "tab"}
            onClick={() => setActiveTab("info")}
          >
            User Info
          </button>
          <button
            className={activeTab === "orders" ? "tab active" : "tab"}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "info" ? (
            <div className="user-info">
              <h2>Account Details</h2>
              <p><strong>Account Number:</strong> {user.accountNumber}</p>

              <label>Name</label>
              <input
                type="text"
                value={user.name}
                disabled={!editMode}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
              />

              <label>Email</label>
              <input type="text" value={user.email} disabled />

              <label>Address</label>
              <input
                type="text"
                value={user.address}
                disabled={!editMode}
                onChange={(e) => setUser({ ...user, address: e.target.value })}
              />

              <div className="actions">
                {editMode ? (
                  <>
                    <button onClick={handleSave} className="save-btn">Save</button>
                    <button onClick={() => setEditMode(false)} className="cancel-btn">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditMode(true)} className="edit-btn">
                    Edit Profile
                  </button>
                )}
              </div>

              {message && <p className="message">{message}</p>}
            </div>
          ) : (
            <div className="orders">
              <h2>Your Orders</h2>
              {orders.length === 0 ? (
                <p className="no-orders">No orders found.</p>
              ) : (
                <ul className="order-list">
                  {orders.map((order, idx) => (
                    <li key={idx} className="order-item">
                      <p><strong>Order ID:</strong> {order.id}</p>
                      <p><strong>Date:</strong> {order.date}</p>
                      <p><strong>Total:</strong> ${order.total}</p>
                      <p><strong>Status:</strong> {order.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
