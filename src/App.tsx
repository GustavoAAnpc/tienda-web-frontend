import { BrowserRouter, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio/Inicio";
import Login from "./pages/Login/Login";
import Registro from "./pages/Registro/Registro";
import Productos from "./pages/Productos/Productos";
import Contactanos from "./pages/Contactanos/Contactanos";
import Carrito from "./pages/Carrito/Carrito";
import Detalle from "./pages/Detalle/Detalle";
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard/Dashboard";
import AdminVentas from "./pages/Admin/Ventas/Ventas";
import AdminProductos from "./pages/Admin/Productos/Productos";
import AdminUsuarios from "./pages/Admin/Usuarios/Usuarios";
import AdminReportes from "./pages/Admin/Reportes/Reportes";
import AlmacenLayout from "./pages/Almacen/AlmacenLayout";
import AlmacenDashboard from "./pages/Almacen/Dashboard/Dashboard";
import AlmacenProductos from "./pages/Almacen/Productos/Productos";
import AlmacenEntradas from "./pages/Almacen/Entradas/Entradas";
import AlmacenKardex from "./pages/Almacen/Kardex/Kardex";
import MisCompras from "./pages/MisCompras/MisCompras";
import MiCuenta from "./pages/MiCuenta/MiCuenta";
import { CarritoProvider } from "./context/CarritoContext";
import { AuthProvider } from "./context/AuthContext";
import { InventarioProvider } from "./context/InventarioContext";


function App() {
  return (
    <AuthProvider>
      <InventarioProvider>
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
            <Route path="/Admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="ventas" element={<AdminVentas />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="reportes" element={<AdminReportes />} />
            </Route>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="ventas" element={<AdminVentas />} />
              <Route path="productos" element={<AdminProductos />} />
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="reportes" element={<AdminReportes />} />
            </Route>
            <Route path="/almacen" element={<AlmacenLayout />}>
              <Route index element={<AlmacenDashboard />} />
              <Route path="dashboard" element={<AlmacenDashboard />} />
              <Route path="productos" element={<AlmacenProductos />} />
              <Route path="entradas" element={<AlmacenEntradas />} />
              <Route path="kardex" element={<AlmacenKardex />} />
            </Route>
            <Route path="/MisCompras" element={<MisCompras />} />
            <Route path="/mis-compras" element={<MisCompras />} />
            <Route path="/MiCuenta" element={<MiCuenta />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
      </InventarioProvider>
    </AuthProvider>
  );
}

export default App;
