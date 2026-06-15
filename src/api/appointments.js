import api from "./axios";

export const apiAppointments = {
  getAll: async () => {
    const response = await api.get("/appointments/");
    return response.data;
  },
  create: async (data) => {
    const response = await api.post("/appointments/", data);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/appointments/${id}/`);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.patch(`/appointments/${id}/`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/appointments/${id}/`);
    return response.data;
  }
};
