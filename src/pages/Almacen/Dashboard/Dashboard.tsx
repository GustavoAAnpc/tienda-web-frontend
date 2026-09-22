import { useNavigate } from "react-router-dom";
import { useInventario } from "../../../context/InventarioContext";
import "./Dashboard.css";

function fechaCorta(iso: string) {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function Dashboard() {
    const navigate = useNavigate();
    const { productos, movimientos, stockTotal, stockBajo } = useInventario();

    const ultimos = movimientos.slice(0, 5);
    const ultimasEntradas = movimientos.filter((m) => m.tipo === "Entrada").slice(0, 3);

    return (
        <>
            <h1>Dashboard de Almacén</h1>

            <section className="panel-cards">
                <div className="panel-card">
                    <span>Productos registrados</span>
                    <strong>{productos.length}</strong>
                </div>
                <div className="panel-card">
                    <span>Stock total</span>
                    <strong>{stockTotal} uds.</strong>
                </div>
                <div className="panel-card">
                    <span>Stock bajo</span>
                    <strong>{stockBajo}</strong>
                </div>
                <div className="panel-card">
                    <span>Movimientos</span>
                    <strong>{movimientos.length}</strong>
                </div>
            </section>

            <section className="panel-section">
                <h2>Últimos movimientos</h2>
                <div className="movs">
                    {ultimos.map((m) => (
                        <div key={m.id} className="mov">
                            <span className={`pill-tipo ${m.tipo === "Entrada" ? "in" : "out"}`}>
                                {m.tipo}
                            </span>
                            <span className="mov-prod">{m.producto}</span>
                            <strong className={m.tipo === "Entrada" ? "cant-in" : "cant-out"}>
                                {m.tipo === "Entrada" ? `+${m.cantidad}` : `-${m.cantidad}`}
                            </strong>
                            <span className="mov-fecha">{fechaCorta(m.fecha)}</span>
                        </div>
                    ))}
                    {ultimos.length === 0 && <p className="vacio">Sin movimientos todavía.</p>}
                </div>
            </section>

            <section className="panel-section">
                <h2>Últimas entradas</h2>
                <div className="movs">
                    {ultimasEntradas.map((m) => (
                        <div key={m.id} className="mov">
                            <span className="mov-prod">{m.producto}</span>
                            <strong className="cant-in">+{m.cantidad}</strong>
                            <span className="mov-fecha">{fechaCorta(m.fecha)}</span>
                        </div>
                    ))}
                    {ultimasEntradas.length === 0 && <p className="vacio">Sin entradas todavía.</p>}
                </div>
            </section>

            <section className="panel-section">
                <h2>Accesos rápidos</h2>
                <div className="accesos">
                    <button onClick={() => navigate("/almacen/productos")}>
                        <strong>Productos</strong>
                        <span>Ver y editar el catálogo</span>
                    </button>
                    <button onClick={() => navigate("/almacen/entradas")}>
                        <strong>Registrar entrada</strong>
                        <span>Ingresar mercadería</span>
                    </button>
                    <button onClick={() => navigate("/almacen/kardex")}>
                        <strong>Kardex</strong>
                        <span>Historial de movimientos</span>
                    </button>
                </div>
            </section>
        </>
    );
}

export default Dashboard;
