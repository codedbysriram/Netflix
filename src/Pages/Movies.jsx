import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../Styles/Movies.css";
import "../Styles/MovieButtons.css"; // ✅ Netflix-style red buttons

const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY ||
  process.env.REACT_APP_TMDB_API_KEY ||
  "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";

const categories = [
  { title: "Trending Now", endpoint: "/trending/movie/week" },
  { title: "Top Rated", endpoint: "/movie/top_rated" },
  { title: "New & Popular", endpoint: "/movie/upcoming" },
  { title: "Action Movies", endpoint: "/discover/movie?with_genres=28" },
  { title: "Comedy Movies", endpoint: "/discover/movie?with_genres=35" },
  { title: "Horror Movies", endpoint: "/discover/movie?with_genres=27" },
  { title: "Romance Movies", endpoint: "/discover/movie?with_genres=10749" },
  { title: "Documentaries", endpoint: "/discover/movie?with_genres=99" },
];

export default function Movies() {
  const [movieData, setMovieData] = useState({});
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Load saved My List
  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(savedList);
  }, []);

  // ✅ Fetch movie data
  useEffect(() => {
    async function fetchAll() {
      if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
        setError("⚠ Missing TMDB API key. Add it to your .env file.");
        setLoading(false);
        return;
      }

      try {
        const allData = {};
        await Promise.all(
          categories.map(async (cat) => {
            const res = await axios.get(`${BASE_URL}${cat.endpoint}`, {
              params: { api_key: API_KEY, language: "en-US", page: 1 },
            });
            allData[cat.title] = res.data.results || [];
          })
        );
        setMovieData(allData);
      } catch (err) {
        console.error(err);
        setError("❌ Failed to fetch movies from TMDB.");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ✅ Add movie to list (instant update + save to localStorage)
  const addToMyList = (movie) => {
    if (!myList.some((m) => m.id === movie.id)) {
      const updated = [...myList, movie];
      setMyList(updated);
      localStorage.setItem("myList", JSON.stringify(updated));
    }
  };

  if (loading) return <div className="movies-loading">Loading movies…</div>;
  if (error) return <div className="movies-error">{error}</div>;

  return (
    <div className="movies-page">
      <div className="movies-content">
        {categories.map((cat) => (
          <MovieRow
            key={cat.title}
            title={cat.title}
            movies={movieData[cat.title] || []}
            onSelect={(m) => setSelectedMovie(m)}
            onAddToList={addToMyList}
            myList={myList}
          />
        ))}

        {/* ✅ Movie Info Popup */}
        {selectedMovie && (
          <div
            className="movie-info-popup"
            onClick={() => setSelectedMovie(null)}
          >
            <div className="info-card" onClick={(e) => e.stopPropagation()}>
              <button
                className="close-info"
                onClick={() => setSelectedMovie(null)}
              >
                ✖
              </button>

              <img
                src={
                  selectedMovie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${selectedMovie.backdrop_path}`
                    : `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
                }
                alt={selectedMovie.title}
              />

              <div className="info-details">
                <h2>{selectedMovie.title}</h2>
                <p className="info-meta">
                  {selectedMovie.release_date?.slice(0, 4) || "N/A"} • ⭐{" "}
                  {selectedMovie.vote_average?.toFixed(1) || "—"}
                </p>
                <p className="info-overview">{selectedMovie.overview}</p>

                <div className="movie-actions">
                  <button
                    className="trailer-btn"
                    onClick={() => {
                      window.open(
                        `https://www.youtube.com/results?search_query=${encodeURIComponent(
                          `${selectedMovie.title} trailer`
                        )}`,
                        "_blank"
                      );
                    }}
                  >
                    ▶ Play Trailer
                  </button>

                  {!myList.some((m) => m.id === selectedMovie.id) && (
                    <button
                      className="mylist-btn"
                      onClick={() => addToMyList(selectedMovie)}
                    >
                      + My List
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- 🎬 Movie Row Component --- */
function MovieRow({ title, movies, onSelect, onAddToList, myList }) {
  const rowRef = useRef(null);

  const scroll = (dir) => {
    const cur = rowRef.current;
    if (!cur) return;
    const amount = dir === "left" ? cur.clientWidth * -1 : cur.clientWidth;
    cur.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!movies.length) return null;

  return (
    <div className="movies-row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-scroll-container">
        <button
          className="scroll-btn left"
          onClick={(e) => {
            e.stopPropagation();
            scroll("left");
          }}
        >
          ❮
        </button>

        <div className="movies-row" ref={rowRef}>
          {movies.map((movie) => {
            const isAdded = myList.some((m) => m.id === movie.id);
            return (
              <div className="movie-card" key={movie.id}>
                <img
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "https://via.placeholder.com/500x750?text=No+Image"
                  }
                  alt={movie.title || movie.name}
                  onClick={() => onSelect(movie)}
                />

                <div className="movie-overlay">
                  <h3 className="movie-title">{movie.title || movie.name}</h3>
                  <div className="movie-actions">
                    <button
                      className="trailer-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(movie);
                      }}
                    >
                      ▶ Play
                    </button>

                    {/* ✅ Hide My List button after clicking */}
                    {!isAdded && (
                      <button
                        className="mylist-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToList(movie);
                        }}
                      >
                        + My List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          className="scroll-btn right"
          onClick={(e) => {
            e.stopPropagation();
            scroll("right");
          }}
        >
          ❯
        </button>
      </div>
    </div>
  );
}
