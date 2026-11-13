# PRD — Primera versión

## Usuarios

- **Administrador:** configura el catálogo, inventario y accesos; administra
  contactos; consulta ventas y reportes; cancela ventas.
- **Vendedor:** consulta catálogo e inventario, registra ventas y consulta las
  ventas propias.

## Objetivo

Permitir operar una librería desde una aplicación web, manteniendo consistentes
las existencias y preservando un historial auditable de ventas y movimientos.

## Criterios de aceptación

- Un administrador puede migrar una base vacía, cargar roles y crear una cuenta
  inicial mediante variables de entorno, sin contraseñas predeterminadas.
- La venta válida persiste cabecera, detalles, pagos, stock y movimientos como
  una única operación.
- Venta inválida por inactividad, insuficiencia de stock o pagos desiguales no
  debe persistirse.
- Cancelar una venta completada restaura stock una vez; una repetición no lo
  vuelve a modificar.
- Toda modificación de stock tiene su movimiento asociado.
- Los endpoints administrativos rechazan a vendedores incluso si se invocan
  directamente, sin depender de ocultar controles en la interfaz.
- Las páginas de administración muestran errores y estados vacíos, y permiten
  gestionar el catálogo y los registros incluidos en el MVP.

## Fuera de alcance

Facturación electrónica, múltiples sucursales, e-commerce, integración con pasarelas,
contabilidad avanzada y aplicación móvil.