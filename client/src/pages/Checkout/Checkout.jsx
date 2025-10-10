import { useState } from "react";
import "./Checkout.css";
import api from "../../api";

export default function Checkout() {
  const [step, setStep] = useState("shipping"); 
  const [orderStatus, setOrderStatus] = useState("idle");   
  const [shipping, setShipping] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [payment, setPayment] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const savedTotals = JSON.parse(localStorage.getItem("cartTotals")) || {};
  const subtotal = parseFloat(savedTotals.subtotal) || 0;
  const tax = subtotal * 0.07;
  const shippingCost = subtotal > 100 ? 0 : 9.99;
  const total = subtotal + tax + shippingCost;

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep("payment");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const savedCart = localStorage.getItem("cart");
    if (!savedCart) {
      alert("Your cart is empty!");
      return;
    }
    const cartItems = JSON.parse(savedCart);
    const orderData = {
      items: cartItems.map((item) => ({
        upc: item.upc,
        quantity: item.quantity,
        price: item.price,
      })),
      total: total.toFixed(2),
      address: `${shipping.address}, ${shipping.city}, ${shipping.state} ${shipping.zip}`,
      status: "Pending",
    };

    try {
      const token = localStorage.getItem("idToken");
      if (!token) {
        alert("Please sign in first!");
        return;
      }
      const res = await fetch("http://127.0.0.1:5001/api/orders/place_order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        setOrderStatus("success");
        localStorage.removeItem("cart");
        setTimeout(() => {
          window.location.href = "/account";
        }, 2500)
      } else {
        console.error("Order error:", data);
        alert(`Failed to place order: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Network error. Please try again.");
    }
  };

  return (
    <div className="checkout-page">
      <div className={`checkout-wrapper fade-in ${
    step === "payment" ? "compact" : ""
  }`}>
        <h1 className="checkout-header">Checkout</h1>

        {step === "shipping" && (
          <form className="checkout-form" onSubmit={handleShippingSubmit}>
            <h2>Shipping Address</h2>
            <div className="form-grid">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={shipping.fullName}
                onChange={handleShippingChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={shipping.email}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Street Address"
                value={shipping.address}
                onChange={handleShippingChange}
                required
                className="wide"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={shipping.city}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={shipping.state}
                onChange={handleShippingChange}
                required
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={shipping.zip}
                onChange={handleShippingChange}
                required
              />
            </div>

            <div className="checkout-actions">
              <button type="submit" className="checkout-btn">
                Continue to Payment →
              </button>
            </div>
          </form>
        )}

        {step === "payment" && (
          <form className="checkout-form" onSubmit={handlePaymentSubmit}>
            <h2>Payment Details</h2>
            <div className="form-grid">
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={payment.cardNumber}
                onChange={handlePaymentChange}
                required
                className="wide"
              />
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                value={payment.expiry}
                onChange={handlePaymentChange}
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={payment.cvv}
                onChange={handlePaymentChange}
                required
              />
            </div>

            <div className="checkout-summary-1">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="back-btn"
                onClick={() => setStep("shipping")}
              >
                ← Back
              </button>
              <button type="submit" className="checkout-btn">
                Pay ${total.toFixed(2)}
              </button>
            </div>
          </form>
        )}

      </div>
      {orderStatus === "processing" && (
  <div className="order-popup processing">
    <div className="loader"></div>
    <p>Processing your order...</p>
  </div>
)}

{orderStatus === "success" && (
  <div className="order-popup success">
    <div className="checkmark">
      <div className="checkmark-stem"></div>
      <div className="checkmark-kick"></div>
    </div>
    <p>Order placed successfully!</p>
  </div>
)}
    </div>
  );
}
