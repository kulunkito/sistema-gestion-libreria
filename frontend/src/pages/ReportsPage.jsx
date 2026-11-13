import { useState } from "react";
import { reportService } from "../services/report.service";
import { inventoryService } from "../services/inventory.service";

function today() {
  const date = new Date();
  const localOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - localOffset).toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const [from, setFrom] = useState(today());
  const [to, setTo] = useState(today());
  const [summary, setSummary] = useState(null);
  const [products, setProducts] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [error, setError] = useState("");

  async function load(event) {
    event.preventDefault();
    setError("");
    try {
      const params = { from, to };
      const [sales, topProducts, lowStockProducts] = await Promise.all([
        reportService.salesSummary(params),
        reportService.topProducts(params),
        inventoryService.lowStock()
      ]);
      setSummary(sales);
      setProducts(topProducts);
      setLowStock(lowStockProducts.data);
    } catch (loadError) {
      setError(loadError.response?.data?.message || "No se pudieron cargar los reportes");
    }
  }

  return (
    <div>
      <h1>Reportes</h1>
      <form className="form-card inline-form" onSubmit={load}>
        <label>Desde<input required type="date" value={from} onChange={event => setFrom(event.target.value)} /></label>
        <label>Hasta<input required type="date" value={to} onChange={event => setTo(event.target.value)} /></label>
        <button>Consultar</button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {summary && (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card"><h3>Ventas completadas</h3><strong>{summary.saleCount}</strong></div>
            <div className="dashboard-card"><h3>Facturación</h3><strong>${Number(summary.totalSales).toFixed(2)}</strong></div>
            <div className="dashboard-card"><h3>Promedio por venta</h3><strong>${Number(summary.averageSale).toFixed(2)}</strong></div>
          </div>
          <h2>Productos más vendidos</h2>
          <div className="table-container">
            <table>
              <thead><tr><th>SKU</th><th>Producto</th><th>Unidades</th><th>Importe</th></tr></thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}><td>{product.sku}</td><td>{product.name}</td><td>{product.quantitySold}</td><td>${Number(product.revenue).toFixed(2)}</td></tr>
                ))}
                {!products.length && <tr><td colSpan={4}>No hay ventas en el período seleccionado.</td></tr>}
              </tbody>
            </table>
          </div>
          <h2>Productos con stock bajo</h2>
          <div className="table-container">
            <table>
              <thead><tr><th>SKU</th><th>Producto</th><th>Stock actual</th><th>Stock mínimo</th></tr></thead>
              <tbody>
                {lowStock.map(product => (
                  <tr key={product.id}><td>{product.sku}</td><td>{product.name}</td><td>{product.stock}</td><td>{product.minStock}</td></tr>
                ))}
                {!lowStock.length && <tr><td colSpan={4}>No hay productos con stock bajo.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
