# Especificación funcional del MVP

## Alcance

Sistema web de una sola sucursal para administrar catálogo, inventario, ventas,
pagos, clientes, proveedores, usuarios y reportes. Las decisiones para los
comportamientos que no estaban detallados se registran en
[mvp-decisions.md](./mvp-decisions.md).

## Funcionalidades

1. Iniciar/cerrar sesión con JWT; usuarios inactivos no autentican.
2. Consultar productos activos; `ADMIN` crea, edita y activa/desactiva productos
   y categorías. SKU es único y productos históricos no se eliminan.
3. Consultar existencias, niveles bajos e historial de movimientos. `ADMIN`
   registra ingresos, egresos y ajustes con motivo.
4. Registrar ventas de uno o más productos activos con cliente opcional. El
   servidor verifica existencias, obtiene precios vigentes, calcula importes y
   comprueba los pagos.
5. Cancelar una venta una sola vez (solo `ADMIN`), con motivo, restitución de
   existencias y movimientos `IN`.
6. Administrar clientes, proveedores y usuarios desde rutas protegidas.
7. Consultar resumen de ventas por fechas, productos más vendidos y productos
   con stock bajo.

## Reglas transversales

- API REST JSON bajo `/api/v1`; autenticación Bearer en rutas privadas y roles
  validados por el backend.
- Las colecciones deben paginarse; errores usan estructura consistente.
- Las operaciones críticas de venta e inventario usan transacciones Sequelize.
- El frontend no determina precios ni totales autoritativos.
- Los cambios de esquema se entregan como migraciones Sequelize para MySQL.