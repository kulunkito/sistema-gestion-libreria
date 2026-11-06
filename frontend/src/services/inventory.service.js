
import api from "./api";

export const inventoryService = {
  async list() {
    const response = await api.get("/inventory");
    return response.data.data;
  },

  async lowStock() {
    const response = await api.get("/inventory/low-stock");
    return response.data.data;
  },

  async movements() {
    const response = await api.get("/inventory/movements");
    return response.data.data;
  }
};
