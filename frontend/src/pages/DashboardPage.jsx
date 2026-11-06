
import { Link } from "react-router-dom";

const modules = [
  { title: "Productos", description: "Administrar catálogo", to: "/products" },
  { title: "Categorías", description: "Organizar productos", to: "/categories" },
  { title: "Ventas", description: "Registrar operaciones", to: "/sales" },
  { title: "Inventario", description: "Consultar existencias", to: "/inventory" }
];

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bienvenido al sistema de gestión de librería.</p>

      <div className="dashboard-grid">
        {modules.map(module => (
          <Link className="module-card" to={module.to} key={module.to}>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
            <span>Ingresar →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
