import { useState } from "react";
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { Rol } from "../../context/AuthContext";
import "./Login.css";

// A dónde va cada rol después de ingresar
const RUTA_POR_ROL: Record<Rol, string> = {
    admin: "/admin",
    almacen: "/almacen",
    cliente: "/inicio",
};

function Login() {
    const [acceso, setAcceso] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useAuth();

    function iniciarSesion(e: SubmitEvent) {
        e.preventDefault();
        setError("");

        if (acceso.trim() === "") {
            setError("Ingresa tu usuario o correo");
            return;
        }
        if (password === "") {
            setError("Ingresa tu contraseña");
            return;
        }

        const res = login(acceso, password);
        if (!res.ok || !res.usuario) {
            setError(res.error ?? "No se pudo iniciar sesión");
            return;
        }

        // Redirige según el rol del usuario que acaba de ingresar
        navigate(RUTA_POR_ROL[res.usuario.rol]);
    }

    // Rellena el formulario con una cuenta demo
    function usarDemo(usuario: string) {
        setAcceso(usuario);
        setPassword("123");
        setError("");
    }

    return (
        <div className="login-container">

            {/* Lado izquierdo - Imagen */}
            <div className="login-image-section">

                <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                    alt="Imagen de la tienda"
                    className="login-image"
                />

                <div className="login-image-overlay">
                    <h2>TechStore</h2>

                    <p>
                        Tu tienda de tecnología: smartphones, audio,
                        periféricos y accesorios en un solo lugar.
                    </p>
                </div>

            </div>

            {/* Lado derecho - Login */}
            <div className="login-form-section">

                <div className="login-wrapper">

                    {/* Logo */}
                    <div className="login-header">

                        <button
                            className="login-logo"
                            onClick={() => navigate("/inicio")}
                        >
                            <div className="login-logo-icon">
                                <svg
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

                            <span className="login-logo-text">
                                TechStore
                            </span>
                        </button>

                        <h1 className="login-title">
                            Iniciar sesión
                        </h1>

                        <p className="login-subtitle">
                            Bienvenido de vuelta
                        </p>

                    </div>

                    {/* Tarjeta */}
                    <div className="login-card">

                        <form
                            className="login-form"
                            onSubmit={iniciarSesion}
                        >

                            {/* Usuario o correo */}
                            <div className="login-field">

                                <label className="login-label">
                                    Usuario o correo
                                </label>

                                <input
                                    className="login-input"
                                    type="text"
                                    value={acceso}
                                    onChange={(e) =>
                                        setAcceso(e.target.value)
                                    }
                                    placeholder="admin, almacen o tu correo"
                                />

                            </div>

                            {/* Contraseña */}
                            <div className="login-field">

                                <div className="login-password-header">

                                    <label className="login-label">
                                        Contraseña
                                    </label>

                                </div>

                                <input
                                    className="login-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="••••••••"
                                />

                            </div>

                            {error && (
                                <p className="login-error">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="login-button"
                            >
                                Iniciar sesión
                            </button>

                        </form>

                        {/* Cuentas demo */}
                        <div className="login-demo">
                            <p className="login-demo-title">
                                Cuentas de prueba (clic para usar)
                            </p>
                            <div className="login-demo-grid">
                                <button type="button" onClick={() => usarDemo("admin")}>
                                    Admin / 123
                                </button>
                                <button type="button" onClick={() => usarDemo("almacen")}>
                                    Almacén / 123
                                </button>
                                <button type="button" onClick={() => usarDemo("cliente")}>
                                    Cliente / 123
                                </button>
                            </div>
                        </div>

                        <div className="login-register">

                            <p className="login-register-text">
                                ¿No tienes cuenta?{" "}

                                <button
                                    className="login-register-button"
                                    onClick={() => navigate("/register")}
                                >
                                    Registrarse
                                </button>
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;
