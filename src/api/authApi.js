// src/api/authApi.js
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export const registerUser = async (username, email, password) => {
  // AVANT : return axios.post(`${API_URL}/auth/register/`, ...);
  // MAINTENANT :
  const response = await axios.post(`${API_URL}/register/`, { username, email, password });
  return response.data;
};

export const loginUser = async (username, password) => {
  // AVANT : return axios.post(`${API_URL}/auth/login/`, ...);
  // MAINTENANT :
  const response = await axios.post(`${API_URL}/login/`, { username, password });
  return response.data;
};