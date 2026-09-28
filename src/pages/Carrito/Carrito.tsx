import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCarrito } from "../../context/CarritoContext";
import { useInventario } from "../../context/InventarioContext";
import { useAuth } from "../../context/AuthContext";
import { generarNumeroPedido, guardarPedido } from "../../data/pedidos";
import "./Carrito.css";

// Envío gratis desde este monto, si no, cuesta fijo
const UMBRAL_ENVIO_GRATIS = 499;
const COSTO_ENVIO = 19;

function Carrito() {
    const navigate = useNavigate();
    const { items, cambiarCantidad, quitar, vaciar, subtotal } = useCarrito();
    const { productos, registrarSalida } = useInventario();
    const { usuario } = useAuth();

    // Pedido confirmado (solo frontend): guarda el total y muestra éxito
    const [pedidoOk, setPedidoOk] = useState<string | null>(null);
    const [totalPagado, setTotalPagado] = useState(0);

    // Une cada item con los datos actuales del inventario
    const lineas = items
        .map((item) => ({ ...item, producto: productos.find((p) => p.id === item.id)! }))
        .filter((l) => l.producto && l.producto.activo);

    const envioGratis = subtotal >= UMBRAL_ENVIO_GRATIS;
    const envio = lineas.length === 0 || envioGratis ? 0 : COSTO_ENVIO;
    const total = subtotal + envio;

    // Barra de progreso hacia el envío gratis
    const progreso = Math.min(100, Math.round((subtotal / UMBRAL_ENVIO_GRATIS) * 100));
    const faltante = UMBRAL_ENVIO_GRATIS - subtotal;

    const finalizarCompra = () => {
        const numero = generarNumeroPedido();
        const fecha = new Date().toLocaleDateString("es-PE");

        // Venta confirmada: genera la salida automática en Kardex y baja el stock
        lineas.forEach((l) =>
            registrarSalida(l.producto.id, l.cantidad, `Venta ${numero}`, usuario?.nombre ?? "Invitado")
        );

        // Guarda el pedido para mostrarlo en Mis compras
        guardarPedido({
            numero,
            fecha,
            usuarioId: usuario?.id ?? "invitado",
            items: lineas.map((l) => ({
                id: l.producto.id,
                nombre: l.producto.nombre,
                precio: l.producto.precio,
                cantidad: l.cantidad,
                imagen: l.producto.imagen,
            })),
            total,
        });

        setTotalPagado(total);
        setPedidoOk(numero);
        vaciar();
    };

    // Productos sugeridos: los más vendidos que no estén en el carrito
    const sugeridos = productos.filter((p) => p.activo && !items.some((i) => i.id === p.id))
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 4);

    return (
        <div className="carrito-page">
            <Header />

            <main className="carrito-content">
                <div className="carrito-header">
                    <h1>Tu carrito</h1>
                    <p>
                        {lineas.length === 0
                            ? "Aún no agregaste productos"
                            : `${lineas.length} producto${lineas.length !== 1 ? "s" : ""} en tu compra`}
                    </p>
                </div>

                {/* ===== Compra confirmada ===== */}
                {pedidoOk ? (
                    <section className="pedido-exito">
                        <div className="exito-icon">
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2>¡Compra realizada!</h2>
                        <p>
                            Pedido <strong>{pedidoOk}</strong> por <strong>S/ {totalPagado.toLocaleString("es-PE")}</strong>.
                            Te escribiremos para coordinar la entrega.
                        </p>
                        <div className="exito-buttons">
                            <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                                Seguir comprando
                            </button>
                            <button className="btn-ghost" onClick={() => navigate("/inicio")}>
                                Volver al inicio
                            </button>
                        </div>
                    </section>
                ) : lineas.length === 0 ? (
                    /* ===== Carrito vacío ===== */
                    <section className="carrito-vacio">
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Tu carrito está vacío</h2>
                        <p>Explora el catálogo y encuentra tecnología a buenos precios.</p>
                        <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                            Ver productos
                        </button>
                    </section>
                ) : (
                    /* ===== Carrito con productos ===== */
                    <>
                        {/* Barra envío gratis */}
                        <section className="envio-bar">
                            <div className="envio-texto">
                                {envioGratis ? (
                                    <span><strong>¡Tienes envío gratis!</strong> Aprovecha tu compra.</span>
                                ) : (
                                    <span>Te faltan <strong>S/ {faltante.toLocaleString("es-PE")}</strong> para el envío gratis</span>
                                )}
                            </div>
                            <div className="envio-progreso">
                                <div className="envio-relleno" style={{ width: `${progreso}%` }} />
                            </div>
                            <span className="envio-porcentaje">{progreso}%</span>
                        </section>

                        <div className="carrito-grid">
                            {/* Lista de productos */}
                            <section className="carrito-lista">
                                {lineas.map(({ producto, cantidad }) => (
                                    <article key={producto.id} className="carrito-item">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            onClick={() => navigate(`/productos/${producto.id}`)}
                                        />
                                        <div className="item-info">
                                            <span className="item-categoria">{producto.categoria}</span>
                                            <h3 onClick={() => navigate(`/productos/${producto.id}`)}>
                                                {producto.nombre}
                                            </h3>
                                            <span className="item-precio-unit">
                                                S/ {producto.precio.toLocaleString("es-PE")} c/u
                                            </span>

                                            <div className="item-acciones">
                                                <div className="stepper">
                                                    <button
                                                        onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                                                        aria-label="Quitar uno"
                                                    >
                                                        −
                                                    </button>
                                                    <span>{cantidad}</span>
                                                    <button
                                                        onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                                                        disabled={cantidad >= producto.stock}
                                                        aria-label="Agregar uno"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn-quitar"
                                                    onClick={() => quitar(producto.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </div>

                                            {cantidad >= producto.stock && (
                                                <span className="item-stock-max">
                                                    Stock máximo disponible ({producto.stock})
                                                </span>
                                            )}
                                        </div>
                                        <div className="item-subtotal">
                                            <strong>S/ {(producto.precio * cantidad).toLocaleString("es-PE")}</strong>
                                        </div>
                                    </article>
                                ))}

                                <button className="btn-vaciar" onClick={vaciar}>
                                    Vaciar carrito
                                </button>
                            </section>

                            {/* Resumen */}
                            <aside className="carrito-resumen">
                                <h2>Resumen de compra</h2>
                                <div className="resumen-fila">
                                    <span>Subtotal</span>
                                    <span>S/ {subtotal.toLocaleString("es-PE")}</span>
                                </div>
                                <div className="resumen-fila">
                                    <span>Envío</span>
                                    <span className={envioGratis ? "gratis" : ""}>
                                        {envioGratis ? "Gratis" : `S/ ${envio}`}
                                    </span>
                                </div>
                                <div className="resumen-total">
                                    <span>Total</span>
                                    <strong>S/ {total.toLocaleString("es-PE")}</strong>
                                </div>
                                <button className="btn-primary-lg" onClick={finalizarCompra}>
                                    Finalizar compra
                                </button>
                                <button className="btn-ghost" onClick={() => navigate("/productos")}>
                                    Seguir comprando
                                </button>

                                <div className="resumen-confianza">
                                    <span>Pago 100% seguro</span>
                                    <span>Garantía en todos los productos</span>
                                </div>
                            </aside>
                        </div>
                    </>
                )}

                {/* Sugeridos */}
                {!pedidoOk && sugeridos.length > 0 && (
                    <section className="carrito-sugeridos">
                        <h2>También te puede interesar</h2>
                        <div className="sugeridos-grid">
                            {sugeridos.map((p) => (
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

export default Carrito;
