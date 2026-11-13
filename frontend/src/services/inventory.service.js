
import api from "./api";

export const inventoryService = {
  async list(params = {}) {
    const response = await api.get("/inventory", { params });
    return response.data;
  },

  async lowStock(params = {}) {
    const response = await api.get("/inventory/low-stock", { params });
    return response.data;
  },

  async movements() {
    const response = await api.get("/inventory/movements");
    return response.data.data;
  },

  async createMovement(data) {
    const response = await api.post("/inventory/movements", data);
    return response.data.data;
  }
};
