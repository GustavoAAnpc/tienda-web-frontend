import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { useAuth } from "../../context/AuthContext";
import { leerPedidos } from "../../data/pedidos";
import type { Usuario } from "../../data/usuarios";

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
        nombre: "Gustavo Blas Asto",
        correo: "admin@techstore.com",
        telefono: "+51 999 111 222",
        documento: "Código U22300144",
        direccion: "Av. Próceres de la Independencia 2450",
        ciudad: "San Juan de Lurigancho, Lima",
        miembroDesde: "2026",
    },
    almacen: {
        nombre: "Diego Armando Caire Quino",
        correo: "almacen@techstore.com",
        telefono: "+51 988 222 333",
        documento: "Código U23231103",
        direccion: "Av. Próceres de la Independencia 2450, Almacén Central",
        ciudad: "San Juan de Lurigancho, Lima",
        miembroDesde: "2026",
    },
};

function leerPerfil(id: string, nombreSesion: string, acceso: string): Perfil {
    try {
        const todos = JSON.parse(localStorage.getItem(CLAVE_PERFILES) ?? "{}");
        if (todos[id]) return todos[id];
    } catch {
        // Fallback
    }
    if (PERFILES_DEMO[id]) return PERFILES_DEMO[id];
    const fecha = new Date().toLocaleDateString("es-PE", { month: "long", year: "numeric" });
    let direccion = "";
    try {
        const lista = JSON.parse(localStorage.getItem("techstore-usuarios") ?? "[]");
        direccion = lista.find((u: { correo: string }) => u.correo === id)?.direccion ?? "";
    } catch {
        // No hay
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
    const unidades = pedidos.reduce((acc, p) => acc + p.items.reduce((a, it) => a + it.cantidad, 0), 0);
    const ultimoPedido = pedidos[0] ?? null;

    const guardar = (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const todos = JSON.parse(localStorage.getItem(CLAVE_PERFILES) ?? "{}");
            todos[usuario.id] = perfil;
            localStorage.setItem(CLAVE_PERFILES, JSON.stringify(todos));
        } catch {
            // En memoria
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
    const inputClass =
        "w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500";

    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <Header />

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 space-y-6">
                {/* Saludo y Avatar */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md">
                            {inicial}
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 dark:text-white">Hola, {perfil.nombre.split(" ")[0]}</h1>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Miembro desde {perfil.miembroDesde} · <span className="font-bold uppercase text-blue-600 dark:text-blue-400">{usuario.rol}</span>
                            </p>
                        </div>
                    </div>
                    <button
                        className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
                        onClick={salir}
                    >
                        Cerrar sesión
                    </button>
                </div>

                {/* Resumen de actividad */}
                <section className="admin-cards grid-cols-2 md:grid-cols-4">
                    <div className="admin-card cursor-pointer" onClick={() => navigate("/mis-compras")}>
                        <span>Pedidos realizados</span>
                        <strong>{pedidos.length}</strong>
                    </div>
                    <div className="admin-card cursor-pointer" onClick={() => navigate("/mis-compras")}>
                        <span>Total compras</span>
                        <strong>S/ {totalGastado.toLocaleString("es-PE")}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Items adquiridos</span>
                        <strong>{unidades}</strong>
                    </div>
                    <div
                        className="admin-card cursor-pointer hover:border-blue-500"
                        onClick={() => navigate(usuario.rol === "admin" ? "/admin" : usuario.rol === "almacen" ? "/almacen" : "/productos")}
                    >
                        <span>{usuario.rol === "cliente" ? "Explorar tienda" : "Ir a mi panel"}</span>
                        <strong className="text-blue-600 dark:text-blue-400">→</strong>
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Datos personales */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-base font-bold">Datos personales</h2>
                            {!editando && (
                                <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => setEditando(true)}>
                                    Editar
                                </button>
                            )}
                        </div>

                        {editando ? (
                            <form onSubmit={guardar} className="space-y-3.5">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Nombre completo</label>
                                    <input className={inputClass} value={perfil.nombre} onChange={(e) => cambiar("nombre", e.target.value)} required />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Teléfono</label>
                                    <input className={inputClass} value={perfil.telefono} onChange={(e) => cambiar("telefono", e.target.value)} placeholder="+51 987654321" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Documento (DNI/RUC)</label>
                                    <input className={inputClass} value={perfil.documento} onChange={(e) => cambiar("documento", e.target.value)} placeholder="72345678" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Dirección</label>
                                    <input className={inputClass} value={perfil.direccion} onChange={(e) => cambiar("direccion", e.target.value)} placeholder="Av. Los Olivos 123" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-500">Ciudad</label>
                                    <input className={inputClass} value={perfil.ciudad} onChange={(e) => cambiar("ciudad", e.target.value)} placeholder="Lima, Perú" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="submit" className="btn-mini">Guardar</button>
                                    <button type="button" className="btn-mini sec" onClick={() => setEditando(false)}>Cancelar</button>
                                </div>
                            </form>
                        ) : (
                            <dl className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Nombre</dt><dd className="font-semibold">{perfil.nombre}</dd></div>
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Correo</dt><dd className="font-mono">{perfil.correo}</dd></div>
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Teléfono</dt><dd>{perfil.telefono || "—"}</dd></div>
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Documento</dt><dd>{perfil.documento || "—"}</dd></div>
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Dirección</dt><dd>{perfil.direccion || "—"}</dd></div>
                                <div className="py-2.5 flex justify-between"><dt className="text-slate-500">Ciudad</dt><dd>{perfil.ciudad || "—"}</dd></div>
                            </dl>
                        )}

                        {guardado && <p className="text-xs text-emerald-600 font-semibold">Cambios guardados correctamente.</p>}
                    </section>

                    {/* Último pedido */}
                    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-base font-bold">Último pedido</h2>
                            {ultimoPedido && (
                                <button className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer" onClick={() => navigate("/mis-compras")}>
                                    Ver todos →
                                </button>
                            )}
                        </div>

                        {ultimoPedido ? (
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs">
                                    <strong className="font-mono text-blue-600 dark:text-blue-400">{ultimoPedido.numero}</strong>
                                    <span className="text-slate-400">{ultimoPedido.fecha}</span>
                                </div>
                                <ul className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                                    {ultimoPedido.items.slice(0, 3).map((it) => (
                                        <li key={it.id} className="py-2 flex justify-between">
                                            <span className="font-medium truncate max-w-[220px]">{it.nombre}</span>
                                            <span className="text-slate-500">x{it.cantidad}</span>
                                        </li>
                                    ))}
                                </ul>
                                {ultimoPedido.items.length > 3 && (
                                    <p className="text-[11px] text-slate-400">+{ultimoPedido.items.length - 3} productos más</p>
                                )}
                                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                    <span className="text-xs font-bold uppercase text-slate-500">Total</span>
                                    <strong className="font-mono text-lg font-black text-slate-900 dark:text-white">
                                        S/ {ultimoPedido.total.toLocaleString("es-PE")}
                                    </strong>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 py-6 text-center">
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
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
                <Header />
                <main className="flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4">
                    <h1 className="text-2xl font-black">Mi cuenta</h1>
                    <p className="text-sm text-slate-500">Inicia sesión para gestionar tu cuenta.</p>
                    <button
                        className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                        onClick={() => navigate("/login")}
                    >
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
