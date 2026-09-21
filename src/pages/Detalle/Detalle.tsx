import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { PRODUCTOS } from "../../data/productos";
import { useCarrito } from "../../context/CarritoContext";
import "./Detalle.css";

function Detalle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { agregar } = useCarrito();
    const [cantidad, setCantidad] = useState(1);

    const producto = PRODUCTOS.find((p) => p.id === Number(id));

    if (!producto) {
        return (
            <div className="detalle-page">
                <Header />
                <main className="detalle-content">
                    <h1>Producto no encontrado</h1>
                    <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                        Volver al catálogo
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    const agotado = producto.stock === 0;
    const relacionados = PRODUCTOS.filter(
        (p) => p.categoria === producto.categoria && p.id !== producto.id
    ).slice(0, 4);

    const subir = () => setCantidad((c) => Math.min(c + 1, producto.stock));
    const bajar = () => setCantidad((c) => Math.max(c - 1, 1));

    const agregarYVerCarrito = () => {
        agregar(producto.id, cantidad);
        navigate("/carrito");
    };

    return (
        <div className="detalle-page">
            <Header />

            <main className="detalle-content">
                <button className="btn-volver" onClick={() => navigate("/productos")}>
                    ← Volver al catálogo
                </button>

                <section className="detalle-grid">
                    <div className="detalle-imagen">
                        <img src={producto.imagen} alt={producto.nombre} />
                        {agotado && <span className="detalle-agotado">Agotado</span>}
                    </div>

                    <div className="detalle-info">
                        <span className="detalle-categoria">{producto.categoria}</span>
                        <h1>{producto.nombre}</h1>
                        <p className="detalle-descripcion">{producto.descripcion}</p>
                        <span className="detalle-precio">
                            S/ {producto.precio.toLocaleString("es-PE")}
                        </span>
                        <span className={`detalle-stock ${agotado ? "sin" : ""}`}>
                            {agotado ? "Sin stock" : `${producto.stock} disponibles`}
                        </span>

                        {!agotado && (
                            <div className="detalle-compra">
                                <div className="stepper">
                                    <button onClick={bajar} disabled={cantidad <= 1}>−</button>
                                    <span>{cantidad}</span>
                                    <button onClick={subir} disabled={cantidad >= producto.stock}>+</button>
                                </div>
                                <button className="btn-primary-lg" onClick={agregarYVerCarrito}>
                                    Agregar al carrito
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {relacionados.length > 0 && (
                    <section className="detalle-relacionados">
                        <h2>Productos relacionados</h2>
                        <div className="relacionados-grid">
                            {relacionados.map((p) => (
                                <ProductCard key={p.id} producto={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Detalle;
