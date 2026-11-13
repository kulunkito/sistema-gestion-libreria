# Reglas de negocio del MVP

Consultar [mvp-decisions.md](./mvp-decisions.md) para roles, métodos de pago y alcance de reportes.

## Productos e inventario

- SKU único; nombre obligatorio; precio de venta mayor a cero.
- Stock y stock mínimo no negativos.
- Producto inactivo no se puede vender.
- Toda modificación de stock genera un movimiento dentro de la misma transacción.
- Ajustes manuales requieren motivo y privilegios `ADMIN`.
- Productos vinculados a ventas históricas se desactivan, no se borran físicamente.

## Ventas

- Una venta tiene al menos un detalle, un usuario autenticado y pagos cuyo importe total coincide con el total calculado en el backend.
- El backend determina precios, subtotales y total; verifica stock y estado activo.
- Venta, detalles, pagos, decrementos y movimientos se guardan atómicamente.
- Cancelar requiere un motivo, es una operación de una sola vez y reintegra stock con movimientos `IN` atómicamente.

## Usuarios y permisos

- Email único; contraseñas con bcrypt; usuarios inactivos no autentican; nunca se exponen hashes.
- Siempre debe quedar al menos un administrador activo.
- La API exige autenticación y autorización por rol en cada operación privada.