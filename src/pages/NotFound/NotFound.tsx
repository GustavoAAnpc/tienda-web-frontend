import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
            <Header />
            <main className="flex-1 flex items-center justify-center p-6 sm:p-12">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 text-center shadow-lg space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                        Error 404
                    </span>
                    <h1 className="text-6xl font-black font-mono tracking-tight text-blue-600 dark:text-blue-400">
                        404
                    </h1>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Página no encontrada
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                        La página que buscas no existe o ha sido movida. Puedes volver al catálogo o regresar al inicio.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row gap-2.5 justify-center">
                        <Link
                            to="/inicio"
                            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-all text-center"
                        >
                            Ir al inicio
                        </Link>
                        <Link
                            to="/productos"
                            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-all text-center"
                        >
                            Explorar catálogo
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default NotFound;
