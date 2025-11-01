import React, { useEffect, useState } from "react";
import Row from "../Components/Row";
import "../Styles/Pages.css";
import "../Styles/MovieModel.css";
import "../Styles/MovieButtons.css"; // ✅ Using red Netflix-style buttons

const TvShows = () => {
  const [tvRows, setTvRows] = useState([]);
  const [error, setError] = useState(null);
  const [selectedShow, setSelectedShow] = useState(null);
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const apiKey =
      import.meta.env.VITE_TMDB_API_KEY ||
      process.env.REACT_APP_TMDB_API_KEY;

    if (!apiKey) {
      setError("❌ Missing TMDB API key in your .env file.");
      return;
    }

    const baseUrl = "https://api.themoviedb.org/3";
    const requests = [
      {
        title: "📺 Popular TV Shows",
        url: `${baseUrl}/tv/popular?api_key=${apiKey}&language=en-US`,
      },
      {
        title: "⭐ Top Rated TV Shows",
        url: `${baseUrl}/tv/top_rated?api_key=${apiKey}&language=en-US`,
      },
      {
        title: "🎭 Drama",
        url: `${baseUrl}/discover/tv?with_genres=18&api_key=${apiKey}&language=en-US`,
      },
      {
        title: "😂 Comedy Series",
        url: `${baseUrl}/discover/tv?with_genres=35&api_key=${apiKey}&language=en-US`,
      },
    ];

    setTvRows(requests);

    const savedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(savedList);
  }, []);

  const toggleMyList = (show) => {
    const isInList = myList.some((m) => m.id === show.id);
    const updatedList = isInList
      ? myList.filter((m) => m.id !== show.id)
      : [...myList, show];
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  if (error) {
    return (
      <div style={{ color: "white", textAlign: "center", padding: "50px" }}>
        {error}
      </div>
    );
  }

  return (
    <div className="page-container">
      {tvRows.map((row, index) => (
        <Row
          key={index}
          title={row.title}
          fetchUrl={row.url}
          onSelect={setSelectedShow}
        />
      ))}

      {/* === Popup Modal === */}
      {selectedShow && (
        <div className="movie-info-popup" onClick={() => setSelectedShow(null)}>
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-info"
              onClick={() => setSelectedShow(null)}
            >
              ✖
            </button>

            <img
              src={
                selectedShow.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${selectedShow.backdrop_path}`
                  : `https://image.tmdb.org/t/p/w500${selectedShow.poster_path}`
              }
              alt={selectedShow.name}
            />
            <div className="info-details">
              <h2>{selectedShow.name}</h2>
              <p className="info-meta">
                {selectedShow.first_air_date?.slice(0, 4) || "N/A"} • ⭐{" "}
                {selectedShow.vote_average?.toFixed(1) || "—"}
              </p>
              <p className="info-overview">{selectedShow.overview}</p>

              {/* ✅ Netflix-style buttons */}
              <div className="movie-actions" style={{ marginTop: "1rem" }}>
                <button
                  className="trailer-btn"
                  onClick={() => {
                    window.open(
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(
                        `${selectedShow.name} trailer`
                      )}`,
                      "_blank"
                    );
                  }}
                >
                  ▶ Play Trailer
                </button>

                <button
                  className={`mylist-btn ${
                    myList.some((m) => m.id === selectedShow.id) ? "added" : ""
                  }`}
                  onClick={() => toggleMyList(selectedShow)}
                >
                  {myList.some((m) => m.id === selectedShow.id)
                    ? "✓ Added to My List"
                    : "+ Add to My List"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TvShows;
