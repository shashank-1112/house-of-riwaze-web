import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className={`product-image ${product.imageTone}`}>
        <span>{product.category}</span>
      </Link>
      <div className="product-body">
        <div className="row between">
          <small>{product.collection}</small>
          <StatusBadge status={product.status} />
        </div>
        <h3>{product.name}</h3>
        <p>{product.metal} · {product.stone}</p>
        <div className="row between product-meta">
          <span>{product.grossWeight}g</span>
          <strong>₹{product.price.toLocaleString("en-IN")}</strong>
        </div>
      </div>
    </article>
  );
}
