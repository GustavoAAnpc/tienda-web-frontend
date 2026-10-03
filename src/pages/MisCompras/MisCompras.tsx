import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import "../Admin/Admin.css";
import "./MisCompras.css";
import { leerPedidos } from "../../data/pedidos";
import type { Pedido } from "../../data/pedidos";

function MisCompras() {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    // Pedido seleccionado para ver su detalle en el modal
    const [detalle, setDetalle] = useState<Pedido | null>(null);

    if (!usuario) {
        return (
            <div className="admin-page">
                <Header />
                <main className="admin-content">
                    <h1>Mis compras</h1>
                    <p className="admin-muted">Inicia sesión para ver tu historial.</p>
                    <button className="btn-primary-lg" onClick={() => navigate("/login")}>
                        Ir al login
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    const pedidos = leerPedidos().filter((p) => p.usuarioId === usuario.id);

    return (
        <div className="admin-page">
            <Header />

            <main className="admin-content">
                <h1>Mis compras</h1>
                <p className="admin-muted">
                    {pedidos.length === 0
                        ? "Aquí aparecerá el historial de tus pedidos"
                        : `${pedidos.length} pedido${pedidos.length !== 1 ? "s" : ""} realizados`}
                </p>

                {pedidos.length === 0 ? (
                    <div className="compras-vacio">
                        <h3>Sin compras todavía</h3>
                        <p>Cuando finalices una compra en el carrito, aparecerá aquí.</p>
                        <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                            Explorar productos
                        </button>
                    </div>
                ) : (
                    <section className="pedidos-tabla">
                        <div className="pedidos-head">
                            <span>Código</span>
                            <span>Fecha</span>
                            <span>Estado / Entrega</span>
                            <span>Total</span>
                            <span></span>
                        </div>

                        {pedidos.map((p) => (
                            <div key={p.numero} className="pedidos-fila">
                                <strong>{p.numero}</strong>
                                <span className="pedidos-fecha">{p.fecha}</span>
                                <span className={`pedidos-estado ${p.estado?.toLowerCase().replace(/\s/g, "-")}`}>
                                    {p.estado || "Pendiente"}
                                    <small style={{display:"block", color:"var(--text-muted)", fontSize:"11px"}}>
                                        {p.tipoEntrega === "recojo" ? "Recojo en tienda" : "Envío a domicilio"}
                                    </small>
                                </span>
                                <strong className="pedidos-total">
                                    S/ {p.total.toLocaleString("es-PE")}
                                </strong>
                                <button className="btn-detalle" onClick={() => setDetalle(p)}>
                                    Ver detalle
                                </button>
                            </div>
                        ))}
                    </section>
                )}

                {/* Modal con el detalle de la compra */}
                {detalle && (
                    <div className="modal-fondo" onClick={() => setDetalle(null)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-head">
                                <div>
                                    <h2>Detalle de compra</h2>
                                    <p className="admin-muted">
                                        {detalle.numero} · {detalle.fecha}
                                    </p>
                                </div>
                                <button className="modal-cerrar" onClick={() => setDetalle(null)}>
                                    ✕
                                </button>
                            </div>

                            {detalle.comprobante && (
                                <div style={{ marginBottom: "16px", padding: "12px 14px", background: "var(--bg-subtle)", borderRadius: "var(--radius-md)", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span><strong>Estado:</strong> <span style={{ color: "var(--accent)", fontWeight: 700 }}>{detalle.estado || "Pendiente"}</span></span>
                                        <span><strong>Entrega:</strong> {detalle.tipoEntrega === "recojo" ? "Recojo en tienda" : "Envío a domicilio"}</span>
                                    </div>
                                    <hr style={{ border: 0, borderTop: "1px solid var(--border-color)", margin: "4px 0" }} />
                                    <div><strong>Comprobante:</strong> {detalle.comprobante.tipo} Electrónica ({detalle.comprobante.documento})</div>
                                    <div><strong>Titular:</strong> {detalle.comprobante.nombreRazonSocial}</div>
                                    {detalle.metodoPago && (
                                        <div><strong>Método de pago:</strong> {detalle.metodoPago === "tarjeta" ? "Tarjeta Débito/Crédito" : detalle.metodoPago === "yape" ? "Yape / Plin" : "Transferencia Bancaria"}</div>
                                    )}
                                </div>
                            )}

                            <table className="tabla">
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cant.</th>
                                        <th>P. unitario</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {detalle.items.map((it) => (
                                        <tr key={it.id}>
                                            <td>{it.nombre}</td>
                                            <td>{it.cantidad}</td>
                                            <td>S/ {it.precio.toLocaleString("es-PE")}</td>
                                            <td>S/ {(it.precio * it.cantidad).toLocaleString("es-PE")}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="modal-total">
                                <span>Total pagado</span>
                                <strong>S/ {detalle.total.toLocaleString("es-PE")}</strong>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default MisCompras;
