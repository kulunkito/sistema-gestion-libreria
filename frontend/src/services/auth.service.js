
import api from "./api";

export const authService = {
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);

    const { token, user } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
  },

  async me() {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
