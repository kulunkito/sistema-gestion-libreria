
import api from "./api";

export const categoryService = {
  async list() {
    const response = await api.get("/categories");
    return response.data.data;
  },

  async create(data) {
    const response = await api.post("/categories", data);
    return response.data.data;
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data);
    return response.data.data;
  }
};
