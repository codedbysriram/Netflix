import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/NetflixSection.css";

export default function NetflixSection({ title, fetchUrl }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(fetchUrl);
      setMovies(request.data.results || []);
    }
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="netflix-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-row">
        {movies.map((movie, i) => (
          <div key={i} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="movie-poster"
            />
            <div className="movie-overlay">
              <p className="movie-name">{movie.title || movie.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
