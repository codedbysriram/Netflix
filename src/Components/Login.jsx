import React, { useState } from "react";
import { loginUser } from "../Services/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import IntroVideo from "../assets/NETFLIX_intro.mp4";
 // ✅ now imports component, not .mp4
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await loginUser(email, password);

      if (res.token) {
        localStorage.setItem("token", res.token);

        // Show loader briefly before intro
        setTimeout(() => {
          setLoading(false);
          setShowIntro(true);
        }, 1000);
      } else {
        setMessage("❌ " + (res.message || "Invalid credentials"));
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ Server error. Try again later.");
      setLoading(false);
    }
  };

  // Show intro video and redirect after it ends
  if (showIntro) {
    return <IntroVideo onFinish={() => navigate("/home")} />;
  }

  return (
    <div className="auth-container">
      {loading && <Loader />}

      <form className="auth-form" onSubmit={handleLogin}>
        <h2>Sign In</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-switch">
          New to Netflix? <a href="/register">Sign up now</a>
        </p>
      </form>
    </div>
  );
}
