import { useState, useEffect } from "react";
import "./Admin.css";
import AdminSidebar from "../../components/AdminSidebar/AdminSidebar";
import AdminTopbar from "../../components/AdminTopbar/AdminTopbar";
import StatCard from "../../components/StatCard/StatCard";
import PendingOrders from "../../components/PendingOrders/PendingOrders";
import UploadProduct from "../../components/UploadProduct/UploadProduct";
import InventoryManager from "../../components/InventoryManager/InventoryManager";
import api from "../../api";

export default function Admin() {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({
    sales: 0,
    orders: 0,
    products: 0,
  });
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
    api.get("/admin/top-products").then((res) => setTopProducts(res.data));
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar active={activePage} setActive={setActivePage} />
      <div className="admin-main">
        <AdminTopbar title={activePage === "dashboard" ? "Overview" : activePage} />

        {activePage === "dashboard" && (
          <div className="dashboard-content fade-in">
            <div className="stats-grid">
              <StatCard title="Total Sales" value={`$${stats.sales.toLocaleString()}`} />
              <StatCard title="Orders" value={stats.orders} />
              <StatCard title="Products" value={stats.products} />
            </div>

            <div className="top-products">
              <h2>Top Selling Products</h2>
              <ul>
                {topProducts.map((p) => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <span>${p.sales}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activePage === "orders" && <PendingOrders />}
        {activePage === "upload" && <UploadProduct />}
        {activePage === "inventory" && <InventoryManager />}
      </div>
    </div>
  );
}
