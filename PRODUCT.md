# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Clientes**: Compradores finales interesados en tecnología (smartphones, audio, periféricos, cómputo). Buscan explorar productos, comparar especificaciones, gestionar su carrito con cálculo de envío en tiempo real y consultar el estado de sus pedidos en historial.
- **Operadores de Almacén**: Personal logístico responsable del stock, registro de entradas de mercadería y consulta de trazabilidad en el libro Kardex (entradas y salidas por ventas).
- **Administradores del Negocio**: Supervisores con acceso total a métricas comerciales (ingresos hoy/mes, volumen de ventas, productos más vendidos), catálogo global, gestión y auditoría de usuarios/roles y generación de reportes con filtros por período.

## Product Purpose

TechStore es una plataforma de comercio electrónico y gestión operativa de tecnología. Su propósito es brindar una experiencia de compra fluida y transparente al cliente, al tiempo que integra la logística de inventario y el control directivo del negocio en un ecosistema unificado. El éxito se define por una navegación ágil y accesible, precisión de stock sin descalces y preparación modular para la integración con servicios backend.

## Positioning

Unificación en una sola aplicación web de la experiencia de compra B2C con la cadena operativa interna (Almacén con Kardex y Administración con control de accesos), ofreciendo trazabilidad en tiempo real desde la compra en carrito hasta el registro de salida en el inventario.

## Operating Context

- **Navegadores modernos**: Aplicación web responsiva (desktop, tablet, móvil).
- **Entorno académico y profesional**: Proyecto del curso Full Stack (UTP, Ciclo 09).
- **Transición técnica**: Actualmente operando en modo prototipo con estado en React Context y persistencia temporal en `localStorage`, en proceso de desacople hacia una arquitectura cliente-servidor con API REST.

## Capabilities and Constraints

- **Catálogo y Búsqueda**: Filtrado por categorías (Smartphones, Audio, Periféricos, Computadoras, Accesorios) y búsqueda instantánea por nombre.
- **Carrito y Checkout**: Control estricto de disponibilidad según inventario, cálculo de envío (gratis sobre S/ 499, de lo contrario S/ 19) y confirmación de pedidos.
- **Gestión de Inventario y Kardex**: Entradas manuales de almacén y salidas automáticas descontadas en cada venta confirmada.
- **Control de Acceso y Roles**: Rutas protegidas (`admin`, `almacen`, `cliente`) con cuentas demo integradas para evaluación inmediata.
- **Arquitectura de Frontend**: React 19, TypeScript, Vite, React Router DOM v7 y Vanilla CSS modular. Preparar servicios modulares para consumo de endpoints futuros.

## Brand Commitments

- **Nombre de Marca**: TechStore.
- **Identidad**: Moderna, tecnológica, confiable y sobria, con tipografía clara y contrastes visuales balanceados. Moneda en Soles peruanos (S/).
- **Precios e Íconos**: Valores de referencia basados en el mercado peruano de retail tecnológico y catálogo con imágenes locales optimizadas en `public/productos/`.

## Evidence on Hand

- Catálogo inicial de productos con imágenes locales en `public/productos/`.
- Cuentas demo preconfiguradas: `admin` / `123`, `almacen` / `123`, `cliente` / `123`.
- Historial seed de transacciones y movimientos Kardex matemáticamente coherentes con el stock de cada producto en `src/data/productos.ts` y `src/data/ventas.ts`.

## Product Principles

1. **Trazabilidad Continua**: Cada acción de compra o ajuste logístico se refleja con coherencia en el inventario y las métricas comerciales.
2. **Claridad Operativa por Rol**: Cada interfaz (Cliente, Almacén, Administrador) prioriza la tarea clave de su usuario sin fricciones innecesarias.
3. **Resiliencia y Modularidad**: Separación limpia entre la capa de presentación y la capa de datos/servicios para facilitar la conexión con el backend.
4. **Diseño Ágil y Directo (Code-First)**: Interfaces pulidas construidas directamente en código con excelencia en maquetación, feedback de estado y accesibilidad.
