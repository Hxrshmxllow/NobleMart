import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} NobleMart. All rights reserved.</p>
      <div className="footer-links">
        <a href="#">FAQ</a>
        <a href="#">Delivery</a>
        <a href="#">Privacy</a>
      </div>
    </footer>
  );
}
