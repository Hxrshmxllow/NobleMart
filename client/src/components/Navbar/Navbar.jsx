import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const hasToken = Boolean(localStorage.getItem("accessToken"));

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken"); 
    localStorage.removeItem("idToken"); 
    localStorage.removeItem("userEmail"); 
    navigate("/signin"); 
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">NobleMart</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/shop" className={isActive("/shop")}>Shop</Link>
          <Link to="/cart" className={isActive("/cart")}>Cart</Link>
          <Link to="/about" className={isActive("/about")}>About</Link>
        </nav>

        <div className="navbar-actions">
          {hasToken ? (
            <button className="sign-btn logout" onClick={handleLogout}>
              Log Out
            </button>
          ) : (
            <button className="sign-btn" onClick={() => navigate("/signin")}>
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
