import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import type { DatosProducto, ProductoInv } from "../../../context/InventarioContext";
import { CATEGORIAS } from "../../../data/productos";
import "./Productos.css";

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

    // Modal de nuevo / editar (editando null = cerrado, id null = nuevo)
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

    return (
        <>
            <h1>Productos</h1>

            <div className="prod-toolbar">
                <input
                    className="prod-buscar"
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
                <select value={estado} onChange={(e) => setEstado(e.target.value as FiltroEstado)}>
                    <option value="todos">Todos los estados</option>
                    <option value="disponible">Disponible</option>
                    <option value="bajo">Stock bajo</option>
                    <option value="sin">Sin stock</option>
                    <option value="inactivo">Inactivos</option>
                </select>
                <button className="btn-nuevo" onClick={abrirNuevo}>
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
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrados.map((p) => (
                            <tr key={p.id} className={p.activo ? "" : "fila-inactiva"}>
                                <td>
                                    <span className="celda-prod">
                                        <img src={p.imagen} alt={p.nombre} />
                                        {p.nombre}
                                    </span>
                                </td>
                                <td>{p.categoria}</td>
                                <td>S/ {p.precio.toLocaleString("es-PE")}</td>
                                <td>{p.stock}</td>
                                <td>
                                    <span className={`estado-tabla ${!p.activo ? "gris" : p.stock === 0 ? "rojo" : p.stock < 10 ? "amarillo" : "verde"}`}>
                                        {estadoDe(p)}
                                    </span>
                                </td>
                                <td>
                                    <span className="acciones">
                                        <button className="btn-mini" onClick={() => abrirEditar(p)}>
                                            Editar
                                        </button>
                                        <button
                                            className="btn-mini sec"
                                            onClick={() => cambiarActivo(p.id, !p.activo)}
                                        >
                                            {p.activo ? "Desactivar" : "Activar"}
                                        </button>
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtrados.length === 0 && <p className="tabla-vacia">Sin resultados para esos filtros.</p>}
            </div>

            {/* Modal nuevo / editar */}
            {formId !== undefined && (
                <div className="modal-fondo" onClick={() => setFormId(undefined)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{formId === null ? "Nuevo producto" : "Editar producto"}</h2>

                        {editando && editando.vendidos > 0 && (
                            <p className="aviso-historial">
                                Tiene {editando.vendidos} ventas registradas: no se puede eliminar,
                                solo editar o desactivar.
                            </p>
                        )}

                        <form onSubmit={guardar} className="form-prod">
                            <label>
                                Nombre
                                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                            </label>
                            <div className="form-doble">
                                <label>
                                    Categoría
                                    <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })}>
                                        {CATEGORIAS.map((c) => (
                                            <option key={c.nombre}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>
                                    Precio (S/)
                                    <input type="number" min={0} value={form.precio} onChange={(e) => setForm({ ...form, precio: Number(e.target.value) })} required />
                                </label>
                            </div>
                            <div className="form-doble">
                                <label>
                                    Stock {formId === null ? "inicial" : "actual"}
                                    <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} required disabled={formId !== null} />
                                </label>
                                <label>
                                    Imagen (URL)
                                    <input value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} placeholder="Vacío = imagen por defecto" />
                                </label>
                            </div>
                            <label>
                                Descripción
                                <textarea rows={3} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
                            </label>
                            <div className="form-acciones">
                                <button type="button" className="btn-mini sec" onClick={() => setFormId(undefined)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-nuevo">
                                    {formId === null ? "Crear producto" : "Guardar cambios"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default Productos;
