import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { useCarrito } from "../../context/CarritoContext";
import { useInventario } from "../../context/InventarioContext";
import { useAuth } from "../../context/AuthContext";
import { generarNumeroPedido, guardarPedido } from "../../data/pedidos";
import type { TipoComprobante, MetodoPago, ComprobanteInfo } from "../../data/pedidos";
import { consultarDNI, consultarRUC } from "../../services/sunatApi";
import "./Carrito.css";

// Envío gratis desde este monto, si no, cuesta fijo
const UMBRAL_ENVIO_GRATIS = 499;
const COSTO_ENVIO = 19;

function Carrito() {
    const navigate = useNavigate();
    const { items, cambiarCantidad, quitar, vaciar, subtotal } = useCarrito();
    const { productos, registrarSalida } = useInventario();
    const { usuario } = useAuth();

    // Pedido confirmado (solo frontend): guarda el total y muestra éxito
    const [pedidoOk, setPedidoOk] = useState<string | null>(null);
    const [totalPagado, setTotalPagado] = useState(0);
    const [comprobanteEmitido, setComprobanteEmitido] = useState<ComprobanteInfo | null>(null);

    // Modal de pasarela de pagos y comprobante
    const [mostrarCheckout, setMostrarCheckout] = useState(false);
    const [pasoCheckout, setPasoCheckout] = useState<1 | 2 | 3>(1);

    // Datos de Envío y Contacto (Paso 1)
    const [tipoEntrega, setTipoEntrega] = useState<"envio" | "recojo">("envio");
    const [correoContacto, setCorreoContacto] = useState("");
    const [celularContacto, setCelularContacto] = useState("");
    const [direccionEnvio, setDireccionEnvio] = useState("");
    const [referenciaEnvio, setReferenciaEnvio] = useState("");
    const [distritoEnvio, setDistritoEnvio] = useState("San Juan de Lurigancho");

    // Datos del comprobante (SUNAT / RENIEC)
    const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>("Boleta");
    const [documento, setDocumento] = useState("");
    const [nombreRazonSocial, setNombreRazonSocial] = useState("");
    const [direccionFiscal, setDireccionFiscal] = useState("");
    const [estadoSunat, setEstadoSunat] = useState("");
    const [cargandoApi, setCargandoApi] = useState(false);
    const [errorApi, setErrorApi] = useState<string | null>(null);

    // Datos del método de pago
    const [metodoPago, setMetodoPago] = useState<MetodoPago>("tarjeta");
    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [nombreTitular, setNombreTitular] = useState("");
    const [vencimiento, setVencimiento] = useState("");
    const [cvv, setCvv] = useState("");
    const [codigoYape, setCodigoYape] = useState("");
    const [procesandoPago, setProcesandoPago] = useState(false);

    // Une cada item con los datos actuales del inventario
    const lineas = items
        .map((item) => ({ ...item, producto: productos.find((p) => p.id === item.id)! }))
        .filter((l) => l.producto && l.producto.activo);

    const envioGratis = subtotal >= UMBRAL_ENVIO_GRATIS;
    const costoEnvioActual = tipoEntrega === "recojo" ? 0 : COSTO_ENVIO;
    const envio = lineas.length === 0 || envioGratis ? 0 : costoEnvioActual;
    const total = subtotal + envio;

    // Cálculo tributario SUNAT (18% IGV incluido)
    const baseImponible = Math.round((total / 1.18) * 100) / 100;
    const igv = Math.round((total - baseImponible) * 100) / 100;

    // Barra de progreso hacia el envío gratis
    const progreso = Math.min(100, Math.round((subtotal / UMBRAL_ENVIO_GRATIS) * 100));
    const faltante = UMBRAL_ENVIO_GRATIS - subtotal;

    // Consulta de API SUNAT / RENIEC
    const handleConsultarDocumento = async () => {
        setErrorApi(null);
        setEstadoSunat("");

        if (!documento.trim()) {
            setErrorApi(`Ingresa el número de ${tipoComprobante === "Boleta" ? "DNI" : "RUC"}`);
            return;
        }

        setCargandoApi(true);
        try {
            if (tipoComprobante === "Boleta") {
                const res = await consultarDNI(documento);
                setNombreRazonSocial(res.nombreCompleto);
                setEstadoSunat("IDENTIFICADO (RENIEC)");
            } else {
                const res = await consultarRUC(documento);
                setNombreRazonSocial(res.razonSocial);
                setDireccionFiscal(res.direccion);
                setEstadoSunat(`${res.estado} - ${res.condicion}`);
            }
        } catch (err: unknown) {
            const error = err as Error;
            setErrorApi(error.message || "Error al consultar el documento");
        } finally {
            setCargandoApi(false);
        }
    };

    // Formateadores de inputs de pago
    const handleTarjetaInput = (val: string) => {
        const limpia = val.replace(/\D/g, "").slice(0, 16);
        const formateada = limpia.match(/.{1,4}/g)?.join(" ") || limpia;
        setNumeroTarjeta(formateada);
    };

    const handleVencimientoInput = (val: string) => {
        const limpia = val.replace(/\D/g, "").slice(0, 4);
        if (limpia.length >= 3) {
            setVencimiento(`${limpia.slice(0, 2)}/${limpia.slice(2)}`);
        } else {
            setVencimiento(limpia);
        }
    };

    // Confirmación y procesamiento del pago
    const ejecutarPago = (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombreRazonSocial.trim()) {
            setPasoCheckout(1);
            setErrorApi("Consulta o ingresa el nombre o razón social para emitir tu comprobante");
            return;
        }

        setProcesandoPago(true);

        setTimeout(() => {
            const numero = generarNumeroPedido();
            const fecha = new Date().toLocaleDateString("es-PE");

            const infoComprobante: ComprobanteInfo = {
                tipo: tipoComprobante,
                documento: documento || (tipoComprobante === "Boleta" ? "00000000" : "20000000001"),
                nombreRazonSocial: nombreRazonSocial.trim(),
                direccion: tipoComprobante === "Factura" ? direccionFiscal : undefined,
                subtotal: baseImponible,
                igv,
                total,
            };

            // Venta confirmada: genera la salida automática en Kardex y reduce el stock
            lineas.forEach((l) =>
                registrarSalida(
                    l.producto.id,
                    l.cantidad,
                    `Venta ${numero} (${tipoComprobante})`,
                    usuario?.nombre ?? nombreRazonSocial
                )
            );

            // Guarda el pedido con comprobante y método de pago
            guardarPedido({
                numero,
                fecha,
                usuarioId: usuario?.id ?? "invitado",
                items: lineas.map((l) => ({
                    id: l.producto.id,
                    nombre: l.producto.nombre,
                    precio: l.producto.precio,
                    cantidad: l.cantidad,
                    imagen: l.producto.imagen,
                })),
                total,
                metodoPago,
                comprobante: infoComprobante,
                tipoEntrega,
                estado: "Pendiente"
            });

            setComprobanteEmitido(infoComprobante);
            setTotalPagado(total);
            setPedidoOk(numero);
            setProcesandoPago(false);
            setMostrarCheckout(false);
            vaciar();

            // Mover la vista hacia arriba suavemente para ver el mensaje de éxito
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 1200);
    };

    // Productos sugeridos: los más vendidos que no estén en el carrito
    const sugeridos = productos
        .filter((p) => p.activo && !items.some((i) => i.id === p.id))
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 4);

    return (
        <div className="carrito-page">
            <Header />

            <main className="carrito-content">
                <div className="carrito-header">
                    <h1>Tu carrito</h1>
                    <p>
                        {lineas.length === 0
                            ? "Aún no agregaste productos"
                            : `${lineas.length} producto${lineas.length !== 1 ? "s" : ""} en tu compra`}
                    </p>
                </div>

                {/* ===== Compra confirmada ===== */}
                {pedidoOk ? (
                    <section className="pedido-exito">
                        <div className="exito-icon">
                            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                <polyline points="22 4 12 14.01 9 11.01" />
                            </svg>
                        </div>
                        <h2>¡Pago procesado con éxito!</h2>
                        <p>
                            Pedido <strong>{pedidoOk}</strong> por <strong>S/ {totalPagado.toLocaleString("es-PE")}</strong>.
                            Tu comprobante electrónico ha sido emitido satisfactoriamente.
                        </p>

                        {comprobanteEmitido && (
                            <div className="comprobante-card-exito">
                                <div className="comp-head">
                                    <span className="comp-badge">{comprobanteEmitido.tipo} Electrónica</span>
                                    <span className="comp-ruc">RUC Emisor: 20601234567</span>
                                </div>
                                <div className="comp-cuerpo">
                                    <div><strong>Receptor:</strong> {comprobanteEmitido.nombreRazonSocial}</div>
                                    <div><strong>{comprobanteEmitido.tipo === "Boleta" ? "DNI" : "RUC"}:</strong> {comprobanteEmitido.documento}</div>
                                    {comprobanteEmitido.direccion && (
                                        <div><strong>Dirección:</strong> {comprobanteEmitido.direccion}</div>
                                    )}
                                    <div className="comp-tributos">
                                        <span>Op. Gravada: S/ {comprobanteEmitido.subtotal.toFixed(2)}</span>
                                        <span>IGV (18%): S/ {comprobanteEmitido.igv.toFixed(2)}</span>
                                        <strong className="comp-total">Total: S/ {comprobanteEmitido.total.toFixed(2)}</strong>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="exito-buttons">
                            <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                                Seguir comprando
                            </button>
                            <button className="btn-ghost" onClick={() => navigate("/mis-compras")}>
                                Ver en Mis compras
                            </button>
                        </div>
                    </section>
                ) : lineas.length === 0 ? (
                    /* ===== Carrito vacío ===== */
                    <section className="carrito-vacio">
                        <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="21" r="1" />
                            <circle cx="20" cy="21" r="1" />
                            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                        </svg>
                        <h2>Tu carrito está vacío</h2>
                        <p>Explora el catálogo y encuentra tecnología a buenos precios.</p>
                        <button className="btn-primary-lg" onClick={() => navigate("/productos")}>
                            Ver productos
                        </button>
                    </section>
                ) : (
                    /* ===== Carrito con productos ===== */
                    <>
                        {/* Barra envío gratis */}
                        <section className="envio-bar">
                            <div className="envio-texto">
                                {envioGratis ? (
                                    <span><strong>¡Tienes envío gratis!</strong> Aprovecha tu compra.</span>
                                ) : (
                                    <span>Te faltan <strong>S/ {faltante.toLocaleString("es-PE")}</strong> para el envío gratis</span>
                                )}
                            </div>
                            <div className="envio-progreso">
                                <div className="envio-relleno" style={{ width: `${progreso}%` }} />
                            </div>
                            <span className="envio-porcentaje">{progreso}%</span>
                        </section>

                        <div className="carrito-grid">
                            {/* Lista de productos */}
                            <section className="carrito-lista">
                                {lineas.map(({ producto, cantidad }) => (
                                    <article key={producto.id} className="carrito-item">
                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                            onClick={() => navigate(`/productos/${producto.id}`)}
                                        />
                                        <div className="item-info">
                                            <span className="item-categoria">{producto.categoria}</span>
                                            <h3 onClick={() => navigate(`/productos/${producto.id}`)}>
                                                {producto.nombre}
                                            </h3>
                                            <span className="item-precio-unit">
                                                S/ {producto.precio.toLocaleString("es-PE")} c/u
                                            </span>

                                            <div className="item-acciones">
                                                <div className="stepper">
                                                    <button
                                                        onClick={() => cambiarCantidad(producto.id, cantidad - 1)}
                                                        aria-label="Quitar uno"
                                                    >
                                                        −
                                                    </button>
                                                    <span>{cantidad}</span>
                                                    <button
                                                        onClick={() => cambiarCantidad(producto.id, cantidad + 1)}
                                                        disabled={cantidad >= producto.stock}
                                                        aria-label="Agregar uno"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                                <button
                                                    className="btn-quitar"
                                                    onClick={() => quitar(producto.id)}
                                                >
                                                    Quitar
                                                </button>
                                            </div>

                                            {cantidad >= producto.stock && (
                                                <span className="item-stock-max">
                                                    Stock máximo disponible ({producto.stock})
                                                </span>
                                            )}
                                        </div>
                                        <div className="item-subtotal">
                                            <strong>S/ {(producto.precio * cantidad).toLocaleString("es-PE")}</strong>
                                        </div>
                                    </article>
                                ))}

                                <button className="btn-vaciar" onClick={vaciar}>
                                    Vaciar carrito
                                </button>
                            </section>

                            {/* Resumen */}
                            <aside className="carrito-resumen">
                                <h2>Resumen de compra</h2>
                                <div className="resumen-fila">
                                    <span>Subtotal (Base Imponible)</span>
                                    <span>S/ {baseImponible.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="resumen-fila">
                                    <span>I.G.V. (18%)</span>
                                    <span>S/ {igv.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="resumen-fila">
                                    <span>Envío</span>
                                    <span className={envioGratis ? "gratis" : ""}>
                                        {envioGratis ? "Gratis" : `S/ ${envio}`}
                                    </span>
                                </div>
                                <div className="resumen-total">
                                    <span>Total</span>
                                    <strong>S/ {total.toLocaleString("es-PE", { minimumFractionDigits: 2 })}</strong>
                                </div>

                                <button
                                    className="btn-primary-lg btn-pagar-ahora"
                                    onClick={() => {
                                        setMostrarCheckout(true);
                                        setPasoCheckout(1);
                                    }}
                                >
                                    Continuar al Pago
                                </button>
                                <button className="btn-ghost" onClick={() => navigate("/productos")}>
                                    Seguir comprando
                                </button>

                                <div className="resumen-confianza">
                                    <span>🔒 Facturación Electrónica SUNAT</span>
                                    <span>🛡️ Pago 100% cifrado y seguro</span>
                                </div>
                            </aside>
                        </div>
                    </>
                )}

                {/* ===== MODAL DE PASARELA DE PAGOS Y FACTURACIÓN SUNAT ===== */}
                {mostrarCheckout && (
                    <div className="modal-fondo" onClick={() => setMostrarCheckout(false)}>
                        <div className="modal modal-checkout" onClick={(e) => e.stopPropagation()}>
                            <div className="checkout-head">
                                <div>
                                    <h2>Pasarela de Pago Segura</h2>
                                    <p className="checkout-sub">Emisión electrónica SUNAT & Procesamiento cifrado</p>
                                </div>
                                <button
                                    className="modal-cerrar"
                                    onClick={() => setMostrarCheckout(false)}
                                    aria-label="Cerrar modal"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Pestañas de pasos */}
                            <div className="checkout-tabs checkout-tabs-3">
                                <button
                                    type="button"
                                    className={`tab-btn ${pasoCheckout === 1 ? "activo" : ""}`}
                                    onClick={() => setPasoCheckout(1)}
                                >
                                    1. Envío
                                </button>
                                <button
                                    type="button"
                                    className={`tab-btn ${pasoCheckout === 2 ? "activo" : ""}`}
                                    onClick={() => setPasoCheckout(2)}
                                >
                                    2. Comprobante
                                </button>
                                <button
                                    type="button"
                                    className={`tab-btn ${pasoCheckout === 3 ? "activo" : ""}`}
                                    onClick={() => setPasoCheckout(3)}
                                >
                                    3. Pago
                                </button>
                            </div>

                            <form onSubmit={ejecutarPago} className="checkout-form">
                                {/* ===== PASO 1: DATOS DE ENVÍO Y CONTACTO ===== */}
                                {pasoCheckout === 1 && (
                                    <div className="paso-contenido paso-envio">
                                        {!usuario && (
                                            <div className="checkout-invitado-alerta">
                                                <p><strong>¿Ya tienes una cuenta?</strong> Inicia sesión para guardar tu información y ganar puntos.</p>
                                                <button type="button" className="btn-outline-sm" onClick={() => navigate("/login")}>
                                                    Iniciar Sesión
                                                </button>
                                            </div>
                                        )}

                                        <div className="tipo-comp-selector" style={{ marginBottom: "16px" }}>
                                            <button
                                                type="button"
                                                className={`btn-comp-tipo ${tipoEntrega === "envio" ? "activo" : ""}`}
                                                onClick={() => setTipoEntrega("envio")}
                                            >
                                                <strong>Envío a Domicilio</strong>
                                                <span>A todo San Juan de Lurigancho</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn-comp-tipo ${tipoEntrega === "recojo" ? "activo" : ""}`}
                                                onClick={() => setTipoEntrega("recojo")}
                                            >
                                                <strong>Recojo en Tienda</strong>
                                                <span>Av. Próceres de la Ind. 2450</span>
                                            </button>
                                        </div>

                                        <div className="checkout-campo">
                                            <label>Correo Electrónico *</label>
                                            <input 
                                                type="email" 
                                                placeholder="Ej. usuario@correo.com" 
                                                value={correoContacto}
                                                onChange={(e) => setCorreoContacto(e.target.value)}
                                                required
                                            />
                                        </div>

                                        <div className="checkout-campo">
                                            <label>Teléfono Celular *</label>
                                            <input 
                                                type="tel" 
                                                placeholder="Ej. 999 888 777" 
                                                value={celularContacto}
                                                onChange={(e) => setCelularContacto(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {tipoEntrega === "envio" && (
                                            <>
                                                <div className="checkout-campo">
                                                    <label>Dirección de Envío *</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="Calle, Avenida, Jr." 
                                                        value={direccionEnvio}
                                                        onChange={(e) => setDireccionEnvio(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="checkout-campo-fila">
                                                    <div className="checkout-campo">
                                                        <label>Distrito *</label>
                                                        <input 
                                                            type="text" 
                                                            value={distritoEnvio}
                                                            onChange={(e) => setDistritoEnvio(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="checkout-campo">
                                                        <label>Referencia</label>
                                                        <input 
                                                            type="text" 
                                                            placeholder="Cerca de..." 
                                                            value={referenciaEnvio}
                                                            onChange={(e) => setReferenciaEnvio(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        <div className="checkout-acciones">
                                            <button
                                                type="button"
                                                className="btn-primary-lg"
                                                onClick={() => {
                                                    if (correoContacto && celularContacto && (tipoEntrega === "recojo" || (direccionEnvio && distritoEnvio))) {
                                                        setPasoCheckout(2);
                                                    } else {
                                                        alert("Por favor completa los campos obligatorios de contacto y envío.");
                                                    }
                                                }}
                                            >
                                                Continuar al Comprobante →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ===== PASO 2: DATOS DE FACTURACIÓN SUNAT ===== */}
                                {pasoCheckout === 2 && (
                                    <div className="paso-contenido">
                                        <div className="tipo-comp-selector">
                                            <button
                                                type="button"
                                                className={`btn-comp-tipo ${tipoComprobante === "Boleta" ? "activo" : ""}`}
                                                onClick={() => {
                                                    setTipoComprobante("Boleta");
                                                    setDocumento("");
                                                    setNombreRazonSocial("");
                                                    setEstadoSunat("");
                                                    setErrorApi(null);
                                                }}
                                            >
                                                <strong>Boleta de Venta</strong>
                                                <span>Para persona natural (DNI)</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`btn-comp-tipo ${tipoComprobante === "Factura" ? "activo" : ""}`}
                                                onClick={() => {
                                                    setTipoComprobante("Factura");
                                                    setDocumento("");
                                                    setNombreRazonSocial("");
                                                    setEstadoSunat("");
                                                    setErrorApi(null);
                                                }}
                                            >
                                                <strong>Factura Electrónica</strong>
                                                <span>Con RUC para empresas</span>
                                            </button>
                                        </div>

                                        <div className="checkout-campo">
                                            <label>
                                                {tipoComprobante === "Boleta" ? "DNI del titular (8 dígitos)" : "RUC de la empresa (11 dígitos)"}
                                            </label>
                                            <div className="input-con-boton">
                                                <input
                                                    type="text"
                                                    maxLength={tipoComprobante === "Boleta" ? 8 : 11}
                                                    placeholder={tipoComprobante === "Boleta" ? "Ej. 72819402" : "Ej. 20601234567"}
                                                    value={documento}
                                                    onChange={(e) => setDocumento(e.target.value.replace(/\D/g, ""))}
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    className="btn-consultar-api"
                                                    onClick={handleConsultarDocumento}
                                                    disabled={cargandoApi}
                                                >
                                                    {cargandoApi ? "Consultando..." : `Consultar ${tipoComprobante === "Boleta" ? "RENIEC" : "SUNAT"}`}
                                                </button>
                                            </div>
                                            {errorApi && <p className="api-error">{errorApi}</p>}
                                            {estadoSunat && <p className="api-exito">✓ {estadoSunat}</p>}
                                        </div>

                                        <div className="checkout-campo">
                                            <label>
                                                {tipoComprobante === "Boleta" ? "Nombres y Apellidos" : "Razón Social"}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={tipoComprobante === "Boleta" ? "Nombres del cliente" : "Razón social de la empresa"}
                                                value={nombreRazonSocial}
                                                onChange={(e) => setNombreRazonSocial(e.target.value)}
                                                required
                                            />
                                        </div>

                                        {tipoComprobante === "Factura" && (
                                            <div className="checkout-campo">
                                                <label>Dirección Fiscal</label>
                                                <input
                                                    type="text"
                                                    placeholder="Dirección fiscal registrada en SUNAT"
                                                    value={direccionFiscal}
                                                    onChange={(e) => setDireccionFiscal(e.target.value)}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="desglose-sunat-box">
                                            <div className="desglose-fila">
                                                <span>Op. Gravada:</span>
                                                <span>S/ {baseImponible.toFixed(2)}</span>
                                            </div>
                                            <div className="desglose-fila">
                                                <span>I.G.V. (18%):</span>
                                                <span>S/ {igv.toFixed(2)}</span>
                                            </div>
                                            <div className="desglose-fila total">
                                                <strong>Total a pagar:</strong>
                                                <strong>S/ {total.toFixed(2)}</strong>
                                            </div>
                                        </div>

                                        <div className="checkout-acciones">
                                            <button
                                                type="button"
                                                className="btn-primary-lg"
                                                onClick={() => {
                                                    if (!nombreRazonSocial.trim()) {
                                                        handleConsultarDocumento();
                                                    }
                                                    setPasoCheckout(3);
                                                }}
                                            >
                                                Continuar a Medios de Pago →
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ===== PASO 3: MEDIO DE PAGO ===== */}
                                {pasoCheckout === 3 && (
                                    <div className="paso-contenido">
                                        <div className="metodos-grid">
                                            <button
                                                type="button"
                                                className={`metodo-card ${metodoPago === "tarjeta" ? "activo" : ""}`}
                                                onClick={() => setMetodoPago("tarjeta")}
                                            >
                                                <span className="metodo-icon">💳</span>
                                                <strong>Tarjeta</strong>
                                                <small>Débito / Crédito</small>
                                            </button>

                                            <button
                                                type="button"
                                                className={`metodo-card ${metodoPago === "yape" ? "activo" : ""}`}
                                                onClick={() => setMetodoPago("yape")}
                                            >
                                                <span className="metodo-icon">📱</span>
                                                <strong>Yape / Plin</strong>
                                                <small>Pago móvil QR</small>
                                            </button>

                                            <button
                                                type="button"
                                                className={`metodo-card ${metodoPago === "transferencia" ? "activo" : ""}`}
                                                onClick={() => setMetodoPago("transferencia")}
                                            >
                                                <span className="metodo-icon">🏦</span>
                                                <strong>Transferencia</strong>
                                                <small>BCP / BBVA / Interbank</small>
                                            </button>
                                        </div>

                                        {/* Tarjeta de crédito/débito */}
                                        {metodoPago === "tarjeta" && (
                                            <div className="form-tarjeta">
                                                <div className="checkout-campo">
                                                    <label>Número de Tarjeta</label>
                                                    <input
                                                        type="text"
                                                        placeholder="4557 1234 5678 9010"
                                                        value={numeroTarjeta}
                                                        onChange={(e) => handleTarjetaInput(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="checkout-campo">
                                                    <label>Nombre del Titular</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Como figura en la tarjeta"
                                                        value={nombreTitular}
                                                        onChange={(e) => setNombreTitular(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="doble-campo">
                                                    <div className="checkout-campo">
                                                        <label>Vencimiento (MM/AA)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="12/28"
                                                            value={vencimiento}
                                                            onChange={(e) => handleVencimientoInput(e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="checkout-campo">
                                                        <label>CVV (3 dígitos)</label>
                                                        <input
                                                            type="password"
                                                            maxLength={4}
                                                            placeholder="•••"
                                                            value={cvv}
                                                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Yape / Plin */}
                                        {metodoPago === "yape" && (
                                            <div className="form-yape">
                                                <div className="yape-qr-box">
                                                    <div className="yape-qr-placeholder">
                                                        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                            <rect x="3" y="3" width="7" height="7" rx="1" />
                                                            <rect x="14" y="3" width="7" height="7" rx="1" />
                                                            <rect x="3" y="14" width="7" height="7" rx="1" />
                                                            <rect x="14" y="14" width="3" height="3" />
                                                            <rect x="18" y="14" width="3" height="7" />
                                                            <rect x="14" y="18" width="3" height="3" />
                                                        </svg>
                                                        <span>Escanear QR con Yape o Plin</span>
                                                    </div>
                                                    <div className="yape-datos">
                                                        <p>Monto a transferir: <strong>S/ {total.toFixed(2)}</strong></p>
                                                        <p>Titular: <strong>TechStore Perú S.A.C.</strong></p>
                                                        <p>Número: <strong>+51 999 888 777</strong></p>
                                                    </div>
                                                </div>
                                                <div className="checkout-campo">
                                                    <label>Código de Operación (6 dígitos)</label>
                                                    <input
                                                        type="text"
                                                        maxLength={8}
                                                        placeholder="Ej. 481920"
                                                        value={codigoYape}
                                                        onChange={(e) => setCodigoYape(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Transferencia */}
                                        {metodoPago === "transferencia" && (
                                            <div className="form-transferencia">
                                                <div className="bancos-box">
                                                    <div><strong>BCP Soles:</strong> 193-48192039-0-12 (CCI: 00219300481920390123)</div>
                                                    <div><strong>BBVA Soles:</strong> 0011-0182-0200481920 (CCI: 01118200020048192011)</div>
                                                    <div><strong>Interbank:</strong> 200-3001849102 (CCI: 00320000300184910245)</div>
                                                </div>
                                                <p className="transf-nota">
                                                    Adjunta tu confirmación o realiza el abono dentro de las próximas 2 horas para despachar tu orden de inmediato.
                                                </p>
                                            </div>
                                        )}

                                        <div className="checkout-acciones">
                                            <button
                                                type="button"
                                                className="btn-ghost"
                                                onClick={() => setPasoCheckout(1)}
                                            >
                                                ← Volver a comprobante
                                            </button>
                                            <button
                                                type="submit"
                                                className="btn-primary-lg btn-confirmar-pago"
                                                disabled={procesandoPago}
                                            >
                                                {procesandoPago ? "Procesando pago con entidad..." : `Confirmar y Pagar S/ ${total.toFixed(2)}`}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                )}

                {/* Sugeridos */}
                {!pedidoOk && sugeridos.length > 0 && (
                    <section className="carrito-sugeridos">
                        <h2>También te puede interesar</h2>
                        <div className="sugeridos-grid">
                            {sugeridos.map((p) => (
                                <ProductCard key={p.id} producto={p} />
                            ))}
                        </div>
                    </section>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Carrito;
