import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AlmacenLayout.css";

// Estructura del área de Almacén: barra lateral + contenido.
// Las subpáginas (Dashboard, Productos, Entradas, Kardex) se muestran en <Outlet />.
function AlmacenLayout() {
    const navigate = useNavigate();
    const { usuario, logout } = useAuth();

    // Solo Almacén y Admin pueden entrar aquí
    if (!usuario || (usuario.rol !== "almacen" && usuario.rol !== "admin")) {
        return (
            <div className="almacen-denegado">
                <h1>Acceso denegado</h1>
                <p>Ingresa con la cuenta almacen / 123.</p>
                <button onClick={() => navigate("/login")}>Ir al login</button>
            </div>
        );
    }

    const salir = () => {
        logout();
        navigate("/inicio");
    };

    return (
        <div className="almacen-shell">
            {/* Barra lateral */}
            <aside className="almacen-sidebar">
                <button className="almacen-marca" onClick={() => navigate("/inicio")}>
                    <span className="almacen-marca-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>
                    </span>
                    <span>TechStore</span>
                </button>

                <span className="almacen-seccion">INVENTARIO</span>

                <nav className="almacen-nav">
                    <NavLink to="/almacen" end>
                        Dashboard
                    </NavLink>
                    <NavLink to="/almacen/productos">
                        Productos
                    </NavLink>
                    <NavLink to="/almacen/entradas">
                        Registrar entrada
                    </NavLink>
                    <NavLink to="/almacen/kardex">
                        Kardex
                    </NavLink>
                </nav>

                <span className="almacen-seccion">TIENDA</span>

                <nav className="almacen-nav">
                    <NavLink to="/inicio">
                        Ver tienda
                    </NavLink>
                </nav>
            </aside>

            {/* Contenido */}
            <div className="almacen-main">
                <header className="almacen-topbar">
                    <strong>Panel de Almacén</strong>
                    <div className="almacen-usuario">
                        <span>{usuario.nombre}</span>
                        <button className="btn-icono" onClick={salir} title="Cerrar sesión">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="almacen-contenido">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AlmacenLayout;
