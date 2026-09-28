import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import "./Registro.css";

function Registro() {
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [correo, setCorreo] = useState("");
    const [direccion, setDireccion] = useState("");
    const [password, setPassword] = useState("");
    const [confirmar, setConfirmar] = useState("");
    const [verPass, setVerPass] = useState(false);
    const [terminos, setTerminos] = useState(false);
    const [error, setError] = useState("");
    const [creada, setCreada] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    // Fuerza de contraseña: 0-4 puntos (largo, número, mayúscula, símbolo)
    const fuerza = [
        password.length >= 8,
        /\d/.test(password),
        /[A-Z]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;

    const etiquetaFuerza = ["", "Débil", "Media", "Buena", "Fuerte"][fuerza];

    function registrarse(e: FormEvent) {
        e.preventDefault();
        setError("");

        if (nombre.trim().length < 2) {
            setError("Ingresa tu nombre");
            return;
        }
        if (apellido.trim().length < 2) {
            setError("Ingresa tu apellido");
            return;
        }
        if (!correo.includes("@") || !correo.includes(".")) {
            setError("Ingresa un correo válido");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }
        if (password !== confirmar) {
            setError("Las contraseñas no coinciden");
            return;
        }
        if (!terminos) {
            setError("Acepta los términos y condiciones");
            return;
        }

        // Solo frontend: guarda el usuario (con contraseña) en el navegador
        const guardados = JSON.parse(localStorage.getItem("techstore-usuarios") ?? "[]");
        if (guardados.some((u: { correo: string }) => u.correo.toLowerCase() === correo.trim().toLowerCase())) {
            setError("Ese correo ya está registrado, inicia sesión");
            return;
        }
        guardados.push({ nombre: `${nombre.trim()} ${apellido.trim()}`, apellido: apellido.trim(), correo: correo.trim(), direccion: direccion.trim(), password, fechaRegistro: new Date().toLocaleDateString("es-PE") });
        localStorage.setItem("techstore-usuarios", JSON.stringify(guardados));
        login(correo.trim(), password);
        setCreada(true);
    }

    return (
        <div className="registro-container">
            <div className="registro-theme-toggle">
                <ThemeToggle />
            </div>
            {/* Lado izquierdo - Beneficios */}
            <div className="registro-image-section">
                <img
                    src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop"
                    alt="Tecnología TechStore"
                    className="registro-image"
                />

                <div className="registro-image-overlay">
                    <h2>Únete a TechStore</h2>
                    <p>
                        Crea tu cuenta y compra smartphones, audio,
                        periféricos y accesorios en un solo lugar.
                    </p>

                    <ul className="registro-beneficios">
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Envío gratis desde S/ 499
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Pago 100% seguro
                        </li>
                        <li>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Garantía en todos los productos
                        </li>
                    </ul>
                </div>
            </div>

            {/* Lado derecho - Formulario */}
            <div className="registro-form-section">
                <div className="registro-wrapper">
                    <div className="registro-header">
                        <button className="registro-logo" onClick={() => navigate("/inicio")}>
                            <div className="registro-logo-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="20" height="14" rx="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                            </div>
                            <span className="registro-logo-text">TechStore</span>
                        </button>

                        <h1 className="registro-title">Crear cuenta</h1>
                        <p className="registro-subtitle">Empieza a comprar en minutos</p>
                    </div>

                    <div className="registro-card">
                        {creada ? (
                            <div className="registro-exito">
                                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <h3>¡Cuenta creada, {nombre.split(" ")[0]}!</h3>
                                <p>Ya puedes entrar a la tienda y armar tu carrito.</p>
                                <button
                                    className="registro-button"
                                    onClick={() => navigate("/inicio")}
                                >
                                    Entrar a la tienda
                                </button>
                            </div>
                        ) : (
                            <form className="registro-form" onSubmit={registrarse}>
                                <div className="registro-doble">
                                    <div className="registro-field">
                                        <label className="registro-label">Nombre</label>
                                        <input
                                            className="registro-input"
                                            type="text"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            placeholder="Juan"
                                        />
                                    </div>

                                    <div className="registro-field">
                                        <label className="registro-label">Apellido</label>
                                        <input
                                            className="registro-input"
                                            type="text"
                                            value={apellido}
                                            onChange={(e) => setApellido(e.target.value)}
                                            placeholder="Pérez"
                                        />
                                    </div>
                                </div>

                                <div className="registro-field">
                                    <label className="registro-label">Correo electrónico</label>
                                    <input
                                        className="registro-input"
                                        type="email"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                    />
                                </div>

                                <div className="registro-field">
                                    <label className="registro-label">Dirección</label>
                                    <input
                                        className="registro-input"
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        placeholder="Av. Los Olivos 456"
                                    />
                                </div>

                                <div className="registro-field">
                                    <label className="registro-label">Contraseña</label>
                                    <div className="registro-pass-wrap">
                                        <input
                                            className="registro-input"
                                            type={verPass ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                        />
                                        <button
                                            type="button"
                                            className="registro-ver"
                                            onClick={() => setVerPass((v) => !v)}
                                        >
                                            {verPass ? "Ocultar" : "Ver"}
                                        </button>
                                    </div>

                                    {password && (
                                        <div className="fuerza">
                                            <div className="fuerza-barra">
                                                {[1, 2, 3, 4].map((n) => (
                                                    <span
                                                        key={n}
                                                        className={`fuerza-seg ${n <= fuerza ? `nivel-${fuerza}` : ""}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className={`fuerza-texto nivel-${fuerza}`}>
                                                {etiquetaFuerza}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="registro-field">
                                    <label className="registro-label">Confirmar contraseña</label>
                                    <input
                                        className="registro-input"
                                        type={verPass ? "text" : "password"}
                                        value={confirmar}
                                        onChange={(e) => setConfirmar(e.target.value)}
                                        placeholder="Repite tu contraseña"
                                    />
                                </div>

                                <label className="registro-terminos">
                                    <input
                                        type="checkbox"
                                        checked={terminos}
                                        onChange={(e) => setTerminos(e.target.checked)}
                                    />
                                    Acepto los términos y condiciones
                                </label>

                                {error && <p className="registro-error">{error}</p>}

                                <button type="submit" className="registro-button">
                                    Crear cuenta
                                </button>
                            </form>
                        )}

                        <div className="registro-login">
                            <p className="registro-login-text">
                                ¿Ya tienes cuenta?{" "}
                                <button
                                    className="registro-login-button"
                                    onClick={() => navigate("/login")}
                                >
                                    Iniciar sesión
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;
