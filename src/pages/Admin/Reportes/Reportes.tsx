import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import { todasLasVentas } from "../../../data/ventas";
import "../Admin.css";
import "./Reportes.css";

type Periodo = "hoy" | "semana" | "mes" | "custom";

function inicioDelDia(d: Date) {
    const c = new Date(d);
    c.setHours(0, 0, 0, 0);
    return +c;
}

function Reportes() {
    const { productos } = useInventario();

    const [periodo, setPeriodo] = useState<Periodo>("semana");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");

    const hoy = new Date();
    let ini: number;
    let fin = inicioDelDia(hoy) + 24 * 3600 * 1000;

    if (periodo === "hoy") {
        ini = inicioDelDia(hoy);
    } else if (periodo === "semana") {
        ini = inicioDelDia(hoy) - 6 * 24 * 3600 * 1000;
    } else if (periodo === "mes") {
        ini = +new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    } else {
        ini = desde ? +new Date(desde + "T00:00") : inicioDelDia(hoy) - 6 * 24 * 3600 * 1000;
        fin = hasta ? +new Date(hasta + "T00:00") + 24 * 3600 * 1000 : fin;
    }

    const ventas = todasLasVentas().filter((v) => {
        const t = +new Date(v.fecha);
        return t >= ini && t < fin;
    });

    const totalVendido = ventas.reduce((acc, v) => acc + v.total, 0);
    const unidades = ventas.reduce((acc, v) => acc + v.items.reduce((a, it) => a + it.cantidad, 0), 0);

    // Ventas por día para el gráfico (máximo 31 barras)
    const dias: { etiqueta: string; total: number }[] = [];
    for (let t = ini; t < fin && dias.length < 31; t += 24 * 3600 * 1000) {
        const d = new Date(t);
        const total = ventas
            .filter((v) => {
                const vd = new Date(v.fecha);
                return vd.getFullYear() === d.getFullYear() && vd.getMonth() === d.getMonth() && vd.getDate() === d.getDate();
            })
            .reduce((acc, v) => acc + v.total, 0);
        dias.push({ etiqueta: `${d.getDate()}/${d.getMonth() + 1}`, total });
    }
    const maxDia = Math.max(1, ...dias.map((d) => d.total));

    // Ranking del periodo
    const porProducto: Record<string, number> = {};
    ventas.forEach((v) => v.items.forEach((it) => {
        porProducto[it.nombre] = (porProducto[it.nombre] ?? 0) + it.cantidad;
    }));
    const ranking = Object.entries(porProducto).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const maxRank = ranking[0]?.[1] ?? 1;

    const stockBajo = productos.filter((p) => p.activo && p.stock < 10);

    return (
        <>
            <h1>Reportes</h1>

            <div className="rep-periodos">
                {(["hoy", "semana", "mes", "custom"] as Periodo[]).map((p) => (
                    <button key={p} className={periodo === p ? "activo" : ""} onClick={() => setPeriodo(p)}>
                        {p === "hoy" ? "Hoy" : p === "semana" ? "Últimos 7 días" : p === "mes" ? "Este mes" : "Personalizado"}
                    </button>
                ))}
                {periodo === "custom" && (
                    <>
                        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
                        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
                    </>
                )}
            </div>

            <section className="admin-cards">
                <div className="admin-card"><span>Total vendido</span><strong>S/ {totalVendido.toLocaleString("es-PE")}</strong></div>
                <div className="admin-card"><span>Número de ventas</span><strong>{ventas.length}</strong></div>
                <div className="admin-card"><span>Productos vendidos</span><strong>{unidades} uds.</strong></div>
            </section>

            <section className="admin-section">
                <h2>Ventas por día</h2>
                <div className="grafico">
                    {dias.map((d) => (
                        <div key={d.etiqueta} className="barra-col">
                            <span className="barra-val">S/ {d.total >= 1000 ? `${(d.total / 1000).toFixed(1)}k` : d.total}</span>
                            <div className="barra-track">
                                <div className="barra-fill" style={{ height: `${Math.round((d.total / maxDia) * 100)}%` }} />
                            </div>
                            <span className="barra-dia">{d.etiqueta}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="rep-grid">
                <section className="admin-section">
                    <h2>Más vendidos del periodo</h2>
                    {ranking.length === 0 ? (
                        <p className="admin-muted">Sin ventas en este periodo.</p>
                    ) : (
                        <div className="ranking">
                            {ranking.map(([nombre, cant]) => (
                                <div key={nombre} className="rank-fila">
                                    <span className="rank-nombre">{nombre}</span>
                                    <div className="rank-barra">
                                        <div style={{ width: `${Math.round((cant / maxRank) * 100)}%` }} />
                                    </div>
                                    <strong>{cant}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="admin-section">
                    <h2>Stock bajo</h2>
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
                </section>
            </div>
        </>
    );
}

export default Reportes;
