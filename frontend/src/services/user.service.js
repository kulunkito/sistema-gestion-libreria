import api from "./api";

export const userService = {
  async list(params = {}) {
    const response = await api.get("/users", { params });
    return response.data;
  },
  async roles() {
    const response = await api.get("/users/roles");
    return response.data.data;
  },
  async create(data) {
    const response = await api.post("/users", data);
    return response.data.data;
  },
  async update(id, data) {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },
  async setActive(id, isActive) {
    const response = await api.patch(`/users/${id}/status`, { isActive });
    return response.data.data;
  }
};
