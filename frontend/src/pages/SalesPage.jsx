import { useEffect, useMemo, useState } from "react";
import { customerService } from "../services/contact.service";
import { productService } from "../services/product.service";
import { salesService } from "../services/sales.service";
import { useAuth } from "../context/AuthContext";

const paymentMethods = [
  ["CASH", "Efectivo"],
  ["DEBIT_CARD", "Débito"],
  ["CREDIT_CARD", "Crédito"],
  ["TRANSFER", "Transferencia"]
];

export default function SalesPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [sales, setSales] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [items, setItems] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [payments, setPayments] = useState([{ method: "CASH", amount: "" }]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const total = useMemo(() => items.reduce((sum, item) => {
    return sum + Math.round(Number(item.product.salePrice) * 100) * item.quantity;
  }, 0), [items]);
  const paymentTotal = payments.reduce((sum, payment) => {
    return sum + Math.round(Number(payment.amount || 0) * 100);
  }, 0);
  const paymentIsValid = payments.length === 1 && !payments[0].amount
    ? true
    : payments.every(payment => Number(payment.amount) > 0) && paymentTotal === total;

  async function loadSales(page = 1) {
    const result = await salesService.list({ page, limit: 20 });
    setSales(result.data);
    setPagination(result.pagination);
  }

  useEffect(() => {
    Promise.all([
      productService.list({ page: 1, limit: 100 }),
      customerService.list({ page: 1, limit: 100 }),
      loadSales()
    ]).then(([productResult, customerResult]) => {
      setProducts(productResult.data.filter(product => product.isActive && product.stock > 0));
      setCustomers(customerResult.data);
    }).catch(loadError => {
      setError(loadError.response?.data?.message || "No se pudo cargar el módulo de ventas");
    });
  }, []);

  function addProduct(productId) {
    const product = products.find(item => item.id === Number(productId));
    if (!product) return;
    setItems(current => {
      const existing = current.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return current;
        return current.map(item => item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item);
      }
      return [...current, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId, quantity) {
    const product = products.find(item => item.id === productId);
    if (!product) return;
    const safeQuantity = Math.min(product.stock, Math.max(1, Number(quantity) || 1));
    setItems(current => current.map(item => item.product.id === productId
      ? { ...item, quantity: safeQuantity }
      : item));
  }

  async function submitSale(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await salesService.create({
        customerId: customerId ? Number(customerId) : null,
        items: items.map(item => ({ productId: item.product.id, quantity: item.quantity })),
        payments: payments.map(payment => ({
          method: payment.method,
          amount: Number(payment.amount || (payments.length === 1 ? (total / 100).toFixed(2) : 0))
        }))
      });
      setItems([]);
      setCustomerId("");
      setPayments([{ method: "CASH", amount: "" }]);
      setMessage("Venta registrada correctamente");
      const [productResult] = await Promise.all([
        productService.list({ page: 1, limit: 100 }),
        loadSales(1)
      ]);
      setProducts(productResult.data.filter(product => product.isActive && product.stock > 0));
    } catch (submitError) {
      setError(submitError.response?.data?.message || "No se pudo registrar la venta");
    }
  }

  async function cancelSale(id) {
    setError("");
    try {
      await salesService.cancel(id, cancelReason);
      setCancelId(null);
      setCancelReason("");
      setMessage("Venta cancelada y stock reintegrado");
      await loadSales(pagination.page);
    } catch (cancelError) {
      setError(cancelError.response?.data?.message || "No se pudo cancelar la venta");
    }
  }

  const totalInCurrency = (total / 100).toFixed(2);

  return (
    <div>
      <h1>Ventas</h1>
      <p>Registrá ventas con los precios vigentes y medios de pago.</p>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form className="form-card" onSubmit={submitSale}>
        <h2>Nueva venta</h2>
        <label>Cliente (opcional)</label>
        <select value={customerId} onChange={event => setCustomerId(event.target.value)}>
          <option value="">Consumidor final</option>
          {customers.map(customer => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
        </select>

        <label>Agregar producto</label>
        <select value="" onChange={event => addProduct(event.target.value)}>
          <option value="">Seleccionar producto</option>
          {products.map(product => <option key={product.id} value={product.id}>{product.sku} - {product.name} (stock: {product.stock})</option>)}
        </select>

        <div className="table-container">
          <table>
            <thead><tr><th>Producto</th><th>Precio unitario</th><th>Cantidad</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              {items.map(item => (
                <tr key={item.product.id}>
                  <td>{item.product.name}</td>
                  <td>${Number(item.product.salePrice).toFixed(2)}</td>
                  <td>
                    <input type="number" min="1" max={item.product.stock} value={item.quantity}
                      onChange={event => updateQuantity(item.product.id, event.target.value)} />
                  </td>
                  <td>${(Number(item.product.salePrice) * item.quantity).toFixed(2)}</td>
                  <td><button type="button" className="secondary-button" onClick={() => setItems(current => current.filter(line => line.product.id !== item.product.id))}>Quitar</button></td>
                </tr>
              ))}
              {!items.length && <tr><td colSpan={5}>Agregá al menos un producto.</td></tr>}
            </tbody>
          </table>
        </div>
        <strong className="sale-total">Total estimado: ${totalInCurrency}</strong>
        <p className="muted">El backend vuelve a calcular el total y verifica el stock al guardar.</p>

        <h3>Pagos</h3>
        {payments.map((payment, index) => (
          <div className="inline-form" key={index}>
            <select value={payment.method} onChange={event => setPayments(current => current.map((item, i) => i === index ? { ...item, method: event.target.value } : item))}>
              {paymentMethods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <input aria-label={`Importe del pago ${index + 1}`} type="number" min="0.01" step="0.01"
              placeholder={index === 0 && payments.length === 1 ? totalInCurrency : "Importe"}
              value={payment.amount}
              onChange={event => setPayments(current => current.map((item, i) => i === index ? { ...item, amount: event.target.value } : item))} />
            {payments.length > 1 && <button type="button" className="secondary-button" onClick={() => setPayments(current => current.filter((_, i) => i !== index))}>Quitar</button>}
          </div>
        ))}
        <button type="button" className="secondary-button" onClick={() => setPayments(current => [...current, { method: "CASH", amount: "" }])}>Agregar pago</button>
        {!paymentIsValid && <p className="error-message">Los pagos deben sumar el total estimado.</p>}
        <button disabled={!items.length || !paymentIsValid}>Registrar venta</button>
      </form>

      <h2>Historial de ventas</h2>
      <div className="table-container">
        <table>
          <thead><tr><th>Número</th><th>Fecha</th><th>Vendedor</th><th>Cliente</th><th>Total</th><th>Estado</th><th>Acciones</th></tr></thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>#{sale.id}</td>
                <td>{new Date(sale.createdAt).toLocaleString()}</td>
                <td>{sale.user?.name}</td>
                <td>{sale.customer?.name || "Consumidor final"}</td>
                <td>${Number(sale.total).toFixed(2)}</td>
                <td>{sale.status === "COMPLETED" ? "Completada" : "Cancelada"}</td>
                <td>
                  {user?.role === "ADMIN" && sale.status === "COMPLETED" && (
                    cancelId === sale.id ? (
                      <div className="inline-form">
                        <input aria-label="Motivo de cancelación" required maxLength={255} value={cancelReason} onChange={event => setCancelReason(event.target.value)} />
                        <button type="button" disabled={!cancelReason.trim()} onClick={() => cancelSale(sale.id)}>Confirmar</button>
                        <button type="button" className="secondary-button" onClick={() => setCancelId(null)}>Volver</button>
                      </div>
                    ) : <button type="button" className="secondary-button" onClick={() => setCancelId(sale.id)}>Cancelar venta</button>
                  )}
                  {sale.status === "CANCELLED" && <span title={sale.cancellationReason}>Motivo: {sale.cancellationReason}</span>}
                </td>
              </tr>
            ))}
            {!sales.length && <tr><td colSpan={7}>No hay ventas registradas.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button type="button" disabled={pagination.page <= 1} onClick={() => loadSales(pagination.page - 1)}>Anterior</button>
        <span>Página {pagination.page} de {pagination.totalPages}</span>
        <button type="button" disabled={pagination.page >= pagination.totalPages} onClick={() => loadSales(pagination.page + 1)}>Siguiente</button>
      </div>
    </div>
  );
}
