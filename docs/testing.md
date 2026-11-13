# Estrategia de pruebas

## Requisitos

- Node.js 20 o superior (coincide con Vite y Vitest del proyecto).
- MySQL 8 para pruebas que ejecuten migraciones e integración real.

## Comandos

Desde cada carpeta:

```bash
# backend
npm test

# frontend
npm test
npm run build
```

Inicializar una base de desarrollo con `npm run db:migrate` y `npm run db:seed`
desde `backend`; configurar previamente un administrador en `.env`.

## Cobertura mínima

- Login válido/inválido e inactividad; autorización por rol.
- Validaciones y SKU/email únicos.
- Venta con stock suficiente e insuficiente; pagos exactos; atomicidad y
  rollback; movimientos de stock; cancelación y cancelación duplicada.
- Ajustes de inventario sin stock negativo.
- Build de producción y flujos críticos de React.

Las pruebas unitarias actuales simulan los modelos/servicios. Antes de liberar
una instancia se deben ejecutar además las migraciones y pruebas de aceptación
contra MySQL 8 configurado; no se debe sustituir MySQL por otro motor.