# Decisiones del MVP

Este documento define defaults de producto para completar la primera versión cuando las especificaciones originales no detallan el comportamiento. Mantiene el alcance de una sola sucursal y no incluye facturación electrónica, e-commerce ni integraciones de pago.

## Roles y acceso

- `ADMIN` administra usuarios, catálogo, clientes, proveedores e inventario; puede registrar y cancelar ventas y consultar reportes.
- `SELLER` consulta catálogo e inventario, registra ventas y consulta las ventas disponibles según los permisos de la API.
- Los usuarios nuevos se crean activos por defecto y sus contraseñas se guardan con bcrypt. No existe registro público.
- Siempre debe quedar al menos un `ADMIN` activo; no se permite desactivar ni degradar al último administrador.
- La cuenta inicial se crea desde un seeder usando `ADMIN_NAME`, `ADMIN_EMAIL` y `ADMIN_PASSWORD`; no se usan credenciales por defecto.

## Ventas y pagos

- Una venta contiene uno o más productos activos con cantidades enteras positivas.
- El servidor obtiene precios vigentes, calcula importes con dos decimales y no acepta precios o totales enviados por el cliente.
- Se admiten pagos `CASH`, `DEBIT_CARD`, `CREDIT_CARD` y `TRANSFER`; uno o varios pagos deben sumar exactamente el total.
- La venta, sus detalles, pagos, decrementos de stock y movimientos `OUT` se confirman en una única transacción.
- Las ventas quedan asociadas al usuario autenticado; el cliente es opcional.
- Cancelar requiere un motivo y autorización `ADMIN`. Una venta solo se cancela una vez; se reintegra el stock y se registran movimientos `IN` en una transacción.
- No se editan ventas completadas ni se eliminan ventas históricas.

## Inventario

- Los ajustes manuales requieren autorización `ADMIN`, una cantidad positiva y motivo.
- `IN` suma unidades, `OUT` resta unidades y `ADJUSTMENT` establece el stock absoluto indicado. El stock nunca puede quedar negativo.
- El cambio de stock y su movimiento se guardan atómicamente. Los movimientos se conservan como historial.
- Los listados de colecciones usan paginación.

## Catálogo y contactos

- SKU es único; nombre es obligatorio; precio de venta debe ser mayor que cero; stock y stock mínimo no pueden ser negativos.
- Los productos usados en ventas históricas se desactivan en vez de eliminarse.
- Categorías, clientes y proveedores se desactivan lógicamente. Los campos opcionales de contacto no son únicos.
- Solo `ADMIN` crea, edita y desactiva productos, categorías, clientes, proveedores y usuarios.

## Usuarios y reportes

- No hay endpoint público de alta de usuarios. Un administrador puede listar, crear, editar rol/nombre/email, activar y desactivar usuarios.
- Los reportes iniciales son: resumen de ventas por rango de fechas, productos más vendidos y productos con stock bajo. Los rangos incluyen la fecha inicial y final según la fecha local de la base de datos.
- Los reportes excluyen ventas canceladas y no reemplazan reportes contables ni fiscales.

## Errores y validación

- Las entradas externas se validan en la API y las reglas de negocio se verifican en servicios.
- Se mantienen respuestas JSON con `success`, `data` o `message`; los errores de validación pueden incluir `errors`.
- Los errores internos no exponen SQL, trazas ni secretos.
