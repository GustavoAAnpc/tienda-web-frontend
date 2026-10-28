import { useNavigate } from "react-router-dom";
import { useInventario } from "../../../context/InventarioContext";
import { todasLasVentas, fechaCorta } from "../../../data/ventas";
import type { Venta } from "../../../data/ventas";

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

    // Top 5 por unidades vendidas
    const top = [...productos].sort((a, b) => b.vendidos - a.vendidos).slice(0, 5);
    const maxTop = top[0]?.vendidos ?? 1;

    const recientes: Venta[] = ventas.slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Dashboard General</h1>
                <p className="text-sm text-slate-500 mt-1">Métricas y resumen operativo del negocio en tiempo real.</p>
            </div>

            {/* Tarjetas KPI */}
            <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                <div className="admin-card"><span>Ventas hoy</span><strong>S/ {totalHoy.toLocaleString("es-PE")}</strong></div>
                <div className="admin-card"><span>Ventas mes</span><strong>S/ {totalMes.toLocaleString("es-PE")}</strong></div>
                <div className="admin-card"><span>N° Ventas</span><strong>{ventas.length}</strong></div>
                <div className="admin-card"><span>Productos</span><strong>{productos.length}</strong></div>
                <div className="admin-card"><span>Usuarios</span><strong>{usuarios.length + 3}</strong></div>
                <div className="admin-card alerta"><span>Stock bajo</span><strong>{stockBajo.length}</strong></div>
            </section>

            {/* Grid 2 Columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ventas Recientes */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">Ventas recientes</h2>
                        <button
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            onClick={() => navigate("/admin/ventas")}
                        >
                            Ver todas →
                        </button>
                    </div>
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr><th>N°</th><th>Cliente</th><th>Fecha</th><th>Total</th></tr>
                            </thead>
                            <tbody>
                                {recientes.map((v) => (
                                    <tr key={v.numero}>
                                        <td className="font-mono text-xs">{v.numero}</td>
                                        <td className="font-medium">{v.cliente}</td>
                                        <td className="text-xs text-slate-500">{fechaCorta(v.fecha)}</td>
                                        <td className="font-mono font-bold">S/ {v.total.toLocaleString("es-PE")}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Más Vendidos */}
                <section className="space-y-3">
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">Más vendidos</h2>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                        {top.map((p) => (
                            <div key={p.id} className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[240px]">{p.nombre}</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">{p.vendidos} uds.</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all duration-300"
                                        style={{ width: `${Math.round((p.vendidos / maxTop) * 100)}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Alertas de Inventario */}
            <section className="space-y-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Alertas de inventario</h2>
                {stockBajo.length === 0 ? (
                    <p className="text-sm text-slate-500">Todo el stock está en niveles normales.</p>
                ) : (
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr><th>Producto</th><th>Stock Actual</th><th>Estado</th></tr>
                            </thead>
                            <tbody>
                                {stockBajo.map((p) => (
                                    <tr key={p.id}>
                                        <td className="font-medium">{p.nombre}</td>
                                        <td className="font-mono font-bold">{p.stock}</td>
                                        <td>
                                            <span className={`badge ${p.stock === 0 ? "off" : "pend"}`}>
                                                {p.stock === 0 ? "Sin stock" : "Stock bajo"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

export default Dashboard;
