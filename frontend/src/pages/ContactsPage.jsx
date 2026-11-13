import { useEffect, useState } from "react";
import { customerService, supplierService } from "../services/contact.service";

const fieldsByType = {
  customers: [
    ["name", "Nombre", true],
    ["documentNumber", "Documento", false],
    ["email", "Correo", false],
    ["phone", "Teléfono", false],
    ["address", "Dirección", false]
  ],
  suppliers: [
    ["name", "Nombre", true],
    ["taxId", "CUIT / Identificación fiscal", false],
    ["email", "Correo", false],
    ["phone", "Teléfono", false],
    ["address", "Dirección", false]
  ]
};

const emptyForm = fields => Object.fromEntries(fields.map(([key]) => [key, ""]));

export default function ContactsPage({ type }) {
  const isCustomer = type === "customers";
  const title = isCustomer ? "Clientes" : "Proveedores";
  const singular = isCustomer ? "cliente" : "proveedor";
  const service = isCustomer ? customerService : supplierService;
  const fields = fieldsByType[type];
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm(fields));
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const result = await service.list({ page: 1, limit: 100 });
      setRecords(result.data);
      setError("");
    } catch (loadError) {
      setError(loadError.response?.data?.message || `No se pudieron cargar ${title.toLowerCase()}`);
    }
  }

  useEffect(() => { load(); }, [type]);

  function editRecord(record) {
    setEditingId(record.id);
    setForm(Object.fromEntries(fields.map(([key]) => [key, record[key] || ""])));
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm(fields));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    const data = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, value || null]));
    try {
      if (editingId) await service.update(editingId, data);
      else await service.create(data);
      resetForm();
      setMessage(`${singular[0].toUpperCase()}${singular.slice(1)} ${editingId ? "actualizado" : "registrado"} correctamente`);
      await load();
    } catch (submitError) {
      setError(submitError.response?.data?.message || `No se pudo guardar ${title.toLowerCase()}`);
    }
  }

  async function toggleActive(record) {
    const nextActive = !record.isActive;
    if (!window.confirm(`¿${nextActive ? "Activar" : "Desactivar"} este registro de ${title.toLowerCase()}?`)) return;
    try {
      await service.setActive(record.id, nextActive);
      setMessage(`Registro ${nextActive ? "activado" : "desactivado"}`);
      await load();
    } catch (submitError) {
      setError(submitError.response?.data?.message || "No se pudo desactivar el registro");
    }
  }

  return (
    <div>
      <h1>{title}</h1>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}
      <form className="form-card" onSubmit={submit}>
        <h2>{editingId ? `Editar ${singular}` : `Nuevo ${singular}`}</h2>
        {fields.map(([key, label, required]) => (
          <label key={key}>
            {label}
            <input required={required} type={key === "email" ? "email" : "text"} maxLength={key === "address" ? 255 : 150}
              value={form[key]} onChange={event => setForm({ ...form, [key]: event.target.value })} />
          </label>
        ))}
        <div className="inline-form">
          <button>{editingId ? "Guardar cambios" : "Crear"}</button>
          {editingId && <button type="button" className="secondary-button" onClick={resetForm}>Cancelar edición</button>}
        </div>
      </form>

      <div className="table-container">
        <table>
          <thead><tr>{fields.map(([, label]) => <th key={label}>{label}</th>)}<th>Acciones</th></tr></thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id}>
                {fields.map(([key]) => <td key={key}>{record[key] || "-"}</td>)}
                <td className="inline-form">
                  <button type="button" className="secondary-button" onClick={() => editRecord(record)}>Editar</button>
                  <button type="button" className="secondary-button" onClick={() => toggleActive(record)}>{record.isActive ? "Desactivar" : "Activar"}</button>
                </td>
              </tr>
            ))}
            {!records.length && <tr><td colSpan={fields.length + 1}>No hay registros activos.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
