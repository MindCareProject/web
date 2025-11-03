// src/api/authApi.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/auth/"; // ⚠️ sans espace ni slash en trop

export const loginUser = async (username, password) => {
  try {
    const res = await axios.post(`${API_URL}login/`, {
      username: username.trim(), // on nettoie les espaces
      password: password.trim(),
    });
    return res.data;
  } catch (error) {
    console.error("Erreur de connexion :", error.response?.data || error.message);
    throw error;
  }
};
