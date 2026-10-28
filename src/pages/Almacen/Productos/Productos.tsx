import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import type { DatosProducto, ProductoInv } from "../../../context/InventarioContext";
import { CATEGORIAS } from "../../../data/productos";

const IMG_DEFECTO = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop";

type FiltroEstado = "todos" | "disponible" | "bajo" | "sin" | "inactivo";

function estadoDe(p: ProductoInv): string {
    if (!p.activo) return "Inactivo";
    if (p.stock === 0) return "Sin stock";
    if (p.stock < 10) return "Stock bajo";
    return "Disponible";
}

const VACIO: DatosProducto = {
    nombre: "",
    categoria: CATEGORIAS[0].nombre,
    precio: 0,
    stock: 0,
    imagen: "",
    descripcion: "",
};

function Productos() {
    const { productos, guardarProducto, cambiarActivo } = useInventario();

    const [busqueda, setBusqueda] = useState("");
    const [categoria, setCategoria] = useState("Todas");
    const [estado, setEstado] = useState<FiltroEstado>("todos");

    const [formId, setFormId] = useState<number | null | undefined>(undefined);
    const [form, setForm] = useState<DatosProducto>(VACIO);

    const filtrados = productos.filter((p) => {
        if (categoria !== "Todas" && p.categoria !== categoria) return false;
        if (estado === "disponible" && !(p.activo && p.stock >= 10)) return false;
        if (estado === "bajo" && !(p.activo && p.stock > 0 && p.stock < 10)) return false;
        if (estado === "sin" && !(p.activo && p.stock === 0)) return false;
        if (estado === "inactivo" && p.activo) return false;
        const q = busqueda.trim().toLowerCase();
        if (q && !p.nombre.toLowerCase().includes(q)) return false;
        return true;
    });

    const abrirNuevo = () => {
        setFormId(null);
        setForm(VACIO);
    };

    const abrirEditar = (p: ProductoInv) => {
        setFormId(p.id);
        setForm({
            nombre: p.nombre,
            categoria: p.categoria,
            precio: p.precio,
            stock: p.stock,
            imagen: p.imagen,
            descripcion: p.descripcion,
        });
    };

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nombre.trim() || form.precio < 0 || form.stock < 0) return;
        guardarProducto(formId ?? null, {
            ...form,
            nombre: form.nombre.trim(),
            imagen: form.imagen.trim() || IMG_DEFECTO,
        });
        setFormId(undefined);
    };

    const editando = formId !== undefined ? productos.find((p) => p.id === formId) : undefined;
    const selectClass =
        "px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer";
    const inputClass =
        "w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Inventario de Productos</h1>
                <p className="text-sm text-slate-500 mt-1">Gestión operativa de catálogo, disponibilidad y stock físico.</p>
            </div>

            {/* Toolbar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl flex flex-wrap gap-2.5 items-center shadow-xs">
                <input
                    className="flex-1 min-w-[200px] px-3.5 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <select className={selectClass} value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option>Todas</option>
                    {CATEGORIAS.map((c) => (
                        <option key={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <select className={selectClass} value={estado} onChange={(e) => setEstado(e.target.value as FiltroEstado)}>
                    <option value="todos">Todos los estados</option>
                    <option value="disponible">Disponible</option>
                    <option value="bajo">Stock bajo</option>
                    <option value="sin">Sin stock</option>
                    <option value="inactivo">Inactivos</option>
                </select>
                <button
                    className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer transition-colors"
                    onClick={abrirNuevo}
                >
                    + Nuevo producto
                </button>
            </div>

            <div className="tabla-wrap">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map((p) => (
                            <tr key={p.id} className={p.activo ? "" : "opacity-60 bg-slate-50/50 dark:bg-slate-900/50"}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0">
                                            <img src={p.imagen} alt={p.nombre} className="h-full w-full object-contain" />
                                        </div>
                                        <span className="font-semibold text-xs">{p.nombre}</span>
                                    </div>
                                </td>
                                <td className="text-xs text-slate-500">{p.categoria}</td>
                                <td className="font-mono font-bold text-xs">S/ {p.precio.toLocaleString("es-PE")}</td>
                                <td className="font-mono font-bold text-xs">{p.stock}</td>
                                <td>
                                    <span className={`badge ${!p.activo ? "gris" : p.stock === 0 ? "off" : p.stock < 10 ? "pend" : "ok"}`}>
                                        {estadoDe(p)}
                                    </span>
                                </td>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <button className="btn-mini" onClick={() => abrirEditar(p)}>
                                            Editar
                                        </button>
                                        <button
                                            className="btn-mini sec"
                                            onClick={() => cambiarActivo(p.id, !p.activo)}
                                        >
                                            {p.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtrados.length === 0 && (
                    <div className="text-center py-10 text-sm text-slate-500">
                        Sin productos para los filtros seleccionados.
                    </div>
                )}
            </div>

            {/* Modal nuevo / editar */}
            {formId !== undefined && (
                <div className="modal-fondo" onClick={() => setFormId(undefined)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <h2>{formId === null ? "Nuevo producto" : "Editar producto"}</h2>
                            <button className="modal-cerrar" onClick={() => setFormId(undefined)}>✕</button>
                        </div>

                        {editando && editando.vendidos > 0 && (
                            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-700 dark:text-amber-400">
                                ⚠ Tiene {editando.vendidos} ventas registradas: no se puede eliminar, solo editar o desactivar.
                            </div>
                        )}

                        <form onSubmit={guardar} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Nombre del producto</label>
                                <input className={inputClass} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Categoría</label>
                                    <select className={selectClass + " w-full"} value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                                        {CATEGORIAS.map((c) => (
                                            <option key={c.nombre}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Precio (S/)</label>
                                    <input className={inputClass} type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Stock {formId === null ? "inicial" : "actual"}</label>
                                    <input className={inputClass} type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required disabled={formId !== null} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Imagen (URL)</label>
                                    <input className={inputClass} value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="Vacío = imagen por defecto" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">Descripción</label>
                                <textarea className={inputClass} rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <button type="button" className="btn-mini sec" onClick={() => setFormId(undefined)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer">
                                    {formId === null ? "Crear producto" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Productos;
