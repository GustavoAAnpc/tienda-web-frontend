import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AdminLayout.css";

// Estructura del área de Administrador: barra lateral + contenido.
// Las secciones (Dashboard, Ventas, Productos, Usuarios, Reportes) se muestran en <Outlet />.
function AdminLayout() {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();

    // Solo el admin puede entrar aquí
    if (!usuario || usuario.rol !== "admin") {
        return (
            <div className="admin-denegado">
                <h1>Acceso denegado</h1>
                <p>Ingresa con la cuenta admin / 123.</p>
                <button onClick={() => navigate("/login")}>Ir al login</button>
            </div>
        );
    }

    const salir = () => {
        logout();
        navigate("/inicio");
    };

    return (
        <div className="admin-shell">
            {/* Barra lateral */}
            <aside className="admin-sidebar">
                <button className="admin-marca" onClick={() => navigate("/inicio")}>
                    <span className="admin-marca-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </span>
                    <span>TechStore</span>
                </button>

                <span className="admin-seccion">ADMINISTRACIÓN</span>

                <nav className="admin-nav">
                    <NavLink to="/admin" end>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1" />
                            <rect x="14" y="3" width="7" height="7" rx="1" />
                            <rect x="3" y="14" width="7" height="7" rx="1" />
                            <rect x="14" y="14" width="7" height="7" rx="1" />
                        </svg>
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/ventas">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                        </svg>
                        Ventas
                    </NavLink>
                    <NavLink to="/admin/productos">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
                            <line x1="3" y1="8" x2="12" y2="13" />
                            <line x1="12" y1="13" x2="21" y2="8" />
                            <line x1="12" y1="13" x2="12" y2="21" />
                        </svg>
                        Productos
                    </NavLink>
                    <NavLink to="/admin/usuarios">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                        Usuarios
                    </NavLink>
                    <NavLink to="/admin/reportes">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Reportes
                    </NavLink>
                </nav>

                <span className="admin-seccion">TIENDA</span>

                <nav className="admin-nav">
                    <NavLink to="/inicio">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        Ver tienda
                    </NavLink>
                </nav>
            </aside>

            {/* Contenido */}
            <div className="admin-main">
                <header className="admin-topbar">
                    <strong>Panel Administrador</strong>
                    <div className="admin-usuario">
                        <button className="btn-icono" onClick={() => navigate("/mi-cuenta")} title="Mi cuenta">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </button>
                        <button className="btn-icono" onClick={salir} title="Cerrar sesión">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="admin-contenido">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;
