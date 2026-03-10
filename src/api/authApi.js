import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

// Inscription classique (avec toutes les infos du psy)
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register/`, userData);
  return response.data;
};

// Connexion classique
export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}/login/`, { username, password });
  return response.data;
};

// Vérification du jeton Google
export const verifyGoogleToken = async (idToken) => {
  const response = await axios.post(`${API_URL}/auth/verify-token/`, { id_token: idToken });
  return response.data;
};