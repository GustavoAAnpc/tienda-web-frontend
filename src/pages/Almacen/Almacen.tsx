import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { PRODUCTOS } from "../../data/productos";
import { useAuth } from "../../context/AuthContext";
import "../Admin/Admin.css";
import "./Almacen.css";

interface Movimiento {
    fecha: string;
    producto: string;
    tipo: "Entrada" | "Salida";
    cantidad: number;
    motivo: string;
}

// Kardex inicial de ejemplo: salidas generadas por ventas
const KARDEX_INICIAL: Movimiento[] = [
    { fecha: "18/09", producto: "Audífonos Sony WH-1000XM4", tipo: "Salida", cantidad: 5, motivo: "Venta acumulada" },
    { fecha: "19/09", producto: "Mouse Logitech G502 HERO", tipo: "Salida", cantidad: 8, motivo: "Venta acumulada" },
    { fecha: "20/09", producto: "Samsung Galaxy A55 5G 8GB / 128GB", tipo: "Salida", cantidad: 3, motivo: "Venta acumulada" },
];

function fechaHoy() {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Almacen() {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    // Stock extra por entradas registradas (solo en memoria, demo frontend)
    const [extras, setExtras] = useState<Record<number, number>>({});
    const [kardex, setKardex] = useState<Movimiento[]>(KARDEX_INICIAL);

    const [productoId, setProductoId] = useState(PRODUCTOS[0].id);
    const [cantidad, setCantidad] = useState(10);
    const [motivo, setMotivo] = useState("Ingreso de mercadería");

    if (!usuario || (usuario.rol !== "almacen" && usuario.rol !== "admin")) {
        return (
            <div className="admin-page">
                <Header />
                <main className="admin-content">
                    <h1>Acceso denegado</h1>
                    <p className="admin-muted">Ingresa con la cuenta almacen / 123.</p>
                    <button className="btn-primary-lg" onClick={() => navigate("/login")}>
                        Ir al login
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    const stockDe = (id: number) => {
        const base = PRODUCTOS.find((p) => p.id === id)!;
        return base.stock + (extras[id] ?? 0);
    };

    const stockTotal = PRODUCTOS.reduce((acc, p) => acc + stockDe(p.id), 0);
    const stockBajo = PRODUCTOS.filter((p) => stockDe(p.id) < 10).length;

    const registrarEntrada = (e: React.FormEvent) => {
        e.preventDefault();
        if (cantidad <= 0) return;
        const prod = PRODUCTOS.find((p) => p.id === productoId)!;
        setExtras((prev) => ({ ...prev, [productoId]: (prev[productoId] ?? 0) + cantidad }));
        setKardex((prev) => [
            { fecha: fechaHoy(), producto: prod.nombre, tipo: "Entrada", cantidad, motivo: motivo.trim() || "Ingreso" },
            ...prev,
        ]);
        setCantidad(10);
    };

    const estado = (stock: number) =>
        stock === 0 ? "Agotado" : stock < 10 ? "Stock bajo" : "Disponible";

    return (
        <div className="admin-page">
            <Header />

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <h1>Panel Almacén</h1>
                        <p className="admin-muted">Cuánto hay y cómo se ha movido.</p>
                    </div>
                    <span className="rol-badge almacen">ALMACÉN</span>
                </div>

                <section className="admin-cards">
                    <div className="admin-card">
                        <span>Productos</span>
                        <strong>{PRODUCTOS.length}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Stock total</span>
                        <strong>{stockTotal} uds.</strong>
                    </div>
                    <div className="admin-card">
                        <span>Stock bajo</span>
                        <strong>{stockBajo}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Entradas registradas</span>
                        <strong>{kardex.filter((k) => k.tipo === "Entrada").length}</strong>
                    </div>
                </section>

                <section className="admin-section">
                    <h2>Registrar entrada</h2>
                    <form className="entrada-form" onSubmit={registrarEntrada}>
                        <label>
                            Producto
                            <select value={productoId} onChange={(e) => setProductoId(Number(e.target.value))}>
                                {PRODUCTOS.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Cantidad
                            <input
                                type="number"
                                min={1}
                                value={cantidad}
                                onChange={(e) => setCantidad(Number(e.target.value))}
                            />
                        </label>
                        <label>
                            Motivo
                            <input
                                type="text"
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Ingreso de mercadería"
                            />
                        </label>
                        <button type="submit" className="btn-registrar">Registrar</button>
                    </form>
                </section>

                <section className="admin-section">
                    <h2>Inventario</h2>
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Stock</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PRODUCTOS.map((p) => {
                                    const s = stockDe(p.id);
                                    return (
                                        <tr key={p.id}>
                                            <td>{p.nombre}</td>
                                            <td>{s}</td>
                                            <td>
                                                <span className={`estado ${s === 0 ? "agotado" : s < 10 ? "bajo" : "ok"}`}>
                                                    {estado(s)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="admin-section">
                    <h2>Kardex</h2>
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Producto</th>
                                    <th>Tipo</th>
                                    <th>Cant.</th>
                                    <th>Motivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {kardex.map((k, i) => (
                                    <tr key={i}>
                                        <td>{k.fecha}</td>
                                        <td>{k.producto}</td>
                                        <td>
                                            <span className={`estado ${k.tipo === "Entrada" ? "ok" : "salida"}`}>
                                                {k.tipo}
                                            </span>
                                        </td>
                                        <td>{k.tipo === "Entrada" ? `+${k.cantidad}` : `-${k.cantidad}`}</td>
                                        <td>{k.motivo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Almacen;
