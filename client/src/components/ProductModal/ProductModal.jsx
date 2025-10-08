import "./ProductModal.css";

export default function ProductModal({ product, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        <div className="modal-content">
          <img
            src={product.image || "/placeholder.png"}
            alt={product.name}
            className="modal-img"
          />
          <div className="modal-info">
            <h2>{product.name}</h2>
            <p>{product.brand}</p>
            <p className="modal-price">${product.price}</p>
            <p className="modal-desc">
              {product.description || "Premium fragrance from NobleMart."}
            </p>

            <div className="modal-sizes">
              <button>3.3 oz</button>
              <button>2.0 oz</button>
            </div>

            <button className="modal-add">Add to Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
}