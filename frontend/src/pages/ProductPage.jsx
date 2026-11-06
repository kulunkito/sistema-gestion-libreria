
import { useEffect, useState } from "react";
import { productService } from "../services/product.service";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    setLoading(true);

    try {
      const response = await productService.list({
        search,
        page: 1,
        limit: 50
      });

      setProducts(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al cargar productos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSearch(event) {
    event.preventDefault();
    await loadProducts();
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Productos</h1>
          <p>Administración del catálogo de artículos.</p>
        </div>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          placeholder="Buscar por nombre o SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button>Buscar</button>
      </form>

      <ErrorMessage message={error} />

      {loading ? <Loading /> : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Producto</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                {user?.role === "ADMIN" && <th>Estado</th>}
              </tr>
            </thead>

            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || "-"}</td>
                  <td>${Number(product.salePrice).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  {user?.role === "ADMIN" && (
                    <td>{product.isActive ? "Activo" : "Inactivo"}</td>
                  )}
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan={6}>No hay productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
