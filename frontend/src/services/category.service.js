
import api from "./api";

export const categoryService = {
  async list(params = {}) {
    const response = await api.get("/categories", { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  },

  async setActive(id, isActive) {
    const response = await api.patch(`/categories/${id}/status`, { isActive });
    return response.data.data;
  }
};
