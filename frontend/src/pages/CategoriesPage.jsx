import { useEffect, useState } from "react";
import { categoryService } from "../services/category.service";
import { useAuth } from "../context/AuthContext";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const result = await categoryService.list({ page: 1, limit: 100 });
      setCategories(result.data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "No se pudieron cargar las categorías");
    }
  }

  useEffect(() => { load(); }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) await categoryService.update(editingId, form);
      else await categoryService.create(form);
      setForm({ name: "", description: "" });
      setEditingId(null);
      setMessage("Categoría guardada correctamente");
      await load();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "No se pudo guardar la categoría");
    }
  }

  async function toggleActive(category) {
    const nextActive = !category.isActive;
    if (!window.confirm(`¿${nextActive ? "Activar" : "Desactivar"} esta categoría?`)) return;
    try {
      await categoryService.setActive(category.id, nextActive);
      setMessage(`Categoría ${nextActive ? "activada" : "desactivada"}`);
      await load();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "No se pudo desactivar la categoría");
    }
  }

  return (
    <div>
      <h1>Categorías</h1>
      {user?.role === "ADMIN" && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>{editingId ? "Editar categoría" : "Nueva categoría"}</h2>
          <label>Nombre<input required minLength="2" maxLength="100" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
          <label>Descripción<input maxLength="255" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
          <div className="inline-form">
            <button>{editingId ? "Guardar cambios" : "Guardar categoría"}</button>
            {editingId && <button type="button" className="secondary-button" onClick={() => { setEditingId(null); setForm({ name: "", description: "" }); }}>Cancelar</button>}
          </div>
        </form>
      )}
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <div className="table-container">
        <table>
          <thead><tr><th>Nombre</th><th>Descripción</th>{user?.role === "ADMIN" && <th>Acciones</th>}</tr></thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td><td>{category.description || "-"}</td>
                {user?.role === "ADMIN" && <td className="inline-form">
                  <button type="button" className="secondary-button" onClick={() => { setEditingId(category.id); setForm({ name: category.name, description: category.description || "" }); }}>Editar</button>
                  <button type="button" className="secondary-button" onClick={() => toggleActive(category)}>{category.isActive ? "Desactivar" : "Activar"}</button>
                </td>}
              </tr>
            ))}
            {!categories.length && <tr><td colSpan={user?.role === "ADMIN" ? 3 : 2}>No hay categorías activas.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
