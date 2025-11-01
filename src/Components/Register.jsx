// 📁 src/Components/Register.jsx
import React, { useState } from "react";
import { registerUser } from "../Services/api";
import { useNavigate } from "react-router-dom";
import "../App.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await registerUser(email, password);

      if (res.message.includes("success")) {
    
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setMessage("❌ " + (res.message || "Registration failed"));
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ Server error during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleRegister}>
        <h2>Sign Up</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </form>
    </div>
  );
}
