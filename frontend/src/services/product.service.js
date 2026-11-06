
import api from "./api";

export const productService = {
  async list(params = {}) {
    const response = await api.get("/products", { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
  },

  async create(data) {
    const response = await api.post("/products", data);
    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/products/${id}`, data);
    return response.data.data;
  },

  async deactivate(id) {
    const response = await api.patch(`/products/${id}/status`);
    return response.data.data;
  }
};
