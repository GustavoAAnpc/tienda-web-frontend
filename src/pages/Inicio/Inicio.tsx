import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CATEGORIAS } from "../../data/productos";
import { useInventario } from "../../context/InventarioContext";
import "./inicio.css";

// Iconos SVG estilo línea (mismo trazo que el Header).
// Se usan en vez de emojis para un acabado más profesional.
const ICONOS_CATEGORIA: Record<string, ReactNode> = {
    smartphone: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="7" y="2" width="10" height="20" rx="2" />
            <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
    ),
    audio: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
        </svg>
    ),
    perifericos: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <line x1="6" y1="10" x2="6" y2="10" />
            <line x1="10" y1="10" x2="10" y2="10" />
            <line x1="14" y1="10" x2="14" y2="10" />
            <line x1="18" y1="10" x2="18" y2="10" />
            <line x1="7" y1="14" x2="17" y2="14" />
        </svg>
    ),
    computadoras: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
    ),
    accesorios: (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 2v6M15 2v6M7 8h10v4a5 5 0 0 1-10 0V8z" />
            <line x1="12" y1="17" x2="12" y2="22" />
        </svg>
    ),
};

const ICONOS_BENEFICIO = {
    envios: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="3" width="15" height="13" rx="1" />
            <path d="M16 8h4l3 3v5h-7V8z" />
            <circle cx="5.5" cy="18.5" r="2.5" />
            <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
    ),
    pago: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    ),
    stock: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" />
            <line x1="3" y1="8" x2="12" y2="13" />
            <line x1="12" y1="13" x2="21" y2="8" />
            <line x1="12" y1="13" x2="12" y2="21" />
        </svg>
    ),
    compra: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
    ),
};

function Inicio() {

    const navigate = useNavigate();
    const { productos } = useInventario();

    // Productos destacados: activos y con stock
    const destacados = productos
        .filter((p) => p.activo && p.stock > 0)
        .slice(0, 4);

    // Productos más vendidos
    const masVendidos = [...productos]
        .filter((p) => p.activo)
        .sort((a, b) => b.vendidos - a.vendidos)
        .slice(0, 4);


    return (
        <div className="inicio-page">

            <Header />


            <main className="inicio-content">

                {/* =========================
                    1. BANNER PRINCIPAL
                   ========================= */}

                <section className="hero">

                    <div className="hero-background">
                        <img
                            src="/src/assets/hero.png"
                            alt="Productos tecnológicos"
                        />
                    </div>

                    <div className="hero-overlay"></div>

                    <div className="hero-content">

                        <div className="hero-text">

                            <span className="hero-tag">
                                Tecnología para todos los días
                            </span>

                            <h1>
                                Tecnología que <span>transforma</span> tu mundo
                            </h1>

                            <p>
                                Smartphones, audífonos, periféricos y accesorios.
                                Encuentra todo lo que necesitas en un solo lugar.
                            </p>

                            <div className="hero-buttons">

                                <button
                                    className="btn-hero-primary"
                                    onClick={() => navigate("/productos")}
                                >
                                    Ver productos
                                </button>

                                <button
                                    className="btn-hero-secondary"
                                    onClick={() => navigate("/productos")}
                                >
                                    Explorar categorías
                                </button>

                            </div>

                        </div>

                    </div>

                </section>



                {/* =========================
                    2. BENEFICIOS
                   ========================= */}

                <section className="benefits-bar">

                    <div className="benefit">

                        <div className="benefit-icon">
                            {ICONOS_BENEFICIO.envios}
                        </div>

                        <div className="benefit-text">
                            <strong>
                                Envíos
                            </strong>

                            <span>
                                Recibe tus productos
                            </span>
                        </div>

                    </div>


                    <div className="benefit">

                        <div className="benefit-icon">
                            {ICONOS_BENEFICIO.pago}
                        </div>

                        <div className="benefit-text">
                            <strong>
                                Pago seguro
                            </strong>

                            <span>
                                Compra de forma sencilla
                            </span>
                        </div>

                    </div>


                    <div className="benefit">

                        <div className="benefit-icon">
                            {ICONOS_BENEFICIO.stock}
                        </div>

                        <div className="benefit-text">
                            <strong>
                                Variedad de productos
                            </strong>

                            <span>
                               Encuentra lo que necesitas
                            </span>
                        </div>

                    </div>


                    <div className="benefit">

                        <div className="benefit-icon">
                            {ICONOS_BENEFICIO.compra}
                        </div>

                        <div className="benefit-text">
                            <strong>
                                Compra fácil
                            </strong>

                            <span>
                                Agrega al carrito y compra
                            </span>
                        </div>

                    </div>

                </section>



                {/* =========================
                    3. CATEGORÍAS
                   ========================= */}

                <section className="section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Explorar por categoría
                            </h2>

                            <p className="subtitle">
                                Encuentra rápidamente el producto que buscas
                            </p>

                        </div>

                    </div>


                    <div className="categories-grid">

                        {CATEGORIAS.map((cat) => (

                            <button
                                key={cat.nombre}
                                onClick={() => navigate("/productos")}
                                className="category-card"
                            >

                                <span className="category-icon">
                                    {ICONOS_CATEGORIA[cat.icon]}
                                </span>

                                <span>
                                    {cat.nombre}
                                </span>

                            </button>

                        ))}

                    </div>

                </section>



                {/* =========================
                    4. PRODUCTOS DESTACADOS
                   ========================= */}

                <section className="section">

                    <div className="section-header">

                        <h2>
                            Productos destacados
                        </h2>

                        <button
                            className="link"
                            onClick={() => navigate("/productos")}
                        >
                            Ver todos →
                        </button>

                    </div>


                    <div className="products-grid">

                        {destacados.map((p) => (

                            <ProductCard
                                key={p.id}
                                producto={p}
                            />

                        ))}

                    </div>

                </section>



                {/* =========================
                    5. BANNER DE OFERTAS
                   ========================= */}

                <section className="section">

                    <div className="promo-banner">

                        <span className="promo-tag">
                            Ofertas especiales
                        </span>

                        <h2>
                            Encuentra tecnología a buenos precios
                        </h2>

                        <p>
                            Explora nuestra selección de periféricos,
                            accesorios y otros productos tecnológicos.
                        </p>

                        <button
                            onClick={() => navigate("/productos")}
                        >
                            Ver productos →
                        </button>

                    </div>

                </section>



                {/* =========================
                    6. MÁS VENDIDOS
                   ========================= */}

                <section className="section">

                    <div className="section-header">

                        <div>

                            <h2>
                                Más vendidos
                            </h2>

                            <p className="subtitle">
                                Los productos más vendidos de nuestra tienda
                            </p>

                        </div>


                        <button
                            className="link"
                            onClick={() => navigate("/productos")}
                        >
                            Ver todos →
                        </button>

                    </div>


                    <div className="products-grid">

                        {masVendidos.map((p) => (

                            <ProductCard
                                key={p.id}
                                producto={p}
                            />

                        ))}

                    </div>

                </section>

            </main>


            <Footer />

        </div>
    );
}

export default Inicio;