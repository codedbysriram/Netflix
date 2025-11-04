// 📁 src/Services/api.js
import axios from "axios";

// 🟢 Use your Render backend URL here:
const API = "https://backend-v1pu.vercel.app/"; // example: https://netflix-backend-xyz.onrender.com

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Register error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API}/login`, userData);
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};
