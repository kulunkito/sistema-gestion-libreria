
# AGENTS.md — Project Development Instructions

## 1. Project identity

Project: Library Management System (Sistema de Gestión de Librería).

This is a full-stack web application for managing:
- Products and categories.
- Inventory and stock movements.
- Sales and payments.
- Customers and suppliers.
- Users and permissions.
- Commercial reports.

## 2. Mandatory technology stack

### Frontend
- React
- Vite
- JavaScript (ES Modules)
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- JavaScript (ES Modules)
- Sequelize ORM
- MySQL
- JWT
- bcrypt
- Zod

### Testing
- Vitest
- Supertest
- React Testing Library

Do not introduce another framework or ORM without updating the specifications and obtaining approval.

## 3. Source of truth

Before implementing any feature, read the relevant documents:

1. docs/spec.md
2. docs/prd.md
3. docs/architect.md
4. docs/data-model.md
5. docs/api.md
6. docs/business-rules.md
7. docs/tasks.md
8. docs/testing.md

The specifications define the expected behavior.

If documents contradict each other:
- Do not guess.
- Identify the conflict.
- Propose a resolution.
- Update the relevant documentation before implementation.

Never silently change a business rule.

## 4. Architecture requirements

### Backend

Use a layered architecture:

- Routes: HTTP endpoint definitions.
- Controllers: HTTP request and response handling.
- Services: business logic.
- Models: Sequelize entities and associations.
- Middlewares: authentication, authorization and error handling.
- Validators: input validation.
- Config: database and environment configuration.

Controllers must not contain complex business logic.

Services must not depend on Express request or response objects.

All database access must use Sequelize.

### Frontend

Organize the application by responsibility:

- Pages: application screens.
- Components: reusable UI elements.
- Services: API communication.
- Context: shared application state.
- Hooks: reusable React logic.
- Layouts: page structure.
- Routes: navigation and protected routes.

Do not place all application logic inside App.jsx.

## 5. Coding conventions

- Use JavaScript ES Modules.
- Use camelCase for variables and functions.
- Use PascalCase for React components and model classes.
- Use descriptive names.
- Avoid duplicated code.
- Keep functions small and focused.
- Do not use unnecessary abstractions.
- Do not commit secrets.
- Do not use console.log as permanent error handling.

## 6. Business rules

The following rules are mandatory:

### Products
- SKU must be unique.
- Product name is required.
- Sale price must be greater than zero.
- Stock cannot be negative.
- Inactive products cannot be sold.
- Products referenced by historical transactions cannot be physically deleted.

### Sales
- A sale must contain at least one item.
- The backend calculates all prices and totals.
- The backend verifies stock availability.
- Every sale must have an authenticated user.
- Payment totals must equal the sale total.
- A sale and its details must be persisted atomically.

### Inventory
- Every stock modification must create a StockMovement.
- Sales create OUT movements.
- Sale cancellations create IN movements.
- Manual adjustments require a reason.
- Stock must never become negative.
- Inventory changes must use database transactions.

### Users
- Email must be unique.
- Passwords must be hashed using bcrypt.
- Never return password hashes.
- Inactive users cannot authenticate.
- Authorization must be enforced in the backend.

## 7. Security

- Validate all external input.
- Use JWT authentication.
- Enforce role-based authorization.
- Never trust frontend prices or calculated totals.
- Use environment variables for secrets.
- Do not expose database credentials.
- Configure CORS explicitly.
- Use parameterized ORM queries.
- Return safe and consistent error responses.

## 8. Database requirements

- MySQL is the only database for this project.
- Sequelize is the ORM.
- Use migrations to change database schemas.
- Do not use sequelize.sync({ alter: true }) in production.
- Use foreign keys and appropriate indexes.
- Use DECIMAL for monetary values.
- Use transactions for critical operations.
- Preserve historical transaction details.

## 9. API requirements

- Base path: /api/v1.
- REST conventions.
- JSON request and response bodies.
- Consistent success and error structures.
- Appropriate HTTP status codes.
- Pagination for collection endpoints.
- Authentication for private endpoints.
- ADMIN authorization for administrative operations.

## 10. Development workflow

For every task:

1. Read the relevant specifications.
2. Identify dependencies.
3. Create an implementation plan.
4. Identify affected files.
5. Implement only the requested scope.
6. Add or update tests.
7. Run relevant tests.
8. Verify business rules.
9. Update documentation if necessary.
10. Update docs/tasks.md.

Do not mark a task DONE if its acceptance criteria have not been verified.

## 11. Testing requirements

Test at least:

- Valid and invalid authentication.
- Authorization by role.
- Product validation.
- Duplicate SKU.
- Sale with sufficient stock.
- Sale with insufficient stock.
- Transaction rollback.
- Stock movement creation.
- Sale cancellation.
- Duplicate cancellation.
- Payment total validation.

## 12. Prohibited practices

- Do not bypass business rules.
- Do not calculate authoritative sale totals in the frontend.
- Do not modify stock directly without a movement.
- Do not physically delete historical transactions.
- Do not expose passwords or secrets.
- Do not implement undocumented features.
- Do not silently change database schemas.
- Do not ignore failing tests.

## 13. Definition of Done

A task is complete only when:

- Implementation follows the architecture.
- Acceptance criteria are satisfied.
- Business rules are respected.
- Appropriate tests pass.
- Error cases are handled.
- Documentation is updated.
- No unrelated functionality is broken.

## 14. Scope management

The first release is a single-branch library management system.

Out of scope unless explicitly approved:
- Electronic invoicing.
- Multiple branches.
- E-commerce.
- Native mobile applications.
- Advanced accounting.
- External payment gateway integrations.

## 15. Agent communication

When finishing a task, report:

- What was implemented.
- Files created or modified.
- Tests executed.
- Test results.
- Known limitations.
- Documentation changes.
- Suggested next task.
