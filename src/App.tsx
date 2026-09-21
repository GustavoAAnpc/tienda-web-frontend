import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import Productos from "./pages/Productos/Productos";
import Contactanos from "./pages/Contactanos/Contactanos";
import Carrito from "./pages/Carrito/Carrito";
import Detalle from "./pages/Detalle/Detalle";
import Admin from "./pages/Admin/Admin";
import Almacen from "./pages/Almacen/Almacen";
import MisCompras from "./pages/MisCompras/MisCompras";
import MiCuenta from "./pages/MiCuenta/MiCuenta";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";


function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Registro />} />
            <Route path="/registro" element={<Registro />} />
            <Route path="/Inicio" element={<Inicio />} />
            <Route path="/inicio" element={<Inicio />} />
            <Route path="/Productos" element={<Productos />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<Detalle />} />
            <Route path="/Contactanos" element={<Contactanos />} />
            <Route path="/contactanos" element={<Contactanos />} />
            <Route path="/Carrito" element={<Carrito />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/Admin" element={<Admin />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/Almacen" element={<Almacen />} />
            <Route path="/almacen" element={<Almacen />} />
            <Route path="/MisCompras" element={<MisCompras />} />
            <Route path="/mis-compras" element={<MisCompras />} />
            <Route path="/MiCuenta" element={<MiCuenta />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
