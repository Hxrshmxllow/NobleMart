import { useState, useEffect } from "react";
import api from "../../api";
import CartItem from "../../components/CartItem/CartItem";
import CheckoutSummary from "../../components/CheckoutSummary/CheckoutSummary";
import "./Cart.css";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [promo, setPromo] = useState(null);

  useEffect(() => {
    // Replace with api.get("/cart") later
    setTimeout(() => {
      setCartItems([
        {
          id: 1,
          name: "Versace Eros",
          brand: "Versace",
          price: 89.99,
          quantity: 1,
          image: "/placeholder.png",
        },
        {
          id: 2,
          name: "Dior Sauvage",
          brand: "Dior",
          price: 119.99,
          quantity: 2,
          image: "/placeholder.png",
        },
      ]);
    }, 300);
  }, []);

  const updateQuantity = (id, newQty) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: newQty } : item))
    );
  };

  const removeItem = (id) => {
    const card = document.querySelector(`#item-${id}`);
    card.classList.add("fade-out");
    setTimeout(() => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }, 300);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.07; // Example 7% tax
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
                key={item.id}
                item={item}
                onQuantityChange={updateQuantity}
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
