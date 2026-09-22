import { useNavigate } from "react-router-dom";
import { useInventario } from "../../../context/InventarioContext";
import { todasLasVentas, fechaCorta } from "../../../data/ventas";
import type { Venta } from "../../../data/ventas";
import "../Admin.css";
import "./Dashboard.css";

function mismoDia(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function Dashboard() {
    const navigate = useNavigate();
    const { productos } = useInventario();

    const ventas = todasLasVentas();
    const hoy = new Date();

    const ventasHoy = ventas.filter((v) => mismoDia(new Date(v.fecha), hoy));
    const ventasMes = ventas.filter((v) => {
        const d = new Date(v.fecha);
        return d.getMonth() === hoy.getMonth() && d.getFullYear() === hoy.getFullYear();
    });

    const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);
    const totalMes = ventasMes.reduce((acc, v) => acc + v.total, 0);

    const usuarios = JSON.parse(localStorage.getItem("techstore-usuarios") ?? "[]");
    const stockBajo = productos.filter((p) => p.activo && p.stock < 10);

    // Top 5 por unidades vendidas (dato base de cada producto)
    const top = [...productos].sort((a, b) => b.vendidos - a.vendidos).slice(0, 5);
    const maxTop = top[0]?.vendidos ?? 1;

    const recientes: Venta[] = ventas.slice(0, 5);

    return (
        <>
            <h1>Dashboard</h1>
            <p className="admin-muted">Resumen general del negocio.</p>

            <section className="admin-cards dash-6">
                <div className="admin-card"><span>Ventas de hoy</span><strong>S/ {totalHoy.toLocaleString("es-PE")}</strong></div>
                <div className="admin-card"><span>Ventas del mes</span><strong>S/ {totalMes.toLocaleString("es-PE")}</strong></div>
                <div className="admin-card"><span>Número de ventas</span><strong>{ventas.length}</strong></div>
                <div className="admin-card"><span>Productos</span><strong>{productos.length}</strong></div>
                <div className="admin-card"><span>Usuarios</span><strong>{usuarios.length + 3}</strong></div>
                <div className="admin-card alerta"><span>Stock bajo</span><strong>{stockBajo.length}</strong></div>
            </section>

            <div className="dash-grid">
                <section className="admin-section">
                    <div className="sec-head">
                        <h2>Ventas recientes</h2>
                        <button className="btn-link" onClick={() => navigate("/admin/ventas")}>Ver todas</button>
                    </div>
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr><th>N°</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr>
                            </thead>
                            <tbody>
                                {recientes.map((v) => (
                                    <tr key={v.numero}>
                                        <td>{v.numero}</td>
                                        <td>{v.cliente}</td>
                                        <td>{fechaCorta(v.fecha)}</td>
                                        <td>S/ {v.total.toLocaleString("es-PE")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-section">
                    <h2>Más vendidos</h2>
                    <div className="ranking">
                        {top.map((p) => (
                            <div key={p.id} className="rank-fila">
                                <span className="rank-nombre">{p.nombre}</span>
                                <div className="rank-barra">
                                    <div style={{ width: `${Math.round((p.vendidos / maxTop) * 100)}%` }} />
                                </div>
                                <strong>{p.vendidos}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <section className="admin-section">
                <h2>Alertas de inventario</h2>
                {stockBajo.length === 0 ? (
                    <p className="admin-muted">Todo el stock está en niveles normales.</p>
                ) : (
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr><th>Producto</th><th>Stock</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {stockBajo.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td>{p.stock}</td>
                                        <td><span className={`badge ${p.stock === 0 ? "off" : "pend"}`}>{p.stock === 0 ? "Sin stock" : "Stock bajo"}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </>
    );
}

export default Dashboard;
