import { useEffect, useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import "./Kardex.css";

function fechaCorta(iso: string) {
    const d = new Date(iso);
    const dia = String(d.getDate()).padStart(2, "0");
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    return `${dia}/${mes}`;
}

// yyyy-mm-dd para comparar con los inputs de fecha
function diaISO(iso: string) {
    return iso.slice(0, 10);
}

function Kardex() {
    const { productos, movimientos } = useInventario();

    const [producto, setProducto] = useState("Todos");
    const [tipo, setTipo] = useState("Todos");
    const [desde, setDesde] = useState("");
    const [hasta, setHasta] = useState("");

    // Paginación: 8 filas por página para no alargar la página
    const POR_PAGINA = 8;
    const [pagina, setPagina] = useState(1);

    const filtrados = movimientos.filter((m) => {
        if (producto !== "Todos" && m.producto !== producto) return false;
        if (tipo !== "Todos" && m.tipo !== tipo) return false;
        if (desde && diaISO(m.fecha) < desde) return false;
        if (hasta && diaISO(m.fecha) > hasta) return false;
        return true;
    });

    const limpiar = () => {
        setProducto("Todos");
        setTipo("Todos");
        setDesde("");
        setHasta("");
        setPagina(1);
    };

    // Si cambian los filtros, vuelve a la primera página
    useEffect(() => {
        setPagina(1);
    }, [producto, tipo, desde, hasta]);

    const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
    const paginaActual = Math.min(pagina, totalPaginas);
    const visibles = filtrados.slice((paginaActual - 1) * POR_PAGINA, paginaActual * POR_PAGINA);

    // Resumen según los filtros aplicados
    const totalEntradas = filtrados.filter((m) => m.tipo === "Entrada").length;
    const totalSalidas = filtrados.filter((m) => m.tipo === "Salida").length;

    return (
        <>
            <h1>Kardex</h1>

            <div className="kardex-filtros">
                <select value={producto} onChange={(e) => setProducto(e.target.value)}>
                    <option>Todos</option>
                    {productos.map((p) => (
                        <option key={p.id} value={p.nombre}>
                            {p.nombre}
                        </option>
                    ))}
                </select>

                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option>Todos</option>
                    <option>Entrada</option>
                    <option>Salida</option>
                </select>

                <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
                <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />

                <button className="btn-limpiar" onClick={limpiar}>
                    Limpiar
                </button>
            </div>

            <div className="kardex-resumen">
                <span className="chip in">Entradas: {totalEntradas}</span>
                <span className="chip out">Salidas: {totalSalidas}</span>
                <span className="chip total">Total: {filtrados.length}</span>
            </div>

            <div className="tabla-wrap kardex-grande">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Cantidad</th>
                            <th>Stock anterior</th>
                            <th>Stock actual</th>
                            <th>Motivo</th>
                            <th>Usuario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {visibles.map((m) => (
                            <tr key={m.id}>
                                <td>{fechaCorta(m.fecha)}</td>
                                <td>{m.producto}</td>
                                <td>
                                    <span className={`pill-tipo ${m.tipo === "Entrada" ? "in" : "out"}`}>
                                        {m.tipo === "Entrada" ? "↑" : "↓"} {m.tipo}
                                    </span>
                                </td>
                                <td className={m.tipo === "Entrada" ? "cant-in" : "cant-out"}>
                                    {m.cantidad}
                                </td>
                                <td>{m.stockAnterior}</td>
                                <td>{m.stockNuevo}</td>
                                <td>{m.motivo}</td>
                                <td>{m.usuario}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtrados.length === 0 && (
                    <p className="tabla-vacia">Sin movimientos para esos filtros.</p>
                )}
            </div>

            {/* Paginación */}
            {filtrados.length > 0 && (
                <div className="paginacion">
                    <span className="pag-info">
                        Página {paginaActual} de {totalPaginas} · {filtrados.length} movimientos
                    </span>
                    <div className="pag-botones">
                        <button disabled={paginaActual === 1} onClick={() => setPagina(paginaActual - 1)}>
                            ‹
                        </button>
                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
                            <button
                                key={n}
                                className={n === paginaActual ? "activo" : ""}
                                onClick={() => setPagina(n)}
                            >
                                {n}
                            </button>
                        ))}
                        <button disabled={paginaActual === totalPaginas} onClick={() => setPagina(paginaActual + 1)}>
                            ›
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

export default Kardex;
