import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import { CATEGORIAS } from "../../../data/productos";
import "../Admin.css";
import "./Productos.css";

function Productos() {
    const { productos } = useInventario();

    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [estado, setEstado] = useState("Todos");

    const estadoDe = (stock: number, activo: boolean) =>
        !activo ? "Inactivo" : stock === 0 ? "Sin stock" : stock < 10 ? "Stock bajo" : "Disponible";

    const filtrados = productos.filter((p) => {
        if (categoria !== "Todas" && p.categoria !== categoria) return false;
        if (estado !== "Todos" && estadoDe(p.stock, p.activo) !== estado) return false;
        const q = busqueda.trim().toLowerCase();
        if (q && !p.nombre.toLowerCase().includes(q)) return false;
        return true;
    });

    return (
        <>
            <h1>Productos</h1>

            <div className="prodadm-filtros">
                <input
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option>Todas</option>
                    {CATEGORIAS.map((c) => (
                        <option key={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option>Todos</option>
                    <option>Disponible</option>
                    <option>Stock bajo</option>
                    <option>Sin stock</option>
                    <option>Inactivo</option>
                </select>
            </div>

            <div className="prodadm-grid">
                {filtrados.map((p) => {
                    const est = estadoDe(p.stock, p.activo);
                    return (
                        <article key={p.id} className="prodadm-card">
                            <img src={p.imagen} alt={p.nombre} />
                            <div className="prodadm-info">
                                <span className="prodadm-cat">{p.categoria}</span>
                                <strong>{p.nombre}</strong>
                                <span className="prodadm-precio">S/ {p.precio.toLocaleString("es-PE")}</span>
                                <span className="prodadm-stock">Stock: {p.stock}</span>
                                <span className={`badge ${est === "Disponible" ? "ok" : est === "Inactivo" ? "gris" : est === "Sin stock" ? "off" : "pend"}`}>
                                    {est}
                                </span>
                            </div>
                        </article>
                    );
                })}
            </div>
            {filtrados.length === 0 && <p className="admin-muted">Sin productos para esos filtros.</p>}
        </>
    );
}

export default Productos;
