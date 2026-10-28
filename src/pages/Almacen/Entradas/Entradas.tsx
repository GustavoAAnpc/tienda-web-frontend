import { useState } from "react";
import { useInventario } from "../../../context/InventarioContext";
import { useAuth } from "../../../context/AuthContext";

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

    const inputClass =
        "w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500";

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white">Registrar Entrada de Mercadería</h1>
                <p className="text-sm text-slate-500 mt-1">Ingreso de suministros con cálculo automático de nuevo stock y asiento en Kardex.</p>
            </div>

            <form className="max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm space-y-4" onSubmit={registrar}>
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Producto a Ingresar
                    </label>
                    <select
                        className={`${inputClass} cursor-pointer`}
                        value={productoId}
                        onChange={(e) => setProductoId(Number(e.target.value))}
                    >
                        {activos.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} (Stock actual: {p.stock})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Cantidad a Ingresar
                    </label>
                    <input
                        className={inputClass}
                        type="number"
                        min={1}
                        value={cantidad}
                        onChange={(e) => setCantidad(Number(e.target.value))}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        Motivo / Documento de Ingreso
                    </label>
                    <input
                        className={inputClass}
                        type="text"
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        placeholder="Guía de remisión / Compra / Reabastecimiento"
                    />
                </div>

                {/* Cálculo automático */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center">
                    <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Stock Actual</span>
                        <strong className="block text-lg font-mono font-bold text-slate-700 dark:text-slate-300">{stockActual}</strong>
                    </div>
                    <div>
                        <span className="block text-[11px] font-semibold text-slate-400">Ingresando</span>
                        <strong className="block text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400">+{Math.max(0, cantidad)}</strong>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-1 border border-emerald-200 dark:border-emerald-800/40">
                        <span className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-300">Nuevo Stock</span>
                        <strong className="block text-lg font-mono font-black text-emerald-600 dark:text-emerald-400">{nuevoStock}</strong>
                    </div>
                </div>

                <p className="text-xs text-slate-400">
                    Operador: <strong className="text-slate-600 dark:text-slate-300">{usuario?.nombre ?? "Almacén"}</strong> · Asiento inmediato en Kardex
                </p>

                {ok && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-semibold text-xs border border-emerald-200 dark:border-emerald-800/60">
                        ✓ Registrado con éxito: {ok}
                    </div>
                )}

                <div className="flex gap-2.5 pt-2">
                    <button
                        type="button"
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all cursor-pointer"
                        onClick={limpiar}
                    >
                        Limpiar formulario
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
                    >
                        Registrar entrada
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Entradas;
