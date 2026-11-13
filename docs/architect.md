# Arquitectura

## Stack

- Frontend: React, Vite, JavaScript ES Modules, React Router, Axios y CSS.
- Backend: Node.js, Express, Sequelize, MySQL, JWT, bcrypt y Zod.
- Pruebas: Vitest, Supertest y React Testing Library.

## Backend

`routes` registra endpoints y autorización; `middlewares` resuelve autenticación,
roles, validación y errores; `controllers` adapta HTTP a servicios; `services`
contiene reglas de negocio y transacciones; `models` define entidades y
relaciones; `config` configura MySQL. Los servicios no dependen de Express.

Las ventas, cancelaciones y cambios de inventario se ejecutan en transacciones
Sequelize con filas de productos bloqueadas para actualización. El esquema se
mantiene con migraciones y seeders; la aplicación no sincroniza ni altera tablas
automáticamente.

## Frontend

`pages` compone pantallas, `services` encapsula Axios, `context` mantiene sesión,
`routes` protege vistas por autenticación y rol, y `layouts` proporciona la
navegación. Las reglas autoritativas de negocio permanecen en el backend.

## Seguridad y configuración

Los secretos se obtienen del entorno. CORS solo permite `FRONTEND_URL`; el
servidor requiere un `JWT_SECRET` de al menos 32 caracteres. Los hashes de
contraseña se excluyen del scope por defecto del modelo User.