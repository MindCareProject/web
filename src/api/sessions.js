// src/api/sessions.js
import api from './axios'; // 👈 On utilise notre instance configurée (qui connaît le bon Token)

export const apiSessions = {
    // Récupérer l'historique
    fetchByPatient: async (patientId) => {
        // Plus besoin de passer le token manuellement !
        const response = await api.get(`/sessions/?patient_id=${patientId}`);
        return response.data;
    },

    // Créer une note
    create: async (patientId, text) => {
        const response = await api.post(`/sessions/`, {
            patient: patientId,
            notes: text
        });
        return response.data;
    }
};