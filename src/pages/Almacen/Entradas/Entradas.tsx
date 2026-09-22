import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import { useAuth } from "../../../context/AuthContext";
import "./Entradas.css";

function Entradas() {
    const { productos, registrarEntrada } = useInventario();
    const { usuario } = useAuth();

    const activos = productos.filter((p) => p.activo);

    const [productoId, setProductoId] = useState(activos[0]?.id ?? 0);
    const [cantidad, setCantidad] = useState(20);
    const [motivo, setMotivo] = useState("Ingreso de mercadería");
    const [ok, setOk] = useState("");

    const prod = productos.find((p) => p.id === productoId);
    const stockActual = prod?.stock ?? 0;
    const nuevoStock = stockActual + Math.max(0, cantidad);

    const registrar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prod || cantidad <= 0) return;
        registrarEntrada(productoId, cantidad, motivo, usuario?.nombre ?? "Almacén");
        setOk(`${prod.nombre}: ${stockActual} → ${stockActual + cantidad}`);
        setCantidad(20);
        setMotivo("Ingreso de mercadería");
        setTimeout(() => setOk(""), 4000);
    };

    const limpiar = () => {
        setCantidad(20);
        setMotivo("Ingreso de mercadería");
        setOk("");
    };

    return (
        <>
            <h1>Registrar entrada</h1>

            <form className="entrada-card" onSubmit={registrar}>
                <label>
                    Producto
                    <select value={productoId} onChange={(e) => setProductoId(Number(e.target.value))}>
                        {activos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} (stock: {p.stock})
                            </option>
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

                {/* Cálculo automático */}
                <div className="calculo">
                    <div>
                        <span>Stock actual</span>
                        <strong>{stockActual}</strong>
                    </div>
                    <div>
                        <span>Cantidad ingresada</span>
                        <strong className="positivo">+{Math.max(0, cantidad)}</strong>
                    </div>
                    <div className="destacado">
                        <span>Nuevo stock</span>
                        <strong>{nuevoStock}</strong>
                    </div>
                </div>

                <p className="meta">
                    Registra: {usuario?.nombre ?? "Almacén"} · hoy · genera ENTRADA en Kardex
                </p>

                {ok && <p className="ok-msg">Registrado: {ok}</p>}

                <div className="entrada-acciones">
                    <button type="button" className="btn-cancelar" onClick={limpiar}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-registrar">
                        Registrar entrada
                    </button>
                </div>
            </form>
        </>
    );
}

export default Entradas;
