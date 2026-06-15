import api from "./api";

export const apiAppointments = {
  getAll: async () => {
    const response = await api.get("/accounts/appointments/");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/accounts/appointments/", data);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/accounts/appointments/${id}/`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/accounts/appointments/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/accounts/appointments/${id}/`);
    return response.data;
  }
};
