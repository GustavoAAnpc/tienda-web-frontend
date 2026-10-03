import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {

    const navigate = useNavigate();

    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-content">

                    {/* =========================
                        MARCA
                       ========================= */}

                    <div className="footer-brand">

                        <button
                            className="footer-logo"
                            onClick={() => navigate("/inicio")}
                        >

                            <div className="footer-logo-icon">

                                <svg
                                    width="15"
                                    height="15"
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

                        <p>
                            Tu tienda minorista de tecnología en San Juan de Lurigancho:
                            laptops, pantallas, audífonos y periféricos con control de
                            inventarios y trazabilidad con Kardex.
                        </p>

                    </div>


                    {/* =========================
                        TIENDA
                       ========================= */}

                    <div className="footer-column">

                        <h3>Tienda</h3>

                        <ul>

                            <li>
                                <button
                                    onClick={() => navigate("/inicio")}
                                >
                                    Inicio
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => navigate("/productos")}
                                >
                                    Productos
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => navigate("/productos")}
                                >
                                    Categorías
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => navigate("/carrito")}
                                >
                                    Carrito
                                </button>
                            </li>

                        </ul>

                    </div>


                    {/* =========================
                        AYUDA
                       ========================= */}

                    <div className="footer-column">

                        <h3>Ayuda</h3>

                        <ul>

                            <li>
                                <button>
                                    Preguntas frecuentes
                                </button>
                            </li>

                            <li>
                                <button>
                                    Métodos de pago
                                </button>
                            </li>

                            <li>
                                <button>
                                    Envíos y entregas
                                </button>
                            </li>

                            <li>
                                <button
                                    onClick={() => navigate("/contactanos")}
                                >
                                    Contáctanos
                                </button>
                            </li>

                        </ul>

                    </div>


                    {/* =========================
                        CONTACTO
                       ========================= */}

                    <div className="footer-column">

                        <h3>Contacto</h3>

                        <ul className="footer-contact">

                            <li>
                                <span className="footer-contact-label">
                                    Ubicación
                                </span>

                                <span>
                                    San Juan de Lurigancho, Lima
                                </span>
                            </li>

                            <li>
                                <span className="footer-contact-label">
                                    Correo
                                </span>

                                <span>
                                    contacto@techstore.com
                                </span>
                            </li>

                            <li>
                                <span className="footer-contact-label">
                                    Atención
                                </span>

                                <span>
                                    Lunes a Sábado
                                </span>
                            </li>

                            <li>
                                <span className="footer-contact-label">
                                    Horario
                                </span>

                                <span>
                                    9:00 a. m. – 7:00 p. m.
                                </span>
                            </li>

                        </ul>

                    </div>

                </div>


                {/* =========================
                    PARTE INFERIOR
                   ========================= */}

                <div className="footer-bottom">

                    <span>
                        © 2026 TechStore — Proyecto Desarrollo Full Stack (UTP - San Juan de Lurigancho).
                    </span>

                    <div className="footer-bottom-links">

                        <button>
                            Términos y condiciones
                        </button>

                        <button>
                            Política de privacidad
                        </button>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;

