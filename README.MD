
# Sistema de Gestión de Librería

Aplicación web full-stack para administrar productos, inventario, ventas, clientes y proveedores.

## Tecnologías

- React + Vite
- Node.js + Express
- MySQL
- Sequelize
- JWT
- Axios

## Requisitos

- Node.js 20 o superior.
- MySQL 8 o superior.
- npm.

## Instalación

### 1. Base de datos

Crear una base de datos MySQL:

```sql
CREATE DATABASE libreria_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Configurar las variables de entorno y ejecutar:

```bash
npm run dev
```

### 3. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

### 4. Acceso

Frontend:

http://localhost:5173

Backend:

http://localhost:3000

Health check:

http://localhost:3000/api/v1/health

## Documentación

Consultar la carpeta docs/.

## Metodología

Desarrollo guiado por especificaciones (SDD).

Consultar AGENTS.md antes de desarrollar nuevas funcionalidades.
