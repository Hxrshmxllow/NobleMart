import { useState, useEffect } from "react";
import api from "../../api";
import CartItem from "../../components/CartItem/CartItem";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [promo, setPromo] = useState(null);

  const updateQuantity = (upc, newQty) => {
    setCartItems((prev) => {
      let updated;

      if (newQty <= 0) {
        updated = prev.filter((item) => item.upc !== upc);
      } else {
        updated = prev.map((item) =>
          item.upc === upc ? { ...item, quantity: newQty } : item
        );
      }
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (upc) => {
  setCartItems((prev) => {
    const updated = prev.filter((item) => item.upc !== upc);
    localStorage.setItem("cart", JSON.stringify(updated)); 
    return updated;
  });
};

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const parsed = JSON.parse(savedCart);
        const normalized = parsed.map((item) => ({
          ...item,
          price: parseFloat(item.price) || 0,
        }));

        setCartItems(normalized);
      }
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  }, []);

  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);


  const subtotal = cartItems.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );

  const tax = subtotal * 0.07;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = promo === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + tax + shipping - discount;

  return (
    <div className="cart">
      <h1 className="cart-title">Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item, index) => (
              <CartItem
                key={item.upc}
                item={item}
                updateQuantity={updateQuantity}
                onRemove={removeItem}
                delay={index * 100}
              />
            ))}
          </div>

          <CheckoutSummary
            subtotal={subtotal}
            tax={tax}
            shipping={shipping}
            discount={discount}
            total={total}
            onPromoApply={(code) => setPromo(code.toUpperCase())}
            promo={promo}
          />
        </div>
      )}
    </div>
  );
}
