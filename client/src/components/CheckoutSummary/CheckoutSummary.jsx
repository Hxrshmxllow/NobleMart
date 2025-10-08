import { useEffect, useRef, useState } from "react";
import "./CheckoutSummary.css";
import { useNavigate } from "react-router-dom";

export default function CheckoutSummary({
  subtotal,
  tax,
  shipping,
  discount,
  total,
  onPromoApply,
  promo,
}) {
  const [promoInput, setPromoInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout"); 
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const applyPromo = () => {
    if (!promoInput.trim()) return;
    if (promoInput.toUpperCase() === "SAVE10") {
      onPromoApply(promoInput);
      setFeedback("Promo applied! 10% off");
    } else {
      setFeedback("Invalid promo code");
    }
    setTimeout(() => setFeedback(""), 2000);
    setPromoInput("");
  };

  return (
    <aside
      ref={ref}
      className={`checkout-summary ${visible ? "visible" : ""}`}
    >
      <div className="summary-box">
        <h3>Order Summary</h3>

        <div className="summary-line">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Tax (7%)</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="summary-line">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>

        {discount > 0 && (
          <div className="summary-line discount">
            <span>Promo (SAVE10)</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="summary-total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className="promo-box">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
          />
          <button onClick={applyPromo}>Apply</button>
        </div>

        {feedback && <p className="promo-feedback">{feedback}</p>}

        <button className="checkout-btn" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </aside>
  );
}
