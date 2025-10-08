import { useEffect, useState } from "react";
import api from "../../api";
import './PendingOrders.css'

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/admin/orders?status=pending").then((res) => setOrders(res.data));
  }, []);

  const handleComplete = (id) => {
    api.patch(`/admin/orders/${id}`, { status: "completed" }).then(() => {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    });
  };

  return (
    <div className="orders-section fade-in">
      <h2>Pending Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer}</td>
              <td>${o.total}</td>
              <td>{o.date}</td>
              <td>
                <button onClick={() => handleComplete(o.id)}>Mark Complete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}