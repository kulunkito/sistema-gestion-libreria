import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  transaction: { LOCK: { UPDATE: "UPDATE" } },
  product: null,
  saleStatus: "COMPLETED",
  sale: { id: 41, status: "COMPLETED" },
  models: {
    Customer: { findByPk: vi.fn() },
    Product: { findAll: vi.fn() },
    Payment: { bulkCreate: vi.fn() },
    Sale: { create: vi.fn(), findByPk: vi.fn() },
    SaleDetail: { bulkCreate: vi.fn(), findAll: vi.fn() },
    StockMovement: { create: vi.fn() },
    User: {}
  },
  transactionRunner: vi.fn()
}));

vi.mock("../src/config/database.js", () => ({
  default: { transaction: state.transactionRunner }
}));

vi.mock("../src/models/index.js", () => state.models);

import { cancelSale, createSale } from "../src/services/sale.service.js";

describe("sale service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.product = {
      id: 7,
      name: "Libro",
      salePrice: "12.50",
      stock: 5,
      isActive: true,
      update: vi.fn(async function update(values) {
        Object.assign(this, values);
      })
    };
    state.sale = {
      id: 41,
      status: "COMPLETED",
      update: vi.fn(async function update(values) {
        Object.assign(this, values);
      })
    };
    state.saleStatus = "COMPLETED";
    state.transactionRunner.mockImplementation(callback => callback(state.transaction));
    state.models.Customer.findByPk.mockResolvedValue({ id: 2, isActive: true });
    state.models.Product.findAll.mockResolvedValue([state.product]);
    state.models.Sale.create.mockResolvedValue(state.sale);
    state.models.Sale.findByPk.mockImplementation(() => Promise.resolve(state.sale));
    state.models.SaleDetail.bulkCreate.mockResolvedValue([]);
    state.models.Payment.bulkCreate.mockResolvedValue([]);
    state.models.StockMovement.create.mockResolvedValue({});
    state.models.SaleDetail.findAll.mockResolvedValue([]);
  });

  it("calculates totals from stored prices and writes payment and stock records", async () => {
    const result = await createSale({
      customerId: 2,
      items: [{ productId: 7, quantity: 2 }],
      payments: [{ method: "CASH", amount: 25 }]
    }, 3);

    expect(result).toBe(state.sale);
    expect(state.models.Sale.create).toHaveBeenCalledWith(
      expect.objectContaining({ total: "25.00", userId: 3 }),
      expect.objectContaining({ transaction: state.transaction })
    );
    expect(state.models.SaleDetail.bulkCreate).toHaveBeenCalledWith([
      expect.objectContaining({ unitPrice: "12.50", subtotal: "25.00", quantity: 2 })
    ], expect.any(Object));
    expect(state.models.Payment.bulkCreate).toHaveBeenCalledWith([
      expect.objectContaining({ amount: "25.00", method: "CASH" })
    ], expect.any(Object));
    expect(state.product.update).toHaveBeenCalledWith({ stock: 3 }, expect.any(Object));
    expect(state.models.StockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: "OUT", quantity: 2, referenceId: 41 }),
      expect.any(Object)
    );
  });

  it("rejects insufficient stock before persisting a sale", async () => {
    state.product.stock = 1;

    await expect(createSale({
      items: [{ productId: 7, quantity: 2 }],
      payments: [{ method: "CASH", amount: 25 }]
    }, 3)).rejects.toMatchObject({ status: 409 });

    expect(state.models.Sale.create).not.toHaveBeenCalled();
    expect(state.models.StockMovement.create).not.toHaveBeenCalled();
  });

  it("rejects payment totals that differ from the server-calculated total", async () => {
    await expect(createSale({
      items: [{ productId: 7, quantity: 2 }],
      payments: [{ method: "CASH", amount: 24.99 }]
    }, 3)).rejects.toMatchObject({ status: 422 });

    expect(state.models.Sale.create).not.toHaveBeenCalled();
    expect(state.product.update).not.toHaveBeenCalled();
  });

  it("does not restore stock a second time for a cancelled sale", async () => {
    state.sale = { id: 41, status: "CANCELLED" };
    state.models.SaleDetail.findAll.mockResolvedValue([]);

    await expect(cancelSale(41, "duplicada", 3)).rejects.toMatchObject({ status: 409 });

    expect(state.models.SaleDetail.findAll).not.toHaveBeenCalled();
    expect(state.models.StockMovement.create).not.toHaveBeenCalled();
  });

  it("restores stock and records an inbound movement when cancelling", async () => {
    state.models.SaleDetail.findAll.mockResolvedValue([{ productId: 7, quantity: 2 }]);
    state.models.Product.findAll.mockResolvedValue([state.product]);

    await cancelSale(41, "Error de caja", 3);

    expect(state.product.update).toHaveBeenCalledWith({ stock: 7 }, expect.any(Object));
    expect(state.models.StockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "IN",
        quantity: 2,
        referenceType: "SALE_CANCELLATION",
        referenceId: 41
      }),
      expect.any(Object)
    );
    expect(state.sale.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "CANCELLED",
        cancelledBy: 3,
        cancellationReason: "Error de caja"
      }),
      expect.any(Object)
    );
  });
});
