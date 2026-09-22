import { useState, useMemo } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import { CATEGORIAS } from "../../data/productos";
import { useInventario } from "../../context/InventarioContext";
import "./Productos.css";

// Opciones de orden disponibles en el select
type Orden = "relevancia" | "precio-asc" | "precio-desc" | "popular" | "stock";

const FILTRO_TODOS = "Todos";

function Productos() {
    // Estado de los filtros
    const [categoria, setCategoria] = useState(FILTRO_TODOS);
    const [orden, setOrden] = useState<Orden>("relevancia");
    const [busqueda, setBusqueda] = useState("");

    // Productos del inventario (la tienda solo muestra los activos)
    const { productos } = useInventario();

    // Nombres de categoría para las píldoras
    const nombresCategorias = [FILTRO_TODOS, ...CATEGORIAS.map((c) => c.nombre)];

    // Lista filtrada + ordenada (se recalcula solo si cambia un filtro)
    const filtrados = useMemo(() => {
        let lista = productos.filter((p) => p.activo);

        // 1. Filtrar por categoría
        if (categoria !== FILTRO_TODOS) {
            lista = lista.filter((p) => p.categoria === categoria);
        }

        // 2. Filtrar por texto (nombre, categoría o descripción)
        const texto = busqueda.trim().toLowerCase();
        if (texto) {
            lista = lista.filter(
                (p) =>
                    p.nombre.toLowerCase().includes(texto) ||
                    p.categoria.toLowerCase().includes(texto) ||
                    p.descripcion.toLowerCase().includes(texto)
            );
        }

        // 3. Ordenar
        switch (orden) {
            case "precio-asc":
                return lista.sort((a, b) => a.precio - b.precio);
            case "precio-desc":
                return lista.sort((a, b) => b.precio - a.precio);
            case "popular":
                return lista.sort((a, b) => b.vendidos - a.vendidos);
            case "stock":
                return lista.sort((a, b) => b.stock - a.stock);
            default:
                return lista;
        }
    }, [productos, categoria, orden, busqueda]);

    const limpiarFiltros = () => {
        setBusqueda("");
        setCategoria(FILTRO_TODOS);
        setOrden("relevancia");
    };

    return (
        <div className="productos-page">
            <Header />

            <main className="productos-content">
                {/* Título */}
                <div className="productos-header">
                    <h1>Catálogo de productos</h1>
                    <p>
                        {filtrados.length} producto{filtrados.length !== 1 ? "s" : ""} encontrado{filtrados.length !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Buscador + orden */}
                <div className="productos-toolbar">
                    <div className="productos-search">
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>

                    <select
                        value={orden}
                        onChange={(e) => setOrden(e.target.value as Orden)}
                        className="productos-select"
                    >
                        <option value="relevancia">Todos</option>
                        <option value="precio-asc">Precio: Menor a mayor</option>
                        <option value="precio-desc">Precio: Mayor a menor</option>
                        <option value="popular">Más vendidos</option>
                        <option value="stock">Mayor stock</option>
                    </select>
                </div>

                {/* Filtro por categoría */}
                <div className="productos-categorias">
                    {nombresCategorias.map((nombre) => (
                        <button
                            key={nombre}
                            onClick={() => setCategoria(nombre)}
                            className={`pill ${categoria === nombre ? "active" : ""}`}
                        >
                            {nombre}
                        </button>
                    ))}
                </div>

                {/* Resultados */}
                {filtrados.length > 0 ? (
                    <div className="productos-grid">
                        {filtrados.map((p) => (
                            <ProductCard key={p.id} producto={p} />
                        ))}
                    </div>
                ) : (
                    <div className="productos-vacio">
                        <svg
                            width="48"
                            height="48"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                        <h3>Sin resultados</h3>
                        <p>Intenta con otra búsqueda o categoría</p>
                        <button onClick={limpiarFiltros}>Limpiar filtros</button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

export default Productos;
