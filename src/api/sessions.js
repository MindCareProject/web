// src/api/sessions.js
import api from './axios';

export const apiSessions = {
    fetchByPatient: async (patientId) => {
        const response = await api.get(`/sessions/?patient_id=${patientId}`);
        return response.data;
    },

    create: async (patientId, text) => {
        const response = await api.post(`/sessions/`, {
            patient: patientId,
            notes: text
        });
        return response.data;
    }
};