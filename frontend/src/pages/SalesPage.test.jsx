import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SalesPage from "./SalesPage";

const mocks = vi.hoisted(() => ({
  products: {
    list: vi.fn()
  },
  customers: {
    list: vi.fn()
  },
  sales: {
    list: vi.fn(),
    create: vi.fn()
  }
}));

vi.mock("../services/product.service", () => ({ productService: mocks.products }));
vi.mock("../services/contact.service", () => ({ customerService: mocks.customers }));
vi.mock("../services/sales.service", () => ({ salesService: mocks.sales }));
vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { id: 3, role: "SELLER" } })
}));

describe("SalesPage", () => {
  beforeEach(() => {
    mocks.products.list.mockResolvedValue({
      data: [{
        id: 7,
        sku: "LIB-7",
        name: "Libro",
        salePrice: "12.50",
        stock: 5,
        isActive: true
      }]
    });
    mocks.customers.list.mockResolvedValue({ data: [] });
    mocks.sales.list.mockResolvedValue({
      data: [],
      pagination: { page: 1, totalPages: 1 }
    });
    mocks.sales.create.mockResolvedValue({ id: 41 });
  });

  it("sends product quantities and the estimated payment without trusting a client price", async () => {
    render(<SalesPage />);

    await screen.findByText(/LIB-7 - Libro/);
    fireEvent.change(screen.getAllByRole("combobox")[1], { target: { value: "7" } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar venta" }));

    await waitFor(() => {
      expect(mocks.sales.create).toHaveBeenCalledWith({
        customerId: null,
        items: [{ productId: 7, quantity: 1 }],
        payments: [{ method: "CASH", amount: 12.5 }]
      });
    });
  });
});
