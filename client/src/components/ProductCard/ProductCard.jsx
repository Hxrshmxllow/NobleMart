import "./ProductCard.css";

export default function ProductCard({ product, onClick, delay }) {
  return (
    <div
      className="product-card"
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="product-image-wrapper">
        <img
          src={product.image || "/placeholder.png"}
          alt={product.name}
          className="product-img"
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-brand">{product.brand || "NobleMart"}</p>
        <p className="product-price">${product.price}</p>
      </div>
    </div>
  );
}
