import React, { useState } from "react";
import { loginUser } from "../Services/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import IntroVideo from "../assets/NETFLIX_intro.mp4";
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
      // ✅ Fixed: send email + password as an object
      const res = await loginUser({ email, password });

      if (res.token) {
        localStorage.setItem("token", res.token);

        // Show loader briefly before showing intro video
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

  // ✅ Show intro video before redirecting to home
  if (showIntro) {
    return (
      <video
        src={IntroVideo}
        autoPlay
        muted
        onEnded={() => navigate("/home")}
        className="intro-video"
      />
    );
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
