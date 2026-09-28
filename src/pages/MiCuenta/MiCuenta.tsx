import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { leerPedidos } from "../../data/pedidos";
import "../Admin/Admin.css";
import "./MiCuenta.css";

interface Perfil {
    nombre: string;
    correo: string;
    telefono: string;
    documento: string;
    direccion: string;
    ciudad: string;
    miembroDesde: string;
}

const CLAVE_PERFILES = "techstore-perfiles";

// Datos de ejemplo para las cuentas demo (solo frontend)
const PERFILES_DEMO: Record<string, Perfil> = {
    cliente: {
        nombre: "Juan Pérez",
        correo: "juan.perez@gmail.com",
        telefono: "+51 987 654 321",
        documento: "DNI 72849510",
        direccion: "Av. Los Olivos 456, Dpto. 302",
        ciudad: "Lima, Perú",
        miembroDesde: "Marzo 2024",
    },
    admin: {
        nombre: "Luis Fernández",
        correo: "luis.admin@techstore.com",
        telefono: "+51 999 111 222",
        documento: "DNI 45217896",
        direccion: "Av. Garcilaso 1234, Of. 501",
        ciudad: "Lima, Perú",
        miembroDesde: "Enero 2024",
    },
    almacen: {
        nombre: "Carlos Quispe",
        correo: "carlos.almacen@techstore.com",
        telefono: "+51 988 222 333",
        documento: "DNI 63748590",
        direccion: "Av. Garcilaso 1234, Almacén",
        ciudad: "Lima, Perú",
        miembroDesde: "Febrero 2024",
    },
};

function leerPerfil(id: string, nombreSesion: string, acceso: string): Perfil {
    try {
        const todos = JSON.parse(localStorage.getItem(CLAVE_PERFILES) ?? "{}");
        if (todos[id]) return todos[id];
    } catch {
        // Sigue con el perfil por defecto
    }
    if (PERFILES_DEMO[id]) return PERFILES_DEMO[id];
    const fecha = new Date().toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    let direccion = "";
    try {
        const lista = JSON.parse(localStorage.getItem("techstore-usuarios") ?? "[]");
        direccion = lista.find((u: { correo: string }) => u.correo === id)?.direccion ?? "";
    } catch {
        // Se queda vacío y se completa con Editar
    }
    return {
        nombre: nombreSesion,
        correo: acceso,
        telefono: "",
        documento: "",
        direccion,
        ciudad: "",
        miembroDesde: fecha,
    };
}

import type { Usuario } from "../../data/usuarios";

interface MiCuentaDetalleProps {
    usuario: Usuario;
    logout: () => void;
    actualizarNombre: (nombre: string) => void;
}

function MiCuentaDetalle({ usuario, logout, actualizarNombre }: MiCuentaDetalleProps) {
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState<Perfil>(() =>
        leerPerfil(usuario.id, usuario.nombre, usuario.acceso)
    );
    const [editando, setEditando] = useState(false);
    const [guardado, setGuardado] = useState(false);

    const pedidos = leerPedidos().filter((p) => p.usuarioId === usuario.id);

    const totalGastado = pedidos.reduce((acc, p) => acc + p.total, 0);
    const unidades = pedidos.reduce(
        (acc, p) => acc + p.items.reduce((a, it) => a + it.cantidad, 0),
        0
    );
    const ultimoPedido = pedidos[0] ?? null;

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const todos = JSON.parse(localStorage.getItem(CLAVE_PERFILES) ?? "{}");
            todos[usuario.id] = perfil;
            localStorage.setItem(CLAVE_PERFILES, JSON.stringify(todos));
        } catch {
            // Solo queda en memoria
        }
        actualizarNombre(perfil.nombre);
        setEditando(false);
        setGuardado(true);
        setTimeout(() => setGuardado(false), 2500);
    };

    const cambiar = (campo: keyof Perfil, valor: string) =>
        setPerfil((prev) => ({ ...prev, [campo]: valor }));

    const salir = () => {
        logout();
        navigate("/inicio");
    };

    const inicial = perfil.nombre.trim().charAt(0).toUpperCase() || "U";

    return (
        <div className="admin-page">
            <Header />

            <main className="admin-content">
                {/* Saludo */}
                <div className="cuenta-saludo">
                    <div className="cuenta-avatar">{inicial}</div>
                    <div>
                        <h1>Hola, {perfil.nombre.split(" ")[0]}</h1>
                        <p className="admin-muted">
                            Cliente desde {perfil.miembroDesde} · {usuario.rol.toUpperCase()}
                        </p>
                    </div>
                    <button className="btn-sec salir" onClick={salir}>
                        Cerrar sesión
                    </button>
                </div>

                {/* Resumen de actividad */}
                <section className="admin-cards">
                    <div className="admin-card clickable" onClick={() => navigate("/mis-compras")}>
                        <span>Pedidos realizados</span>
                        <strong>{pedidos.length}</strong>
                    </div>
                    <div className="admin-card clickable" onClick={() => navigate("/mis-compras")}>
                        <span>Total gastado</span>
                        <strong>S/ {totalGastado.toLocaleString("es-PE")}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Productos comprados</span>
                        <strong>{unidades}</strong>
                    </div>
                    <div
                        className="admin-card clickable"
                        onClick={() => navigate(usuario.rol === "admin" ? "/admin" : usuario.rol === "almacen" ? "/almacen" : "/productos")}
                    >
                        <span>{usuario.rol === "cliente" ? "Seguir comprando" : "Ir a mi panel"}</span>
                        <strong>→</strong>
                    </div>
                </section>

                <div className="cuenta-grid">
                    {/* Datos personales */}
                    <section className="cuenta-panel">
                        <div className="panel-head">
                            <h2>Datos personales</h2>
                            {!editando && (
                                <button className="btn-link" onClick={() => setEditando(true)}>
                                    Editar
                                </button>
                            )}
                        </div>

                        {editando ? (
                            <form onSubmit={guardar} className="cuenta-form">
                                <label>
                                    Nombre completo
                                    <input value={perfil.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required />
                                </label>
                                <label>
                                    Teléfono
                                    <input value={perfil.telefono} onChange={(e) => cambiar("telefono", e.target.value)} placeholder="+51 ..." />
                                </label>
                                <label>
                                    Documento
                                    <input value={perfil.documento} onChange={(e) => cambiar("documento", e.target.value)} placeholder="DNI ..." />
                                </label>
                                <label>
                                    Dirección
                                    <input value={perfil.direccion} onChange={(e) => cambiar("direccion", e.target.value)} placeholder="Av. ..." />
                                </label>
                                <label>
                                    Ciudad
                                    <input value={perfil.ciudad} onChange={(e) => cambiar("ciudad", e.target.value)} placeholder="Lima, Perú" />
                                </label>
                                <div className="form-acciones">
                                    <button type="submit" className="btn-primary-lg">Guardar</button>
                                    <button type="button" className="btn-sec" onClick={() => setEditando(false)}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <dl className="cuenta-datos">
                                <div><dt>Nombre</dt><dd>{perfil.nombre}</dd></div>
                                <div><dt>Correo</dt><dd>{perfil.correo}</dd></div>
                                <div><dt>Teléfono</dt><dd>{perfil.telefono || "—"}</dd></div>
                                <div><dt>Documento</dt><dd>{perfil.documento || "—"}</dd></div>
                                <div><dt>Dirección</dt><dd>{perfil.direccion || "—"}</dd></div>
                                <div><dt>Ciudad</dt><dd>{perfil.ciudad || "—"}</dd></div>
                            </dl>
                        )}

                        {guardado && <p className="cuenta-ok">Cambios guardados correctamente.</p>}
                    </section>

                    {/* Último pedido */}
                    <section className="cuenta-panel">
                        <div className="panel-head">
                            <h2>Último pedido</h2>
                            {ultimoPedido && (
                                <button className="btn-link" onClick={() => navigate("/mis-compras")}>
                                    Ver todos
                                </button>
                            )}
                        </div>

                        {ultimoPedido ? (
                            <div className="ultimo-pedido">
                                <div className="ultimo-head">
                                    <strong>{ultimoPedido.numero}</strong>
                                    <span>{ultimoPedido.fecha}</span>
                                </div>
                                <ul>
                                    {ultimoPedido.items.slice(0, 3).map((it) => (
                                        <li key={it.id}>
                                            <span>{it.nombre}</span>
                                            <span>x{it.cantidad}</span>
                                        </li>
                                    ))}
                                </ul>
                                {ultimoPedido.items.length > 3 && (
                                    <p className="admin-muted">
                                        +{ultimoPedido.items.length - 3} productos más
                                    </p>
                                )}
                                <strong className="ultimo-total">
                                    S/ {ultimoPedido.total.toLocaleString("es-PE")}
                                </strong>
                            </div>
                        ) : (
                            <p className="admin-muted">
                                Aún no tienes pedidos. Tu última compra aparecerá aquí.
                            </p>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

function MiCuenta() {
    const navigate = useNavigate();
    const { usuario, logout, actualizarNombre } = useAuth();

    if (!usuario) {
        return (
            <div className="admin-page">
                <Header />
                <main className="admin-content">
                    <h1>Mi cuenta</h1>
                    <p className="admin-muted">Inicia sesión para ver tu cuenta.</p>
                    <button className="btn-primary-lg" onClick={() => navigate("/login")}>
                        Ir al login
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <MiCuentaDetalle
            key={usuario.id}
            usuario={usuario}
            logout={logout}
            actualizarNombre={actualizarNombre}
        />
    );
}

export default MiCuenta;
