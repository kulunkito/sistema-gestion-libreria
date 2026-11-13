import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { categoryService } from "../services/category.service";
import { productService } from "../services/product.service";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

const emptyForm = {
  sku: "",
  name: "",
  description: "",
  categoryId: "",
  purchasePrice: "",
  salePrice: "",
  stock: "0",
  minStock: "0",
  barcode: ""
};

export default function ProductsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  async function loadProducts() {
    setLoading(true);
    try {
      const response = await productService.list({ search, page: 1, limit: 100 });
      setProducts(response.data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    if (isAdmin) {
      categoryService.list({ page: 1, limit: 100 })
        .then(result => setCategories(result.data.filter(category => category.isActive)))
        .catch(loadError => setError(loadError.response?.data?.message || "No se pudieron cargar categorías"));
    }
  }, []);

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function edit(product) {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description || "",
      categoryId: String(product.categoryId),
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: String(product.stock),
      minStock: String(product.minStock),
      barcode: product.barcode || ""
    });
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const data = {
      ...form,
      categoryId: Number(form.categoryId),
      purchasePrice: Number(form.purchasePrice),
      salePrice: Number(form.salePrice),
      minStock: Number(form.minStock),
      barcode: form.barcode || null
    };
    if (!editingId) data.stock = Number(form.stock);
    else delete data.stock;
    try {
      if (editingId) await productService.update(editingId, data);
      else await productService.create(data);
      setMessage(`Producto ${editingId ? "actualizado" : "creado"} correctamente`);
      reset();
      await loadProducts();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "No se pudo guardar el producto");
    }
  }

  async function toggleActive(product) {
    const nextActive = !product.isActive;
    if (!window.confirm(`¿${nextActive ? "Activar" : "Desactivar"} ${product.name}?`)) return;
    try {
      await productService.setActive(product.id, nextActive);
      setMessage(`Producto ${nextActive ? "activado" : "desactivado"}`);
      await loadProducts();
    } catch (saveError) {
      setError(saveError.response?.data?.message || "No se pudo desactivar el producto");
    }
  }

  return (
    <div>
      <div className="page-heading">
        <div><h1>Productos</h1><p>Administración del catálogo de artículos.</p></div>
      </div>
      <form className="search-form" onSubmit={event => { event.preventDefault(); loadProducts(); }}>
        <input placeholder="Buscar por nombre o SKU..." value={search} onChange={event => setSearch(event.target.value)} />
        <button>Buscar</button>
      </form>
      <ErrorMessage message={error} />
      {message && <p className="success-message">{message}</p>}

      {isAdmin && (
        <form className="form-card" onSubmit={submit}>
          <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
          <div className="form-grid">
            <label>SKU<input required maxLength="50" value={form.sku} onChange={event => setForm({ ...form, sku: event.target.value })} /></label>
            <label>Nombre<input required minLength="2" maxLength="150" value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} /></label>
            <label>Categoría<select required value={form.categoryId} onChange={event => setForm({ ...form, categoryId: event.target.value })}>
              <option value="">Seleccionar</option>
              {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select></label>
            <label>Precio de compra<input required type="number" min="0" step="0.01" value={form.purchasePrice} onChange={event => setForm({ ...form, purchasePrice: event.target.value })} /></label>
            <label>Precio de venta<input required type="number" min="0.01" step="0.01" value={form.salePrice} onChange={event => setForm({ ...form, salePrice: event.target.value })} /></label>
            {!editingId && <label>Stock inicial<input type="number" min="0" step="1" value={form.stock} onChange={event => setForm({ ...form, stock: event.target.value })} /></label>}
            <label>Stock mínimo<input type="number" min="0" step="1" value={form.minStock} onChange={event => setForm({ ...form, minStock: event.target.value })} /></label>
            <label>Código de barras<input maxLength="100" value={form.barcode} onChange={event => setForm({ ...form, barcode: event.target.value })} /></label>
            <label className="form-grid-wide">Descripción<textarea maxLength="5000" value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label>
          </div>
          <div className="inline-form">
            <button>{editingId ? "Guardar cambios" : "Crear producto"}</button>
            {editingId && <button type="button" className="secondary-button" onClick={reset}>Cancelar</button>}
          </div>
        </form>
      )}

      {loading ? <Loading /> : (
        <div className="table-container">
          <table>
            <thead><tr><th>SKU</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th>{isAdmin && <th>Estado</th>}{isAdmin && <th>Acciones</th>}</tr></thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.sku}</td><td>{product.name}</td><td>{product.category?.name || "-"}</td>
                  <td>${Number(product.salePrice).toFixed(2)}</td><td>{product.stock}</td>
                  {isAdmin && <td>{product.isActive ? "Activo" : "Inactivo"}</td>}
                  {isAdmin && <td className="inline-form">
                    <button type="button" className="secondary-button" onClick={() => edit(product)}>Editar</button>
                    <button type="button" className="secondary-button" onClick={() => toggleActive(product)}>{product.isActive ? "Desactivar" : "Activar"}</button>
                  </td>}
                </tr>
              ))}
              {products.length === 0 && <tr><td colSpan={isAdmin ? 7 : 5}>No hay productos registrados.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
