// Ventas de ejemplo + ventas reales del carrito (solo frontend).
// Cuando haya backend, todo esto viene de la API y este archivo desaparece.

import type { EstadoPedido, TipoEntrega } from "./pedidos";

export interface ItemVenta {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

export interface Venta {
    numero: string;
    cliente: string;
    fecha: string;
    total: number;
    estado: EstadoPedido;
    tipoEntrega?: TipoEntrega;
    items: ItemVenta[];
    documento?: string;
}

function haceDias(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(12, 0, 0, 0);
    return d.toISOString();
}

export const VENTAS_DEMO: Venta[] = [
    {
        numero: "VTA-012", cliente: "María Torres", documento: "73214569", fecha: haceDias(0), total: 517, estado: "Entregado", items: [
            { id: 1, nombre: "Mouse Logitech G502 HERO", precio: 229, cantidad: 2 },
            { id: 6, nombre: "Kit Cargador Xiaomi 65W USB-C", precio: 59, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-011", cliente: "José Ramírez", documento: "45678912", fecha: haceDias(0), total: 329, estado: "Entregado", items: [
            { id: 8, nombre: "Parlante JBL Flip 7 Bluetooth", precio: 329, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-010", cliente: "Ana Quispe", documento: "20546987123", fecha: haceDias(1), total: 1481, estado: "Entregado", items: [
            { id: 5, nombre: "Samsung Galaxy A55 5G 8GB / 128GB", precio: 1481, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-009", cliente: "Pedro Huamán", documento: "12345678", fecha: haceDias(1), total: 444, estado: "Pendiente", items: [
            { id: 3, nombre: "Teclado Redragon Fizz Pro K616 RGB", precio: 215, cantidad: 1 },
            { id: 1, nombre: "Mouse Logitech G502 HERO", precio: 229, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-008", cliente: "Rosa Díaz", fecha: haceDias(3), total: 1049, estado: "Entregado", items: [
            { id: 2, nombre: "Audífonos Sony WH-1000XM4", precio: 1049, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-007", cliente: "Miguel Torres", fecha: haceDias(5), total: 729, estado: "Entregado", items: [
            { id: 7, nombre: "Monitor Xiaomi G27Qi 27\" 2K 200Hz", precio: 729, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-006", cliente: "Carmen Ruiz", fecha: haceDias(6), total: 177, estado: "Entregado", items: [
            { id: 6, nombre: "Kit Cargador Xiaomi 65W USB-C", precio: 59, cantidad: 3 },
        ]
    },
    {
        numero: "VTA-005", cliente: "Jorge Paredes", fecha: haceDias(9), total: 2599, estado: "Entregado", items: [
            { id: 4, nombre: "Laptop Lenovo IdeaPad Slim 3 Ryzen 7 / 16GB / 512GB", precio: 2599, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-004", cliente: "Lucía Fernández", fecha: haceDias(12), total: 658, estado: "Pendiente", items: [
            { id: 8, nombre: "Parlante JBL Flip 7 Bluetooth", precio: 329, cantidad: 2 },
        ]
    },
    {
        numero: "VTA-003", cliente: "Diego Salazar", fecha: haceDias(15), total: 347, estado: "Entregado", items: [
            { id: 1, nombre: "Mouse Logitech G502 HERO", precio: 229, cantidad: 1 },
            { id: 6, nombre: "Kit Cargador Xiaomi 65W USB-C", precio: 59, cantidad: 2 },
        ]
    },
    {
        numero: "VTA-002", cliente: "Sofía Mendoza", fecha: haceDias(22), total: 1481, estado: "Entregado", items: [
            { id: 5, nombre: "Samsung Galaxy A55 5G 8GB / 128GB", precio: 1481, cantidad: 1 },
        ]
    },
    {
        numero: "VTA-001", cliente: "Rosa Díaz", fecha: haceDias(28), total: 1049, estado: "Entregado", items: [
            { id: 2, nombre: "Audífonos Sony WH-1000XM4", precio: 1049, cantidad: 1 },
        ]
    },
];

// Nombre visible para los pedidos hechos desde el carrito
export function nombreCliente(usuarioId: string): string {
    if (usuarioId === "admin") return "Luis (Admin)";
    if (usuarioId === "almacen") return "Carlos";
    if (usuarioId === "cliente") return "Juan (Cliente)";
    if (usuarioId === "invitado") return "Invitado";
    return usuarioId;
}

export function leerVentasReales(): Venta[] {
    try {
        const raw = localStorage.getItem("techstore-pedidos");
        const datos = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(datos)) return [];
        return datos.map((p: any) => ({
            numero: p.numero,
            cliente: nombreCliente(p.usuarioId),
            documento: p.comprobante?.documento || "",
            fecha: p.fecha,
            total: p.total,
            estado: p.estado || "Pendiente",
            tipoEntrega: p.tipoEntrega || "envio",
            items: p.items ?? [],
        }));
    } catch {
        return [];
    }
}

// Convierte ISO o "dd/mm/aaaa" (como guardan los pedidos) a número comparable
function aFecha(f: string): number {
    const d = new Date(f);
    if (!isNaN(+d)) return +d;
    const m = f.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (m) return +new Date(+m[3], +m[2] - 1, +m[1], 12);
    return 0;
}

// Todas las ventas: reales primero, luego las de ejemplo, ordenadas por fecha
export function todasLasVentas(): Venta[] {
    return [...leerVentasReales(), ...VENTAS_DEMO].sort((a, b) => aFecha(b.fecha) - aFecha(a.fecha));
}

export function fechaCorta(isoOtexto: string): string {
    const d = new Date(isoOtexto);
    if (isNaN(+d)) return isoOtexto;
    return d.toLocaleDateString("es-PE", { day: "2-digit", month: "2-digit", year: "numeric" });
}
