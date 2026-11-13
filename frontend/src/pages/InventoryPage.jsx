
import { useEffect, useState } from "react";
import { inventoryService } from "../services/inventory.service";
import { productService } from "../services/product.service";
import { supplierService } from "../services/contact.service";
import { useAuth } from "../context/AuthContext";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [movements, setMovements] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    type: "IN",
    quantity: "",
    reason: "",
    supplierId: ""
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const { user } = useAuth();

  async function load() {
    try {
      const [inventory, movementResult] = await Promise.all([
        inventoryService.list(),
        inventoryService.movements()
      ]);
      setProducts(inventory.data);
      setMovements(movementResult.data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || "No se pudo cargar el inventario");
    }
  }

  useEffect(() => {
    load();
    if (user?.role === "ADMIN") {
      supplierService.list()
        .then(result => setSuppliers(result.data))
        .catch(loadError => setError(loadError.response?.data?.message || "No se pudieron cargar proveedores"));
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await inventoryService.createMovement({
        ...form,
        productId: Number(form.productId),
        quantity: Number(form.quantity),
        supplierId: form.supplierId ? Number(form.supplierId) : undefined
      });
      setForm({ productId: "", type: "IN", quantity: "", reason: "", supplierId: "" });
      setMessage("Movimiento registrado correctamente");
      await load();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "No se pudo registrar el movimiento");
    }
  }

  return (
    <div>
      <h1>Inventario</h1>
      <p>Existencias actuales de los productos.</p>

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      {user?.role === "ADMIN" && (
        <form className="form-card" onSubmit={handleSubmit}>
          <h2>Registrar movimiento</h2>
          <label>Producto</label>
          <select required value={form.productId} onChange={event => setForm({ ...form, productId: event.target.value })}>
            <option value="">Seleccionar producto</option>
            {products.map(product => <option key={product.id} value={product.id}>{product.sku} - {product.name}</option>)}
          </select>
          <label>Tipo</label>
          <select value={form.type} onChange={event => setForm({ ...form, type: event.target.value })}>
            <option value="IN">Ingreso</option>
            <option value="OUT">Egreso</option>
            <option value="ADJUSTMENT">Ajustar stock a</option>
          </select>
          <label>{form.type === "ADJUSTMENT" ? "Stock final" : "Cantidad"}</label>
          <input type="number" min={form.type === "ADJUSTMENT" ? 0 : 1} step="1" required value={form.quantity} onChange={event => setForm({ ...form, quantity: event.target.value })} />
          {form.type === "IN" && (
            <>
              <label>Proveedor (opcional)</label>
              <select value={form.supplierId} onChange={event => setForm({ ...form, supplierId: event.target.value })}>
                <option value="">Sin proveedor</option>
                {suppliers.map(supplier => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
            </>
          )}
          <label>Motivo</label>
          <input required maxLength={255} value={form.reason} onChange={event => setForm({ ...form, reason: event.target.value })} />
          <button>Guardar movimiento</button>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Stock actual</th>
              <th>Stock mínimo</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const low = product.stock <= product.minStock;

              return (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.stock}</td>
                  <td>{product.minStock}</td>
                  <td>
                    <span className={low ? "status-low" : "status-ok"}>
                      {low ? "Stock bajo" : "Disponible"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <h2>Historial de movimientos</h2>
      <div className="table-container">
        <table>
          <thead>
            <tr><th>Fecha</th><th>Producto</th><th>Tipo</th><th>Cantidad</th><th>Motivo</th><th>Usuario</th></tr>
          </thead>
          <tbody>
            {movements.map(movement => (
              <tr key={movement.id}>
                <td>{new Date(movement.createdAt).toLocaleString()}</td>
                <td>{movement.product?.sku} - {movement.product?.name}</td>
                <td>{movement.type}</td>
                <td>{movement.quantity}</td>
                <td>{movement.reason || "-"}</td>
                <td>{movement.user?.name || "-"}</td>
              </tr>
            ))}
            {!movements.length && <tr><td colSpan={6}>Todavía no hay movimientos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
