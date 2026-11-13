
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const modules = [
    { title: "Productos", description: "Administrar catálogo", to: "/products" },
    { title: "Categorías", description: "Organizar productos", to: "/categories" },
    { title: "Ventas", description: "Registrar operaciones", to: "/sales" },
    { title: "Inventario", description: "Consultar existencias", to: "/inventory" },
    ...(user?.role === "ADMIN" ? [
      { title: "Clientes", description: "Administrar clientes", to: "/customers" },
      { title: "Proveedores", description: "Administrar proveedores", to: "/suppliers" },
      { title: "Usuarios", description: "Administrar accesos", to: "/users" },
      { title: "Reportes", description: "Consultar indicadores", to: "/reports" }
    ] : [])
  ];

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
