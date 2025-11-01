import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../Styles/Movies.css"; // reuse same styles

const API_KEY =
  import.meta.env.VITE_TMDB_API_KEY ||
  process.env.REACT_APP_TMDB_API_KEY ||
  "YOUR_API_KEY_HERE";
const BASE_URL = "https://api.themoviedb.org/3";

export default function CategorySection({ title, endpoint, isTV = false }) {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const [videoKey, setVideoKey] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        const res = await axios.get(`${BASE_URL}${endpoint}`, {
          params: { api_key: API_KEY, language: "en-US", page: 1 },
        });
        setItems(res.data.results || []);
      } catch (err) {
        console.error("Error fetching", title, err);
      }
    }
    fetchItems();
  }, [endpoint, title]);

  async function fetchTrailer(item) {
    const type = isTV ? "tv" : "movie";
    try {
      const res = await axios.get(`${BASE_URL}/${type}/${item.id}/videos`, {
        params: { api_key: API_KEY, language: "en-US" },
      });
      const trailer =
        res.data.results.find((v) => v.type === "Trailer" && v.site === "YouTube") ||
        res.data.results[0];
      setVideoKey(trailer ? trailer.key : null);
      setSelected(item);
    } catch (err) {
      console.error("Failed to fetch trailer:", err);
      setSelected(item);
      setVideoKey(null);
    }
  }

  const scroll = (dir) => {
    const cur = rowRef.current;
    if (!cur) return;
    const amount = dir === "left" ? cur.clientWidth * -1 : cur.clientWidth;
    cur.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <div className="movies-row-container">
      <h2 className="row-title">{title}</h2>

      <div className="row-scroll-container">
        <button className="scroll-btn left" onClick={() => scroll("left")}>
          ❮
        </button>

        <div className="movies-row" ref={rowRef}>
          {items.map((item) => (
            <div
              className="movie-card"
              key={item.id}
              onClick={() => fetchTrailer(item)}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placeholder.com/500x750?text=No+Image"
                }
                alt={item.title || item.name}
              />
              <div className="movie-overlay">
                <h3 className="movie-name">{item.title || item.name}</h3>
                <button
                  className="play-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchTrailer(item);
                  }}
                >
                  ▶ Play
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="scroll-btn right" onClick={() => scroll("right")}>
          ❯
        </button>
      </div>

      {/* Trailer Popup */}
      {selected && (
        <div className="movie-info-popup" onClick={() => setSelected(null)}>
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-info" onClick={() => setSelected(null)}>
              ✖
            </button>

            {videoKey ? (
              <iframe
                width="100%"
                height="400"
                src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
                title="Trailer"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            ) : (
              <img
                src={
                  selected.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${selected.backdrop_path}`
                    : `https://image.tmdb.org/t/p/w500${selected.poster_path}`
                }
                alt={selected.title || selected.name}
              />
            )}

            <div className="info-details">
              <h2>{selected.title || selected.name}</h2>
              <p className="info-meta">
                {selected.release_date?.slice(0, 4) ||
                  selected.first_air_date?.slice(0, 4)}{" "}
                • ⭐ {selected.vote_average?.toFixed(1) || "—"}
              </p>
              <p className="info-overview">{selected.overview}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
