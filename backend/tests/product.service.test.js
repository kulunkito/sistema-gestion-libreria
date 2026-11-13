import { beforeEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  transaction: {},
  transactionRunner: vi.fn(),
  models: {
    Category: { findByPk: vi.fn() },
    Product: { create: vi.fn() },
    StockMovement: { create: vi.fn() }
  },
  product: null
}));

vi.mock("../src/config/database.js", () => ({
  default: { transaction: state.transactionRunner }
}));
vi.mock("../src/models/index.js", () => state.models);

import { createProduct } from "../src/services/product.service.js";

describe("product service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.product = {
      id: 12,
      update: vi.fn().mockResolvedValue(undefined)
    };
    state.transactionRunner.mockImplementation(callback => callback(state.transaction));
    state.models.Category.findByPk.mockResolvedValue({ id: 2, isActive: true });
    state.models.Product.create.mockResolvedValue(state.product);
    state.models.StockMovement.create.mockResolvedValue({ id: 8 });
  });

  it("creates an initial stock movement when a product starts with stock", async () => {
    await createProduct({
      sku: "LIB-12",
      name: "Libro",
      categoryId: 2,
      purchasePrice: 3,
      salePrice: 5,
      stock: 7
    }, 4);

    expect(state.models.Product.create).toHaveBeenCalledWith(
      expect.objectContaining({ stock: 0 }),
      { transaction: state.transaction }
    );
    expect(state.product.update).toHaveBeenCalledWith(
      { stock: 7 },
      { transaction: state.transaction }
    );
    expect(state.models.StockMovement.create).toHaveBeenCalledWith(
      expect.objectContaining({
        productId: 12,
        userId: 4,
        type: "IN",
        quantity: 7
      }),
      { transaction: state.transaction }
    );
  });

  it("preserves duplicate-SKU database errors for the API conflict handler", async () => {
    const duplicateError = Object.assign(new Error("duplicate sku"), {
      name: "SequelizeUniqueConstraintError"
    });
    state.models.Product.create.mockRejectedValue(duplicateError);

    await expect(createProduct({
      sku: "LIB-12",
      name: "Libro",
      categoryId: 2,
      purchasePrice: 3,
      salePrice: 5,
      stock: 0
    }, 4)).rejects.toBe(duplicateError);

    expect(state.models.StockMovement.create).not.toHaveBeenCalled();
  });
});
