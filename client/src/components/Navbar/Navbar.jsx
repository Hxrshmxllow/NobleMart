import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/">NobleMart</Link>
        </div>

        <nav className="navbar-links">
          <Link to="/" className={isActive("/")}>Home</Link>
          <Link to="/cart" className={isActive("/cart")}>Cart</Link>
          <Link to="/about" className={isActive("/about")}>About</Link>
        </nav>

        <div className="navbar-actions">
          <button className="sign-btn" onClick={() => navigate('/signin')}>Sign In</button>
        </div>
      </div>
    </header>
  );
}
