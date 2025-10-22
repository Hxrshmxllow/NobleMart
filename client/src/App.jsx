import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import Checkout from "./pages/Checkout/Checkout";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import Shop from "./pages/Shop/Shop";
import Admin from "./pages/Admin/Admin"
import Product from "./pages/Product/Product"
import Account from "./pages/Account/Account"
import './App.css'


export default function App() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenPopup");
    if (!seen) {
      setShowPopup(true);
      localStorage.setItem("seenPopup", "true");
    }
  }, []);
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product/:upc" element={<Product />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </main>
      <Footer />
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h2 className="popup-title">Under Development</h2>
            <p className="popup-message" style={{color:"white"}}>
              Hey there! This site is still in development.  
              Feel free to explore and test things out — some features may not
              work just yet, but we’re actively building!
            </p>
            <div className="popup-actions">
              <button
                className="popup-button primary"
                onClick={() => setShowPopup(false)}
              >
                Explore Anyway
              </button>
              <button
                className="popup-button secondary"
                onClick={() => setShowPopup(false)}
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </Router>
  );
}