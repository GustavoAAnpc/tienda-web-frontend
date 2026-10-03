import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Contactanos.css";

function Contactanos() {
    // Formulario solo frontend: guarda los campos y muestra confirmación
    const [nombre, setNombre] = useState("");
    const [correo, setCorreo] = useState("");
    const [asunto, setAsunto] = useState("Consulta general");
    const [mensaje, setMensaje] = useState("");
    const [enviado, setEnviado] = useState(false);

    const enviar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nombre.trim() || !correo.trim() || !mensaje.trim()) return;
        setEnviado(true);
    };

    return (
        <div className="contacto-page">
            <Header />

            <main className="contacto-content">
                <div className="contacto-header">
                    <h1>Contáctanos</h1>
                    <p>Escríbenos por cualquier consulta sobre productos, stock o tu compra.</p>
                </div>

                <div className="contacto-grid">
                    {/* Columna de información */}
                    <section className="contacto-info">
                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <path d="m22 7-10 6L2 7" />
                                </svg>
                            </div>
                            <div>
                                <strong>Correo</strong>
                                <span>contacto@techstore.com</span>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                                </svg>
                            </div>
                            <div>
                                <strong>Teléfono / WhatsApp</strong>
                                <span>+51 999 888 777</span>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <div>
                                <strong>Tienda y Almacén</strong>
                                <span>Av. Próceres de la Independencia 2450, San Juan de Lurigancho, Lima – Perú</span>
                            </div>
                        </div>

                        <div className="info-card">
                            <div className="info-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <div>
                                <strong>Horario de atención</strong>
                                <span>Lunes a Viernes, 9:00 a. m. – 6:00 p. m.</span>
                            </div>
                        </div>
                    </section>

                    {/* Formulario */}
                    <section className="contacto-form-card">
                        {enviado ? (
                            <div className="form-exito">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                                <h3>Mensaje enviado</h3>
                                <p>Gracias {nombre}, te responderemos a {correo} lo antes posible.</p>
                                <button onClick={() => { setEnviado(false); setNombre(""); setCorreo(""); setMensaje(""); }}>
                                    Enviar otro mensaje
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={enviar}>
                                <h2>Escríbenos</h2>

                                <label>
                                    Nombre
                                    <input
                                        type="text"
                                        placeholder="Tu nombre"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Correo
                                    <input
                                        type="email"
                                        placeholder="tucorreo@ejemplo.com"
                                        value={correo}
                                        onChange={(e) => setCorreo(e.target.value)}
                                        required
                                    />
                                </label>

                                <label>
                                    Asunto
                                    <select value={asunto} onChange={(e) => setAsunto(e.target.value)}>
                                        <option>Consulta general</option>
                                        <option>Stock de un producto</option>
                                        <option>Estado de mi compra</option>
                                        <option>Garantía y devoluciones</option>
                                    </select>
                                </label>

                                <label>
                                    Mensaje
                                    <textarea
                                        placeholder="¿En qué te ayudamos?"
                                        rows={5}
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        required
                                    />
                                </label>

                                <button type="submit" className="btn-enviar">
                                    Enviar mensaje
                                </button>
                            </form>
                        )}
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default Contactanos;
