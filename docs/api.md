# API MVP

Base URL: `/api/v1`. Las respuestas exitosas usan `{ success: true, data }`.
Las colecciones paginadas incluyen `pagination` (`page`, `limit`, `total`,
`totalPages`). Las rutas privadas requieren `Authorization: Bearer <JWT>`.

## Sesión

- `POST /auth/login` (`email`, `password`)
- `GET /auth/me`

## Catálogo

- `GET /products?page=&limit=&search=&categoryId=`
- `GET /products/:id`
- `POST /products` (`ADMIN`; stock inicial opcional genera movimiento `IN`)
- `PUT /products/:id` (`ADMIN`; no modifica stock)
- `PATCH /products/:id/status` (`ADMIN`; body `{ "isActive": boolean }`, cambio lógico de estado)
- `GET /categories?page=&limit=`
- `POST /categories`, `PUT /categories/:id`, `PATCH /categories/:id/status` (`ADMIN`)

## Ventas

- `GET /sales?page=&limit=&from=&to=` (admin: todas; vendedor: propias)
- `GET /sales/:id` (mismo alcance que la lista)
- `POST /sales` (`ADMIN` o `SELLER`): opcional `customerId`, `items` con `productId` y `quantity`, y `payments` con método e importe. Los precios/totales del cliente se ignoran.
- `POST /sales/:id/cancel` (`ADMIN`; requiere `reason`)

## Inventario

- `GET /inventory?page=&limit=`
- `GET /inventory/low-stock?page=&limit=`
- `GET /inventory/movements?page=&limit=`
- `POST /inventory/movements` (`ADMIN`; `productId`, `type`, `quantity`, `reason`, `supplierId` opcional)

Para `ADJUSTMENT`, `quantity` es el stock final, incluido cero. Para `IN` y `OUT`, es la cantidad positiva a mover.

## Administración

- `GET /customers?page=&limit=&search=` (usuarios autenticados)
- `POST /customers`, `PUT /customers/:id`, `PATCH /customers/:id/status` (`ADMIN`; status recibe `{ "isActive": boolean }`)
- CRUD equivalente en `/suppliers` (`ADMIN`; status recibe `{ "isActive": boolean }`)
- `GET /users`, `GET /users/roles`, `POST /users`, `PUT /users/:id`, `PATCH /users/:id/status` (`ADMIN`)
- `GET /reports/sales-summary?from=&to=` (`ADMIN`)
- `GET /reports/top-products?from=&to=&limit=` (`ADMIN`)

Los errores siguen `{ success: false, message }`; las validaciones pueden
incluir `errors` con campo y descripción.