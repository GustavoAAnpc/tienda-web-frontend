import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../context/CarritoContext";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {

    const navigate = useNavigate();
    const { totalItems } = useCarrito();
    const { usuario, logout } = useAuth();

    const salir = () => {
        logout();
        navigate("/inicio");
    };

    return (
        <header className="header">

            <div className="header-container">

                {/* Logo */}
                <button
                    className="header-logo"
                    onClick={() => navigate("/inicio")}
                >
                    <div className="header-logo-icon">

                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                        </svg>

                    </div>

                    <span>TechStore</span>
                </button>


                {/* Navegación */}
                <nav className="header-nav">

                    <button
                        className="header-nav-button active"
                        onClick={() => navigate("/inicio")}
                    >
                        Inicio
                    </button>

                    <button
                        className="header-nav-button"
                        onClick={() => navigate("/productos")}
                    >
                        Productos
                    </button>

                    <button
                        className="header-nav-button"
                        onClick={() => navigate("/contactanos")}
                    >
                        Contáctanos
                    </button>

                    {/* Accesos por rol */}
                    {usuario?.rol === "admin" && (
                        <button
                            className="header-nav-button"
                            onClick={() => navigate("/admin")}
                        >
                            Panel Admin
                        </button>
                    )}

                    {usuario?.rol === "almacen" && (
                        <button
                            className="header-nav-button"
                            onClick={() => navigate("/almacen")}
                        >
                            Almacén
                        </button>
                    )}

                </nav>


                {/* Acciones */}
                <div className="header-actions">

                    {/* Carrito */}
                    <button
                        className="header-cart"
                        onClick={() => navigate("/carrito")}
                        title="Carrito"
                    >

                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle
                                cx="9"
                                cy="21"
                                r="1"
                            />

                            <circle
                                cx="20"
                                cy="21"
                                r="1"
                            />

                            <path
                                d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                            />
                        </svg>

                        {/* Contador */}
                        <span className="cart-count">
                            {totalItems}
                        </span>

                    </button>


                    {/* Sesión: invitado */}
                    {!usuario && (
                        <button
                            className="header-login"
                            onClick={() => navigate("/login")}
                        >

                            <svg
                                width="15"
                                height="15"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path
                                    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                />

                                <circle
                                    cx="12"
                                    cy="7"
                                    r="4"
                                />
                            </svg>

                            Ingresar

                        </button>
                    )}

                    {/* Sesión: usuario identificado */}
                    {usuario && (
                        <>
                            <button
                                className="header-cart"
                                onClick={() => navigate("/mis-compras")}
                                title="Mis compras"
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>

                            </button>

                            <button
                                className="header-cart"
                                onClick={() => navigate("/mi-cuenta")}
                                title={`Mi cuenta (${usuario.nombre})`}
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path
                                        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    />

                                    <circle
                                        cx="12"
                                        cy="7"
                                        r="4"
                                    />
                                </svg>

                            </button>

                            <button
                                className="header-cart"
                                onClick={salir}
                                title="Cerrar sesión"
                            >

                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <polyline points="16 17 21 12 16 7" />
                                    <line x1="21" y1="12" x2="9" y2="12" />
                                </svg>

                            </button>
                        </>
                    )}

                </div>

            </div>

        </header>
    );
}

export default Header;
