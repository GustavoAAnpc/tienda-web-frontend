import { Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./NotFound.css";

function NotFound() {
    return (
        <>
            <Header />
            <main className="notfound-container">
                <div className="notfound-card">
                    <span className="notfound-badge">Error 404</span>
                    <h1 className="notfound-code">404</h1>
                    <h2 className="notfound-title">Página no encontrada</h2>
                    <p className="notfound-desc">
                        La página que buscas no existe o ha sido movida. Puedes volver al catálogo o regresar a la página principal.
                    </p>
                    <div className="notfound-actions">
                        <Link to="/inicio" className="notfound-btn-primary">
                            Ir al inicio
                        </Link>
                        <Link to="/productos" className="notfound-btn-secondary">
                            Explorar catálogo
                        </Link>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

export default NotFound;
