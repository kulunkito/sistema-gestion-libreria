import { createRequire } from "node:module";
import { describe, expect, it, vi } from "vitest";
import { Sequelize } from "sequelize";

const require = createRequire(import.meta.url);
const migration = require("../src/migrations/20261113000000-create-mvp-schema.cjs");

describe("initial database migration", () => {
  it("creates all domain tables and the required reporting indexes", async () => {
    const queryInterface = {
      createTable: vi.fn().mockResolvedValue(undefined),
      addIndex: vi.fn().mockResolvedValue(undefined)
    };

    await migration.up(queryInterface, Sequelize);

    expect(queryInterface.createTable.mock.calls.map(([table]) => table)).toEqual([
      "roles",
      "users",
      "categories",
      "customers",
      "suppliers",
      "products",
      "sales",
      "sale_details",
      "payments",
      "stock_movements"
    ]);
    expect(queryInterface.addIndex).toHaveBeenCalledTimes(4);
    const products = queryInterface.createTable.mock.calls.find(([table]) => table === "products")[1];
    expect(products.sku.unique).toBe(true);
    expect(products.sale_price.type.toString()).toContain("DECIMAL");
  });
});
