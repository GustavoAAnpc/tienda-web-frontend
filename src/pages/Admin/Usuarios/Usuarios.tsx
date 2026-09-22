import { useState } from "react";
import { CUENTAS_BASE, obtenerEstado, cambiarEstado, cambiarRolRegistrado } from "../../../context/AuthContext";
import type { Rol } from "../../../context/AuthContext";
import "../Admin.css";
import "./Usuarios.css";

interface FilaUsuario {
    id: string;
    nombre: string;
    acceso: string;
    rol: Rol;
    fecha: string;
    fija: boolean; // cuenta demo del sistema
}

function leerRegistrados(): FilaUsuario[] {
    try {
        const datos = JSON.parse(localStorage.getItem("techstore-usuarios") ?? "[]");
        if (!Array.isArray(datos)) return [];
        return datos.map((u: { nombre: string; correo: string; fechaRegistro?: string; rol?: Rol }) => ({
            id: u.correo,
            nombre: u.nombre,
            acceso: u.correo,
            rol: u.rol ?? "cliente",
            fecha: u.fechaRegistro ?? "—",
            fija: false,
        }));
    } catch {
        return [];
    }
}

function Usuarios() {
    // Lista de usuarios (se recarga cada vez que cambia algo)
    const [lista, setLista] = useState<FilaUsuario[]>(() => [...CUENTAS_BASE, ...leerRegistrados()]);
    const [detalle, setDetalle] = useState<FilaUsuario | null>(null);

    const recargar = () => setLista([...CUENTAS_BASE, ...leerRegistrados()]);

    const toggleEstado = (u: FilaUsuario) => {
        const actual = obtenerEstado(u.id);
        cambiarEstado(u.id, actual === "activo" ? "inactivo" : "activo");
        recargar();
    };

    const cambiarRol = (u: FilaUsuario, rol: Rol) => {
        cambiarRolRegistrado(u.acceso, rol);
        recargar();
    };

    return (
        <>
            <h1>Usuarios</h1>
            <p className="admin-muted">{lista.length} usuarios en el sistema.</p>

            <div className="tabla-wrap">
                <table className="tabla">
                    <thead>
                        <tr><th>Nombre</th><th>Correo / acceso</th><th>Rol</th><th>Estado</th><th>Registro</th><th>Acciones</th></tr>
                    </thead>
                    <tbody>
                        {lista.map((u) => {
                            const estado = obtenerEstado(u.id);
                            return (
                                <tr key={u.id}>
                                    <td>{u.nombre}</td>
                                    <td>{u.acceso}</td>
                                    <td>
                                        {u.fija || u.id === "admin" ? (
                                            <span className={`badge rol-${u.rol}`}>{u.rol}</span>
                                        ) : (
                                            <select
                                                className="rol-select"
                                                value={u.rol}
                                                onChange={(e) => cambiarRol(u, e.target.value as Rol)}
                                            >
                                                <option value="cliente">cliente</option>
                                                <option value="almacen">almacen</option>
                                                <option value="admin">admin</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${estado === "activo" ? "ok" : "off"}`}>
                                            {estado === "activo" ? "Activo" : "Inactivo"}
                                        </span>
                                    </td>
                                    <td>{u.fecha}</td>
                                    <td>
                                        <span className="acciones">
                                            <button className="btn-mini" onClick={() => setDetalle(u)}>Ver</button>
                                            {u.id !== "admin" && (
                                                <button className="btn-mini sec" onClick={() => toggleEstado(u)}>
                                                    {estado === "activo" ? "Desactivar" : "Activar"}
                                                </button>
                                            )}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {detalle && (
                <div className="modal-fondo" onClick={() => setDetalle(null)}>
                    <div className="modal-chico" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-head">
                            <h2>{detalle.nombre}</h2>
                            <button className="modal-cerrar" onClick={() => setDetalle(null)}>✕</button>
                        </div>
                        <dl className="user-datos">
                            <div><dt>Acceso</dt><dd>{detalle.acceso}</dd></div>
                            <div><dt>Rol</dt><dd>{detalle.rol}</dd></div>
                            <div><dt>Estado</dt><dd>{obtenerEstado(detalle.id)}</dd></div>
                            <div><dt>Registro</dt><dd>{detalle.fecha}</dd></div>
                            <div><dt>Tipo</dt><dd>{detalle.fija ? "Cuenta del sistema" : "Registrado en la tienda"}</dd></div>
                        </dl>
                    </div>
                </div>
            )}
        </>
    );
}

export default Usuarios;
