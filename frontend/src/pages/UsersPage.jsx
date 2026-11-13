import { useEffect, useState } from "react";
import { userService } from "../services/user.service";

const emptyForm = { name: "", email: "", password: "", roleId: "" };

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const result = await userService.list({ page: 1, limit: 100 });
      setUsers(result.data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "No se pudieron cargar los usuarios");
    }
  }

  useEffect(() => {
    Promise.all([userService.roles(), load()])
      .then(([roleList]) => setRoles(roleList))
      .catch(loadError => setError(loadError.response?.data?.message || "No se pudo inicializar la administración de usuarios"));
  }, []);

  function edit(user) {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, password: "", roleId: String(user.roleId) });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const data = {
        name: form.name,
        email: form.email,
        roleId: Number(form.roleId)
      };
      if (form.password) data.password = form.password;
      if (editingId) await userService.update(editingId, data);
      else await userService.create({ ...data, password: form.password });
      reset();
      setMessage("Usuario guardado correctamente");
      await load();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "No se pudo guardar el usuario");
    }
  }

  async function toggleActive(user) {
    try {
      await userService.setActive(user.id, !user.isActive);
      await load();
    } catch (updateError) {
      setError(updateError.response?.data?.message || "No se pudo cambiar el estado");
    }
  }

  return (
    <div>
      <h1>Usuarios</h1>
      <p>Administrá accesos y roles. La contraseña nunca se muestra.</p>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form className="form-card" onSubmit={submit}>
        <h2>{editingId ? "Editar usuario" : "Nuevo usuario"}</h2>
        <label>Nombre<input required minLength="2" maxLength="120" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
        <label>Correo<input required type="email" maxLength="150" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} /></label>
        <label>{editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
          <input required={!editingId} type="password" minLength="8" maxLength="72" value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} />
        </label>
        <label>Rol<select required value={form.roleId} onChange={event => setForm({ ...form, roleId: event.target.value })}>
          <option value="">Seleccionar rol</option>
          {roles.map(role => <option key={role.id} value={role.id}>{role.name}</option>)}
        </select></label>
        <div className="inline-form">
          <button>{editingId ? "Guardar cambios" : "Crear usuario"}</button>
          {editingId && <button type="button" className="secondary-button" onClick={reset}>Cancelar</button>}
        </div>
      </form>
      <div className="table-container">
        <table>
          <thead><tr><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td><td>{user.email}</td><td>{user.role?.name}</td><td>{user.isActive ? "Activo" : "Inactivo"}</td>
                <td className="inline-form">
                  <button type="button" className="secondary-button" onClick={() => edit(user)}>Editar</button>
                  <button type="button" className="secondary-button" onClick={() => toggleActive(user)}>{user.isActive ? "Desactivar" : "Activar"}</button>
                </td>
              </tr>
            ))}
            {!users.length && <tr><td colSpan={5}>No hay usuarios registrados.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
