import api from "./api";

export function createContactService(resource) {
  return {
    async list(params = {}) {
      const response = await api.get(`/${resource}`, { params });
      return response.data;
    },
    async create(data) {
      const response = await api.post(`/${resource}`, data);
      return response.data.data;
    },
    async update(id, data) {
      const response = await api.put(`/${resource}/${id}`, data);
      return response.data.data;
    },
    async setActive(id, isActive) {
      const response = await api.patch(`/${resource}/${id}/status`, { isActive });
      return response.data.data;
    }
  };
}

export const customerService = createContactService("customers");
export const supplierService = createContactService("suppliers");
