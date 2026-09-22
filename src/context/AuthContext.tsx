import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Roles del sistema (cuando haya backend, esto viene de la API)
export type Rol = "admin" | "almacen" | "cliente";

export interface Usuario {
    id: string;
    nombre: string;
    acceso: string; // usuario o correo con el que ingresa
    rol: Rol;
}

interface CuentaDemo {
    acceso: string;
    password: string;
    usuario: Usuario;
}

// Cuentas fijas solo para el demo frontend
const CUENTAS_FIJAS: CuentaDemo[] = [
    {
        acceso: "admin",
        password: "123",
        usuario: { id: "admin", nombre: "Luis (Admin)", acceso: "admin", rol: "admin" },
    },
    {
        acceso: "almacen",
        password: "123",
        usuario: { id: "almacen", nombre: "Carlos", acceso: "almacen", rol: "almacen" },
    },
    {
        acceso: "cliente",
        password: "123",
        usuario: { id: "cliente", nombre: "Juan (Cliente)", acceso: "cliente", rol: "cliente" },
    },
];

interface UsuarioRegistrado {
    nombre: string;
    correo: string;
    password: string;
    fechaRegistro?: string;
    rol?: Rol;
}

const CLAVE_USUARIOS = "techstore-usuarios";
const CLAVE_SESION = "techstore-sesion";
const CLAVE_ESTADOS = "techstore-usuarios-estado"; // { id: "activo" | "inactivo" }

// Cuentas demo visibles en la gestión de usuarios (la fija admin no se desactiva)
export const CUENTAS_BASE = [
    { id: "admin", nombre: "Luis (Admin)", acceso: "admin", rol: "admin" as Rol, fecha: "15/01/2024", fija: true },
    { id: "almacen", nombre: "Carlos", acceso: "almacen", rol: "almacen" as Rol, fecha: "10/02/2024", fija: true },
    { id: "cliente", nombre: "Juan (Cliente)", acceso: "cliente", rol: "cliente" as Rol, fecha: "05/03/2024", fija: true },
];

export function obtenerEstado(id: string): "activo" | "inactivo" {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_ESTADOS) ?? "{}");
        return datos[id] === "inactivo" ? "inactivo" : "activo";
    } catch {
        return "activo";
    }
}

export function cambiarEstado(id: string, estado: "activo" | "inactivo") {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_ESTADOS) ?? "{}");
        datos[id] = estado;
        localStorage.setItem(CLAVE_ESTADOS, JSON.stringify(datos));
    } catch {
        // No se pudo guardar
    }
}

export function cambiarRolRegistrado(correo: string, rol: Rol) {
    try {
        const lista: UsuarioRegistrado[] = JSON.parse(localStorage.getItem(CLAVE_USUARIOS) ?? "[]");
        const user = lista.find((u) => u.correo === correo);
        if (user) {
            user.rol = rol;
            localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
        }
    } catch {
        // No se pudo guardar
    }
}

function leerUsuarios(): UsuarioRegistrado[] {
    try {
        const raw = localStorage.getItem(CLAVE_USUARIOS);
        const datos = raw ? JSON.parse(raw) : [];
        return Array.isArray(datos) ? datos : [];
    } catch {
        return [];
    }
}

// Busca la sesión guardada y reconstruye el usuario
function leerSesion(): Usuario | null {
    try {
        const id = localStorage.getItem(CLAVE_SESION);
        if (!id) return null;
        const fija = CUENTAS_FIJAS.find((c) => c.usuario.id === id);
        if (fija) return fija.usuario;
        const reg = leerUsuarios().find((u) => u.correo === id);
        if (reg) return { id: reg.correo, nombre: reg.nombre, acceso: reg.correo, rol: reg.rol ?? "cliente" };
        return null;
    } catch {
        return null;
    }
}

interface AuthContexto {
    usuario: Usuario | null;
    login: (acceso: string, password: string) => { ok: boolean; error?: string; usuario?: Usuario };
    logout: () => void;
    actualizarNombre: (nombre: string) => void;
}

const AuthContext = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(leerSesion);

    useEffect(() => {
        if (usuario) localStorage.setItem(CLAVE_SESION, usuario.id);
        else localStorage.removeItem(CLAVE_SESION);
    }, [usuario]);

    const login = (acceso: string, password: string) => {
        const limpio = acceso.trim();

        // 1. Cuentas fijas (admin / almacen / cliente demo)
        const fija = CUENTAS_FIJAS.find(
            (c) => c.acceso.toLowerCase() === limpio.toLowerCase() && c.password === password
        );
        if (fija) {
            // La cuenta admin fija nunca se bloquea (para no perder el acceso)
            if (fija.usuario.id !== "admin" && obtenerEstado(fija.usuario.id) === "inactivo") {
                return { ok: false, error: "Esta cuenta está desactivada" };
            }
            setUsuario(fija.usuario);
            return { ok: true, usuario: fija.usuario };
        }

        // 2. Usuarios registrados desde la página de registro
        const reg = leerUsuarios().find(
            (u) => u.correo.toLowerCase() === limpio.toLowerCase() && u.password === password
        );
        if (reg) {
            if (obtenerEstado(reg.correo) === "inactivo") {
                return { ok: false, error: "Esta cuenta está desactivada" };
            }
            const usuario = { id: reg.correo, nombre: reg.nombre, acceso: reg.correo, rol: reg.rol ?? ("cliente" as const) };
            setUsuario(usuario);
            return { ok: true, usuario };
        }

        return { ok: false, error: "Usuario o contraseña incorrectos" };
    };

    const logout = () => setUsuario(null);

    // Actualiza el nombre visible (y lo guarda si es usuario registrado)
    const actualizarNombre = (nombre: string) => {
        setUsuario((prev) => {
            if (!prev) return prev;
            try {
                const raw = localStorage.getItem(CLAVE_USUARIOS);
                const lista: UsuarioRegistrado[] = raw ? JSON.parse(raw) : [];
                const idx = lista.findIndex((u) => u.correo === prev.id);
                if (idx >= 0) {
                    lista[idx].nombre = nombre;
                    localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
                }
            } catch {
                // Solo cambia en memoria
            }
            return { ...prev, nombre };
        });
    };

    return <AuthContext.Provider value={{ usuario, login, logout, actualizarNombre }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContexto {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
