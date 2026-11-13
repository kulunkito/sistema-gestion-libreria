# Checklist del MVP

- [ ] Aplicar migraciones y seeders para una instalación limpia, con rol y administrador inicial configurables por entorno.
- [ ] Completar validaciones y CRUD administrativo para productos, categorías, usuarios, clientes y proveedores.
- [ ] Implementar ventas atómicas con precios del servidor, pagos exactos, movimientos de stock, cancelación protegida e historial.
- [ ] Implementar ajustes manuales de inventario transaccionales y listados paginados de movimientos.
- [ ] Implementar reportes de ventas por período, productos más vendidos y stock bajo.
- [ ] Conectar pantallas y navegación a los flujos administrativos y de vendedor definidos en `mvp-decisions.md`.
- [ ] Añadir y ejecutar pruebas para reglas de negocio, permisos, atomicidad y errores.
- [ ] Verificar instalación y comandos de desarrollo descritos en README.

No marcar una tarea como completa hasta verificar sus pruebas y criterios correspondientes.

La implementación del MVP está incorporada. Las tareas permanecen abiertas
hasta ejecutar aceptación con una instancia MySQL 8 configurada; las pruebas
unitarias no sustituyen esa verificación de integración.