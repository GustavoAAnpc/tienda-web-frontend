import { useNavigate } from "react-router-dom";
import type { Producto } from "../../data/productos";
import { useCarrito } from "../../context/CarritoContext";
import "./ProductCard.css";

interface Props {
  producto: Producto;
}

function ProductCard({ producto }: Props) {
  const navigate = useNavigate();
  const { agregar } = useCarrito();
  const agotado = producto.stock === 0;

  const agregarYVerCarrito = () => {
    agregar(producto.id);
    navigate("/carrito");
  };

  return (
    <article className={`product-card ${agotado ? "agotado" : ""}`}>
      <div className="product-image" onClick={() => navigate(`/productos/${producto.id}`)}>
        <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
        {agotado && <span className="product-badge">Agotado</span>}
      </div>

      <div className="product-body">
        <span className="product-category">{producto.categoria}</span>
        <h3 onClick={() => navigate(`/productos/${producto.id}`)}>{producto.nombre}</h3>

        <div className="product-footer">
          <div>
            <span className="product-price">S/ {producto.precio}</span>
            <span className={`product-stock ${agotado ? "sin-stock" : ""}`}>
              {agotado ? "Sin stock" : `${producto.stock} disponibles`}
            </span>
          </div>
        </div>

        <div className="product-actions">
          <button
            className="btn-primary"
            disabled={agotado}
            onClick={agregarYVerCarrito}
            title={agotado ? "Sin stock" : "Agregar al carrito"}
          >
            Agregar
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate(`/productos/${producto.id}`)}
          >
            Ver detalle
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
