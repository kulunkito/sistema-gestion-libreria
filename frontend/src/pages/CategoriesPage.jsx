
import { useEffect, useState } from "react";
import { categoryService } from "../services/category.service";
import { useAuth } from "../context/AuthContext";

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      setCategories(await categoryService.list());
    } catch {
      setError("No se pudieron cargar las categorías");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      await categoryService.create({ name, description });
      setName("");
      setDescription("");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "No se pudo crear la categoría");
    }
  }

  return (
    <div>
      <h1>Categorías</h1>

      {user?.role === "ADMIN" && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h3>Nueva categoría</h3>

          <label>Nombre</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />

          <label>Descripción</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <button>Guardar categoría</button>
        </form>
      )}

      {error && <p className="error-message">{error}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.description || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
