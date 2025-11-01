import React, { useEffect, useState } from "react";
import axios from "axios";
import useMyList from "../hooks/useMyList";
import "../Styles/MovieModel.css"; // ✅ for modal styles
import "../Styles/MovieButtons.css"; 

export default function NewPopular() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { toggleMyList, isInMyList } = useMyList();

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;
        const { data } = await axios.get(
          `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`
        );
        setMovies(data.results);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };
    fetchPopular();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>🔥 New & Popular</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "15px",
        }}
      >
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            {/* Movie Poster */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              onClick={() => setSelectedMovie(movie)}
            />

            {/* Overlay (Buttons + Title) */}
            <div className="movie-overlay">
              <p className="movie-title">{movie.title}</p>
              <div className="movie-actions">
                <button
                  className="trailer-btn"
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/results?search_query=${movie.title}+trailer`,
                      "_blank"
                    )
                  }
                >
                  ▶ Play Trailer
                </button>

                <button
                  className={`mylist-btn ${isInMyList(movie) ? "added" : ""}`}
                  onClick={() => toggleMyList(movie)}
                >
                  {isInMyList(movie) ? "✓ My List" : "+ My List"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Movie Info Modal */}
      {selectedMovie && (
        <div className="movie-modal">
          <div className="movie-modal-content">
            <button className="close-btn" onClick={() => setSelectedMovie(null)}>
              ✕
            </button>
            <img
              src={`https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`}
              alt={selectedMovie.title}
              className="modal-image"
            />
            <div className="movie-details">
              <h2>{selectedMovie.title}</h2>
              <p>
                <strong>⭐ {selectedMovie.vote_average}</strong> •{" "}
                {selectedMovie.release_date?.split("-")[0]}
              </p>
              <p>{selectedMovie.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
