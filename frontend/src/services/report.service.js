import api from "./api";

export const reportService = {
  async salesSummary(params) {
    const response = await api.get("/reports/sales-summary", { params });
    return response.data.data;
  },
  async topProducts(params) {
    const response = await api.get("/reports/top-products", { params });
    return response.data.data;
  }
};
