// src/Services/api.js

// ✅ Your deployed backend base URL
const API_URL = "https://backend-0a29.onrender.com";

// 🔐 Register user
export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Register error:", err);
    return { message: "Server error. Please try again later." };
  }
};

// 🔓 Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error("❌ Login error:", err);
    return { message: "Server error. Please try again later." };
  }
};
