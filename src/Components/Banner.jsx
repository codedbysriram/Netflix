import axios from "axios";
import "../Styles/Banner.css";
import Loader from "../Components/Loader/Loader"; // 👈 import loader
import React, { useState, useEffect, useRef } from "react";

export default function Banner() {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(true); // 👈 loading state
  const [loadingTrailer, setLoadingTrailer] = useState(false);
  const playButtonRef = useRef(null);
  const [videoPosition, setVideoPosition] = useState({ top: 0, left: 0 });

  // 🎬 Fetch Trending Movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const { data } = await axios.get(
          "https://api.themoviedb.org/3/trending/movie/week",
          { params: { api_key: apiKey } }
        );
        setMovies(data.results || []);
      } catch (error) {
        console.error("Error fetching banner movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  // 🔁 Auto-change banner every 6s
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const movie = movies[currentIndex];
  if (loading || !movie) return <Loader />; // 👈 Show loader until data loads

  const handleAddToList = (movie) => {
    const saved = JSON.parse(localStorage.getItem("myList")) || [];
    const alreadyAdded = saved.some((m) => m.id === movie.id);
    if (!alreadyAdded) {
      const updated = [...saved, movie];
      localStorage.setItem("myList", JSON.stringify(updated));
    }
  };

  // ▶ Tiny floating trailer near Play button
  const handlePlay = async () => {
    try {
      setLoadingTrailer(true); // 👈 Show loader for trailer too
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos`,
        { params: { api_key: apiKey } }
      );
      const trailer = data.results.find(
        (vid) => vid.type === "Trailer" && vid.site === "YouTube"
      );
      if (trailer) {
        setVideoUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&controls=1`);

        // 📍 Position tiny video near Play button
        const rect = playButtonRef.current.getBoundingClientRect();
        setVideoPosition({
          top: rect.top + window.scrollY - 80,
          left: rect.left + window.scrollX + 140,
        });
      } else {
        alert("Trailer not available");
      }
    } catch (error) {
      console.error("Error fetching trailer:", error);
    } finally {
      setLoadingTrailer(false); // 👈 Hide loader
    }
  };

  return (
    <header
      className="banner"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      {(loadingTrailer || loading) && <Loader />} {/* 👈 Loader overlay during fetch */}

      <div className="banner-overlay"></div>

      <div className="banner-content">
        <h1 className="banner-title">{movie.title || movie.name}</h1>
        <p className="banner-description">{movie.overview}</p>

        <div className="banner-buttons">
          <button ref={playButtonRef} className="banner-button play" onClick={handlePlay}>
            ▶ Play
          </button>
          <button className="banner-button info" onClick={() => setShowInfo(true)}>
            ℹ More Info
          </button>
        </div>
      </div>

      {/* 🎬 Tiny Video Box near Play Button */}
      {videoUrl && (
        <div
          className="tiny-video-box"
          style={{
            top: `${videoPosition.top}px`,
            left: `${videoPosition.left}px`,
          }}
        >
          <iframe
            src={videoUrl}
            title="Tiny Trailer"
            allow="autoplay; fullscreen"
            allowFullScreen
          ></iframe>
          <button className="close-tiny-video" onClick={() => setVideoUrl(null)}>
            ✕
          </button>
        </div>
      )}

      {/* 🧾 Movie Info Modal */}
      {showInfo && (
        <div className="info-modal" onClick={() => setShowInfo(false)}>
          <div className="info-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="info-details">
              <h2>{movie.title || movie.name}</h2>
              <p>{movie.overview}</p>
              <p>
                <strong>Release:</strong> {movie.release_date}
              </p>
              <p>
                <strong>Rating:</strong> ⭐ {movie.vote_average}
              </p>
              <div className="info-actions">
                <button onClick={handlePlay}>▶ Play</button>
                <button onClick={() => handleAddToList(movie)}>＋ My List</button>
              </div>
            </div>
            <button className="close-info" onClick={() => setShowInfo(false)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
