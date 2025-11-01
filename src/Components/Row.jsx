import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import movieTrailer from "movie-trailer";
import useMyList from "../hooks/useMyList";
import "../Styles/Row.css";

const base_url = "https://image.tmdb.org/t/p/original/";

export default function Row({ title, fetchUrl, isLargeRow }) {
  const [movies, setMovies] = useState([]);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [trailerError, setTrailerError] = useState("");
  const rowRef = useRef(null);
  const { toggleMyList, isInMyList } = useMyList();

  useEffect(() => {
    async function fetchData() {
      try {
        const request = await axios.get(fetchUrl);
        setMovies(request.data.results || []);
      } catch (error) {
        console.error("❌ Error fetching movies:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  const handlePlayTrailer = (movie) => {
    const movieName = movie?.title || movie?.name || movie?.original_name;
    setTrailerError("");

    movieTrailer(movieName)
      .then((url) => {
        if (url) {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerUrl(urlParams.get("v"));
          setShowTrailer(true);
        } else {
          setTrailerError("Trailer not available");
          setShowTrailer(true);
        }
      })
      .catch(() => {
        setTrailerError("Trailer not available");
        setShowTrailer(true);
      });
  };

  const handleClose = () => {
    setShowTrailer(false);
    setTrailerUrl("");
    setTrailerError("");
  };

  const scroll = (direction) => {
    const scrollAmount = 500;
    if (direction === "left") {
      rowRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="row">
      {title && <h2 className="row-title">{title}</h2>}

      <div className="row-scroll-container">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          ❮
        </button>

        <div className="row-posters" ref={rowRef}>
          {movies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                className={`row-poster ${isLargeRow && "row-posterLarge"}`}
                src={`${base_url}${
                  isLargeRow ? movie.poster_path : movie.backdrop_path
                }`}
                alt={movie.name || movie.title}
              />

              {/* Overlay with Buttons */}
              <div className="movie-overlay">
                <h3 className="movie-name">{movie.title || movie.name}</h3>
                <div className="movie-actions">
                  <button
                    className="trailer-btn"
                    onClick={() => handlePlayTrailer(movie)}
                  >
                    ▶ Play Trailer
                  </button>
                  <button
                    className={`mylist-btn ${
                      isInMyList(movie) ? "added" : ""
                    }`}
                    onClick={() => toggleMyList(movie)}
                  >
                    {isInMyList(movie) ? "✓ My List" : "+ My List"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          ❯
        </button>
      </div>

      {showTrailer && (
        <div className="trailer-modal">
          <div className="trailer-content">
            <button className="close-btn" onClick={handleClose}>
              ✖
            </button>
            {trailerUrl ? (
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1`}
                title="YouTube trailer player"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            ) : (
              <p className="trailer-error">{trailerError}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
