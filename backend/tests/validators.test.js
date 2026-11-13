import { describe, expect, it } from "vitest";
import { createMovementSchema } from "../src/validators/inventory.validator.js";
import {
  createProductSchema,
  safeUpdateProductSchema
} from "../src/validators/product.validator.js";
import { createSaleSchema } from "../src/validators/sale.validator.js";

const validProduct = {
  sku: "LIB-1",
  name: "Libro",
  categoryId: 1,
  purchasePrice: 1.25,
  salePrice: 2.5
};

describe("input schemas", () => {
  it("requires a positive sale price with no more than two decimal places", () => {
    expect(createProductSchema.safeParse({ ...validProduct, salePrice: 0 }).success).toBe(false);
    expect(createProductSchema.safeParse({ ...validProduct, salePrice: 2.501 }).success).toBe(false);
  });

  it("does not allow stock changes through product updates", () => {
    expect(safeUpdateProductSchema.safeParse({ stock: 4 }).success).toBe(false);
  });

  it("requires sales to contain items and payments", () => {
    expect(createSaleSchema.safeParse({ items: [], payments: [] }).success).toBe(false);
  });

  it("allows adjusting inventory to zero but not a zero-unit inbound movement", () => {
    const base = { productId: 1, quantity: 0, reason: "Conteo" };
    expect(createMovementSchema.safeParse({ ...base, type: "ADJUSTMENT" }).success).toBe(true);
    expect(createMovementSchema.safeParse({ ...base, type: "IN" }).success).toBe(false);
  });
});
