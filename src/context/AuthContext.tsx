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

export interface DatosRegistro {
    nombre: string;
    apellido: string;
    correo: string;
    direccion?: string;
    password: string;
}

interface AuthContexto {
    usuario: Usuario | null;
    login: (acceso: string, password: string) => Promise<{ ok: boolean; error?: string; usuario?: Usuario; bloqueado?: boolean }>;
    registro: (datos: DatosRegistro) => Promise<{ ok: boolean; error?: string; usuario?: Usuario }>;
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

    const login = async (acceso: string, password: string): Promise<{ ok: boolean; error?: string; usuario?: Usuario; bloqueado?: boolean }> => {
        const limpio = acceso.trim();

        // 1. Conexión con el Backend Spring Boot (PostgreSQL)
        try {
            const resp = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombreUsuario: limpio, contrasena: password }),
            });

            const data = await resp.json().catch(() => null);

            if (resp.ok && data?.exitoso) {
                let rolFront: Rol = "cliente";
                if (data.rol === "ADMINISTRADOR") rolFront = "admin";
                else if (data.rol === "OPERADOR" || data.rol === "ALMACEN") rolFront = "almacen";

                const usuarioBack: Usuario = {
                    id: data.nombreUsuario || limpio,
                    nombre: data.nombreUsuario || limpio,
                    acceso: data.nombreUsuario || limpio,
                    rol: rolFront,
                };
                setUsuario(usuarioBack);
                return { ok: true, usuario: usuarioBack };
            } else if (resp.status === 423 || data?.cuentaBloqueada) {
                return { ok: false, error: data?.mensaje || "Cuenta bloqueada tras 3 intentos erróneos.", bloqueado: true };
            } else if (resp.status === 401) {
                return { ok: false, error: data?.mensaje || "Contraseña o usuario incorrecto." };
            }
        } catch {
            console.warn("[Auth] Backend Spring Boot no disponible en /api/auth/login. Usando modo de respaldo.");
        }

        // 2. Modo Respaldo Local (Cuentas fijas / localStorage)
        const fija = CUENTAS_FIJAS.find(
            (c) => c.acceso.toLowerCase() === limpio.toLowerCase() && c.password === password
        );
        if (fija) {
            if (fija.usuario.id !== "admin" && obtenerEstado(fija.usuario.id) === "inactivo") {
                return { ok: false, error: "Esta cuenta está desactivada" };
            }
            setUsuario(fija.usuario);
            return { ok: true, usuario: fija.usuario };
        }

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

    const registro = async (datos: DatosRegistro): Promise<{ ok: boolean; error?: string; usuario?: Usuario }> => {
        const correoLimpio = datos.correo.trim().toLowerCase();
        const nombreCompleto = `${datos.nombre.trim()} ${datos.apellido.trim()}`;

        // 1. Conexión con el Backend Spring Boot (PostgreSQL)
        try {
            const resp = await fetch("/api/auth/registro", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    nombre: datos.nombre.trim(),
                    apellido: datos.apellido.trim(),
                    correo: correoLimpio,
                    direccion: datos.direccion?.trim() || "",
                    password: datos.password,
                }),
            });

            const data = await resp.json().catch(() => null);

            if (resp.ok && data?.exitoso) {
                const usuarioBack: Usuario = {
                    id: data.nombreUsuario || correoLimpio,
                    nombre: nombreCompleto,
                    acceso: correoLimpio,
                    rol: "cliente",
                };
                setUsuario(usuarioBack);

                // Sincronizar en localStorage para compatibilidad
                try {
                    const raw = localStorage.getItem(CLAVE_USUARIOS);
                    const lista: UsuarioRegistrado[] = raw ? JSON.parse(raw) : [];
                    if (!lista.some((u) => u.correo.toLowerCase() === correoLimpio)) {
                        lista.push({
                            nombre: nombreCompleto,
                            correo: correoLimpio,
                            direccion: datos.direccion?.trim() || "",
                            password: datos.password,
                            fechaRegistro: new Date().toLocaleDateString("es-PE"),
                            rol: "cliente",
                        });
                        localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));
                    }
                } catch {
                    // Ignorar error de storage
                }

                return { ok: true, usuario: usuarioBack };
            } else if (data?.mensaje) {
                return { ok: false, error: data.mensaje };
            }
        } catch {
            console.warn("[Auth] Backend Spring Boot no disponible en /api/auth/registro. Usando modo de respaldo local.");
        }

        // 2. Modo Respaldo Local (localStorage)
        try {
            const raw = localStorage.getItem(CLAVE_USUARIOS);
            const lista: UsuarioRegistrado[] = raw ? JSON.parse(raw) : [];
            if (lista.some((u) => u.correo.toLowerCase() === correoLimpio)) {
                return { ok: false, error: "Ese correo ya está registrado, inicia sesión" };
            }
            lista.push({
                nombre: nombreCompleto,
                correo: correoLimpio,
                direccion: datos.direccion?.trim() || "",
                password: datos.password,
                fechaRegistro: new Date().toLocaleDateString("es-PE"),
                rol: "cliente",
            });
            localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(lista));

            const usuarioLocal: Usuario = {
                id: correoLimpio,
                nombre: nombreCompleto,
                acceso: correoLimpio,
                rol: "cliente",
            };
            setUsuario(usuarioLocal);
            return { ok: true, usuario: usuarioLocal };
        } catch {
            return { ok: false, error: "Error al procesar el registro localmente" };
        }
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

    return <AuthContext.Provider value={{ usuario, login, registro, logout, actualizarNombre }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContexto {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
    return ctx;
}
