import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import { CATEGORIAS } from "../../../data/productos";

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

    const selectClass =
        "px-3 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Catálogo de Productos</h1>
                <p className="text-sm text-slate-500 mt-1">{filtrados.length} productos coincidentes.</p>
            </div>

            {/* Barra de Filtros */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex flex-wrap gap-3 items-center shadow-xs">
                <input
                    className="flex-1 min-w-[200px] px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Buscar producto por nombre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <select className={selectClass} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option>Todas</option>
                    {CATEGORIAS.map((c) => (
                        <option key={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <select className={selectClass} value={estado} onChange={(e) => setEstado(e.target.value)}>
                    <option>Todos</option>
                    <option>Disponible</option>
                    <option>Stock bajo</option>
                    <option>Sin stock</option>
                    <option>Inactivo</option>
                </select>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtrados.map((p) => {
                    const est = estadoDe(p.stock, p.activo);
                    return (
                        <article
                            key={p.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-3"
                        >
                            <div className="h-40 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden flex items-center justify-center p-3">
                                <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain" />
                            </div>
                            <div className="flex flex-col gap-1.5 flex-1">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400">
                                    {p.categoria}
                                </span>
                                <strong className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
                                    {p.nombre}
                                </strong>
                                <span className="font-mono text-base font-extrabold text-slate-900 dark:text-white">
                                    S/ {p.precio.toLocaleString("es-PE")}
                                </span>
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                    <span className="text-xs text-slate-500 font-medium">Stock: {p.stock}</span>
                                    <span className={`badge ${est === "Disponible" ? "ok" : est === "Inactivo" ? "gris" : est === "Sin stock" ? "off" : "pend"}`}>
                                        {est}
                                    </span>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>
            {filtrados.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    No se encontraron productos que coincidan con los filtros seleccionados.
                </div>
            )}
        </div>
    );
}

export default Productos;
