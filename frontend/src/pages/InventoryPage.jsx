
import { useEffect, useState } from "react";
import { inventoryService } from "../services/inventory.service";

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    inventoryService.list()
      .then(setProducts)
      .catch(() => setError("No se pudo cargar el inventario"));
  }, []);

  return (
    <div>
      <h1>Inventario</h1>
      <p>Existencias actuales de los productos.</p>

      {error && <p className="error-message">{error}</p>}

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
    </div>
  );
}
