import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  transaction: { LOCK: { UPDATE: "UPDATE" } },
  product: null,
  transactionRunner: vi.fn(),
  models: {
    Product: { findByPk: vi.fn() },
    StockMovement: { create: vi.fn() },
    Supplier: { findByPk: vi.fn() }
  }
}));

vi.mock("../src/config/database.js", () => ({
  default: {
    transaction: state.transactionRunner,
    col: vi.fn(value => value)
  }
}));
vi.mock("../src/models/index.js", () => state.models);

import { createMovement } from "../src/services/inventory.service.js";

describe("inventory service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.product = {
      id: 4,
      name: "Libro",
      stock: 5,
      isActive: true,
      update: vi.fn(async function update(values) {
        Object.assign(this, values);
      })
    };
    state.transactionRunner.mockImplementation(callback => callback(state.transaction));
    state.models.Product.findByPk.mockResolvedValue(state.product);
    state.models.Supplier.findByPk.mockResolvedValue({ id: 2, isActive: true });
    state.models.StockMovement.create.mockResolvedValue({ id: 5 });
  });

  it("records an adjustment to zero as a positive movement delta", async () => {
    await createMovement({
      productId: 4,
      type: "ADJUSTMENT",
      quantity: 0,
      reason: "Conteo físico"
    }, 3);

    expect(state.product.update).toHaveBeenCalledWith(
      { stock: 0 },
      { transaction: state.transaction }
    );
    expect(state.models.StockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: "ADJUSTMENT", quantity: 5, reason: "Conteo físico" }),
      { transaction: state.transaction }
    );
  });

  it("rejects an outgoing movement that would make stock negative", async () => {
    await expect(createMovement({
      productId: 4,
      type: "OUT",
      quantity: 6,
      reason: "Corrección"
    }, 3)).rejects.toMatchObject({ status: 409 });

    expect(state.product.update).not.toHaveBeenCalled();
    expect(state.models.StockMovement.create).not.toHaveBeenCalled();
  });
});
