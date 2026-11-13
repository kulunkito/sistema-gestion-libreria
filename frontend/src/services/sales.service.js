import api from "./api";

export const salesService = {
  async list(params = {}) {
    const response = await api.get("/sales", { params });
    return response.data;
  },

  async create(data) {
    const response = await api.post("/sales", data);
    return response.data.data;
  },

  async cancel(id, reason) {
    const response = await api.post(`/sales/${id}/cancel`, { reason });
    return response.data.data;
  }
};
