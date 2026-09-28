import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    CUENTAS_FIJAS,
    CLAVE_SESION,
    CLAVE_USUARIOS,
    obtenerEstado,
    leerUsuarios,
    leerSesion,
} from "../data/usuarios";
import type { Usuario, UsuarioRegistrado, Rol } from "../data/usuarios";

export type { Rol, Usuario };

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
