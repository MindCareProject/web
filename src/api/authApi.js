// src/api/authApi.js
import api from './axios';

export const verifyGoogleToken = async (idToken) => {
  const response = await api.post('/auth/verify-token/', { id_token: idToken });
  return response.data;
};