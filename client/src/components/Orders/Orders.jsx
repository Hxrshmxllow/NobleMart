import { useEffect, useState } from "react";
import api from "../../api";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("idToken");
  useEffect(() => {
    const fetchOrders = async () => {
        try {
        const res = await api.get("/orders/myorders", {
            headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
        } catch (err) {
        console.error(err);
        }
    };
    fetchOrders();
  }, []);

  const handleExpand = async (orderNumber) => {
    if (expandedOrder === orderNumber) {
      setExpandedOrder(null);
      return;
    }
    if (orderDetails[orderNumber]) {
      setExpandedOrder(orderNumber);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/orders/${orderNumber}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        const orderData = res.data?.order || {};
        setOrderDetails((prev) => ({ ...prev, [orderNumber]: orderData }));
        setExpandedOrder(orderNumber);
    } catch (err) {
      console.error(`Failed to fetch order ${orderNumber}:`, err);
    } finally {
      setLoading(false);
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
    <div className="orders">
      <h2 className="orders-title">Your Orders</h2>

      {orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order, idx) => (
            <li key={idx} className="order-item">
              <div
                className="order-summary"
                onClick={() => handleExpand(order.orderNumber)}
              >
                <div className="order-info">
                  <p className="order-id">#{order.orderNumber}</p>
                  <p className="order-date">{formatDate(order.date)}</p>
                </div>
                <div className="order-meta">
                  <p className="order-total">${order.total}</p>
                  <span
                    className={`order-status ${
                      order.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>

              <div
                className={`order-details ${
                  expandedOrder === order.orderNumber ? "show" : ""
                }`}
              >
                {loading && !orderDetails[order.orderNumber] ? (
                  <p className="loading">Loading order details...</p>
                ) : (
                  <div className="items-grid">
                    {orderDetails[order.orderNumber]?.items?.map((item, i) => (
                      <div key={i} className="order-item-detail">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p className="brand">{item.brand}</p>
                          <p className="qty">Qty: {item.quantity}</p>
                          <p className="price">${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
