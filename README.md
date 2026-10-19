# Proyecto-Integrador-4S
# GameTickets - Plataforma de Reservas de Videojuegos 

Este es un proyecto académico integrador enfocado en el desarrollo frontend. Consiste en una aplicación web de una sola página (SPA) que simula un sistema de reservas de videojuegos, permitiendo a los usuarios explorar un catálogo, ver detalles de cada título y gestionar un carrito de compras funcional.

##  Características Principales

* **Catálogo Dinámico:** Renderizado de videojuegos utilizando información mockeada a través de servicios centralizados.
* **Rutas Parametrizadas:** Navegación fluida hacia los detalles de cada juego mediante su ID de ruta (`/game/:id`).
* **Carrito Persistente:** Gestión de reservas utilizando `LocalStorage` para sobrevivir a recargas de página, y `Signals` de Angular para actualizar contadores en tiempo real.
* **Checkout y Validación:** Implementación de Formularios Reactivos (`Reactive Forms`) para capturar y validar los datos del usuario antes de confirmar la reserva.
* **Diseño Responsivo:** Interfaz adaptable a múltiples dispositivos construida con utilidades modernas.

##  Tecnologías Utilizadas

* **Framework Principal:** Angular (Standalone Components, Signals)
* **Lenguaje:** TypeScript
* **Estructura y Estilos:** HTML5, SCSS
* **Framework de Diseño:** Bootstrap 5 (Integrado vía SCSS)
