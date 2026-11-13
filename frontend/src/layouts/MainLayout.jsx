
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: "⌂" },
    { to: "/products", label: "Productos", icon: "▤" },
    { to: "/categories", label: "Categorías", icon: "▦" },
    { to: "/sales", label: "Ventas", icon: "$" },
    { to: "/inventory", label: "Inventario", icon: "▣" },
    ...(user?.role === "ADMIN" ? [
      { to: "/customers", label: "Clientes", icon: "♙" },
      { to: "/suppliers", label: "Proveedores", icon: "▧" },
      { to: "/users", label: "Usuarios", icon: "♧" },
      { to: "/reports", label: "Reportes", icon: "▥" }
    ] : [])
  ];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="brand">📚 Librería</h2>

        <nav>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-user">
          <span>{user?.name}</span>
          <small>{user?.role}</small>
          <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <h3>Panel de gestión</h3>
          <span>{user?.name}</span>
        </header>

        <section className="page-content">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
