import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { PRODUCTOS } from "../../data/productos";
import { useAuth } from "../../context/AuthContext";
import "./Admin.css";

function Admin() {
    const navigate = useNavigate();
    const { usuario } = useAuth();

    // Solo el admin puede ver esta página
    if (!usuario || usuario.rol !== "admin") {
        return (
            <div className="admin-page">
                <Header />
                <main className="admin-content">
                    <h1>Acceso denegado</h1>
                    <p className="admin-muted">Ingresa con la cuenta admin / 123.</p>
                    <button className="btn-primary-lg" onClick={() => navigate("/login")}>
                        Ir al login
                    </button>
                </main>
                <Footer />
            </div>
        );
    }

    const ventasTotales = PRODUCTOS.reduce((acc, p) => acc + p.precio * p.vendidos, 0);
    const unidadesVendidas = PRODUCTOS.reduce((acc, p) => acc + p.vendidos, 0);
    const stockTotal = PRODUCTOS.reduce((acc, p) => acc + p.stock, 0);
    const pedidos = JSON.parse(localStorage.getItem("techstore-pedidos") ?? "[]");

    return (
        <div className="admin-page">
            <Header />

            <main className="admin-content">
                <div className="admin-header">
                    <div>
                        <h1>Panel Administrador</h1>
                        <p className="admin-muted">Qué está vendiendo el negocio y cómo va.</p>
                    </div>
                    <span className="rol-badge admin">ADMIN</span>
                </div>

                <section className="admin-cards">
                    <div className="admin-card">
                        <span>Ventas totales</span>
                        <strong>S/ {ventasTotales.toLocaleString("es-PE")}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Unidades vendidas</span>
                        <strong>{unidadesVendidas}</strong>
                    </div>
                    <div className="admin-card">
                        <span>Stock total</span>
                        <strong>{stockTotal} uds.</strong>
                    </div>
                    <div className="admin-card">
                        <span>Pedidos (carrito)</span>
                        <strong>{pedidos.length}</strong>
                    </div>
                </section>

                <section className="admin-section">
                    <h2>Productos</h2>
                    <div className="tabla-wrap">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Stock</th>
                                    <th>Vendidos</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PRODUCTOS.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.nombre}</td>
                                        <td>{p.categoria}</td>
                                        <td>S/ {p.precio.toLocaleString("es-PE")}</td>
                                        <td>{p.stock}</td>
                                        <td>{p.vendidos}</td>
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

export default Admin;
