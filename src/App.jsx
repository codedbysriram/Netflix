import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// 🔹 Components
import Banner from "./Components/Banner/Banner";
import Register from "./Components/Register";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import Movies from "./Pages/Movies";
import ProtectedRoute from "./Components/ProtectedRoute";
import MyList from "./Pages/MyList/";
import TvShows from "./Pages/TvShows";
import Home from "./Pages/Home";
import NewPopular from "./Pages/NewPopular";
import Loader from "./Components/Loader/";
import NoInternet from "./Components/NoInternet";

import "./App.css";

function AppContent() {
  const location = useLocation();
  const hideNavbarFooter = ["/", "/login"];
  const showBannerRoutes = ["/home", "/movies"]; // Banner only on these pages

  const [movies, setMovies] = useState([]);
  const [apiError, setApiError] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [loading, setLoading] = useState(true);

  // 🌐 Check internet status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Simulate app loading
    const timer = setTimeout(() => setLoading(false), 1000);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(timer);
    };
  }, []);

  // 🎬 Fetch Movies (only when online)
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        if (!apiKey) {
          setApiError("Missing TMDB API key");
          return;
        }

        const { data } = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/week",
          { params: { api_key: apiKey } }
        );
        setMovies(data.results || []);
      } catch (err) {
        setApiError("Failed to load movies from TMDB");
      }
    };

    if (isOnline) fetchMovies();
  }, [isOnline]);

  const handleRetry = () => {
    if (navigator.onLine) {
      setIsOnline(true);
    } else {
      alert("Still offline! Check your Wi-Fi 😅");
    }
  };

  // ⏳ Show Loader while loading
  if (loading) return <Loader />;

  // ❌ Show No Internet Screen when offline
  if (!isOnline) return <NoInternet onRetry={handleRetry} />;

  return (
    <div className="netflix-app">
      {/* Navbar */}
      {!hideNavbarFooter.includes(location.pathname) && <Navbar />}

      <div style={{ backgroundColor: "black", minHeight: "100vh" }}>
        {/* ✅ Banner only on specific routes */}
        {showBannerRoutes.includes(location.pathname) && <Banner />}

        <Routes>
          {/* Public */}
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home movies={movies} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies"
            element={
              <ProtectedRoute>
                <Movies />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tvshows"
            element={
              <ProtectedRoute>
                <TvShows />
              </ProtectedRoute>
            }
          />
          <Route
            path="/newpopular"
            element={
              <ProtectedRoute>
                <NewPopular />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mylist"
            element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>

      {/* Footer */}
      {!hideNavbarFooter.includes(location.pathname) && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
