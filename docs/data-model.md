# Modelo de datos

Todas las entidades usan timestamps `created_at` y `updated_at`. Los importes
usan `DECIMAL(12,2)`; los IDs y relaciones usan claves foráneas MySQL.
Implementación: modelos Sequelize y migración inicial en
`backend/src/migrations/`.

| Entidad | Datos principales | Relaciones |
|---|---|---|
| `roles` | nombre único, descripción | Un rol tiene usuarios |
| `users` | rol, nombre, email único, hash bcrypt, activo | Ventas y movimientos tienen usuario |
| `categories` | nombre único, descripción, activo | Una categoría tiene productos |
| `products` | categoría, SKU único, barcode opcional único, descripción, precios, stock y mínimo, activo | Detalles históricos y movimientos impiden borrado físico |
| `customers` | nombre, documento, correo, teléfono, dirección, activo | Venta opcional |
| `suppliers` | nombre, identificación fiscal, correo, teléfono, dirección, activo | Movimiento de inventario opcional |
| `sales` | vendedor, cliente opcional, total, estado, datos de cancelación | Tiene detalles y pagos |
| `sale_details` | venta, producto, cantidad, precio unitario, subtotal | Preserva el precio histórico |
| `payments` | venta, método, importe | Métodos: efectivo, débito, crédito y transferencia |
| `stock_movements` | producto, usuario, proveedor opcional, tipo, cantidad, motivo y referencia | Tipos `IN`, `OUT`, `ADJUSTMENT` |

Las ventas y sus detalles/pagos usan `RESTRICT` para preservar historial; el
cliente o proveedor asociado puede quedar nulo si se elimina físicamente, aunque
la aplicación solo ofrece desactivación lógica. Las migraciones crean índices
para fecha de venta e historial por producto.