import "./CartItem.css";

export default function CartItem({ item, onQuantityChange, onRemove, delay }) {
  return (
    <div
      id={`item-${item.id}`}
      className="cart-item"
      style={{ animationDelay: `${delay}ms` }}
    >
      <img src={item.image} alt={item.name} className="cart-item-image" />

      <div className="cart-item-info">
        <h3>{item.name}</h3>
        <p className="brand">{item.brand}</p>
        <p className="price">${item.price.toFixed(2)}</p>
      </div>

      <div className="cart-item-actions">
        <div className="quantity-control">
          <button
            onClick={() =>
              onQuantityChange(item.id, Math.max(1, item.quantity - 1))
            }
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => onQuantityChange(item.id, item.quantity + 1)}>
            +
          </button>
        </div>
        <button className="remove-btn" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      </div>
    </div>
  );
}
