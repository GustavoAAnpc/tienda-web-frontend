import { useState } from "react";
import { todasLasVentas, fechaCorta } from "../../../data/ventas";
import type { Venta } from "../../../data/ventas";
import "../Admin.css";
import "./Ventas.css";

function Ventas() {
    const [busqueda, setBusqueda] = useState("");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");
    const [detalle, setDetalle] = useState<Venta | null>(null);

    const filtradas = todasLasVentas().filter((v) => {
        if (desde && v.fecha.slice(0, 10) < desde) return false;
        if (hasta && v.fecha.slice(0, 10) > hasta) return false;
        const q = busqueda.trim().toLowerCase();
        if (q && !v.numero.toLowerCase().includes(q) && !v.cliente.toLowerCase().includes(q)) return false;
        return true;
    });

    return (
        <>
            <h1>Ventas</h1>
            <p className="admin-muted">{filtradas.length} ventas encontradas.</p>

            <div className="ventas-filtros">
                <input
                    placeholder="Buscar por número o cliente..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
                <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
            </div>

            <div className="tabla-wrap">
                <table className="tabla">
                    <thead>
                        <tr><th>N°</th><th>Cliente</th><th>Fecha</th><th>Total</th><th></th></tr>
                    </thead>
                    <tbody>
                        {filtradas.map((v) => (
                            <tr key={v.numero}>
                                <td>{v.numero}</td>
                                <td>{v.cliente}</td>
                                <td>{fechaCorta(v.fecha)}</td>
                                <td>S/ {v.total.toLocaleString("es-PE")}</td>
                                <td><button className="btn-mini" onClick={() => setDetalle(v)}>Ver detalle</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtradas.length === 0 && <p className="tabla-vacia">Sin ventas para esos filtros.</p>}
            </div>

            {detalle && (
                <div className="modal-fondo" onClick={() => setDetalle(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <div>
                                <h2>Venta {detalle.numero}</h2>
                                <p className="admin-muted">{fechaCorta(detalle.fecha)} · {detalle.cliente}</p>
                            </div>
                            <button className="modal-cerrar" onClick={() => setDetalle(null)}>✕</button>
                        </div>
                        <table className="tabla">
                            <thead>
                                <tr><th>Producto</th><th>Cant.</th><th>P. unitario</th><th>Subtotal</th></tr>
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
                            <span>Total</span>
                            <strong>S/ {detalle.total.toLocaleString("es-PE")}</strong>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Ventas;
