import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Row from "../Components/Row";
import requests from "../requests";
import "../Styles/Home.css";
import "../Styles/MovieModel.css";

export default function Home() {
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const [videoId, setVideoId] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const trailerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;
    if (!apiKey) {
      setError("⚠️ Missing TMDB API key! Please add it in your .env file.");
    } else {
      setIsReady(true);
    }

    const savedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(savedList);
  }, []);

  const toggleMyList = (movie) => {
    const isInList = myList.some((m) => m.id === movie.id);
    const updatedList = isInList
      ? myList.filter((m) => m.id !== movie.id)
      : [...myList, movie];
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  const fetchTrailer = async (movieTitle) => {
    try {
      const query = encodeURIComponent(`${movieTitle} trailer`);
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&key=${
          import.meta.env.VITE_YOUTUBE_API_KEY
        }`
      );
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        setVideoId(data.items[0].id.videoId);
        setShowTrailer(true);
      }
    } catch (error) {
      console.error("Failed to load trailer:", error);
    }
  };

  // 🔍 Handle search function
  const handleSearch = async (query) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const res = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`
      );
      console.log("Search Results:", res.data.results);
      setSearchResults(res.data.results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  // 🖱️ Drag functionality
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.clientX - offset.x;
    const y = e.clientY - offset.y;
    setPos({ x, y });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // 🧩 Error and loading states
  if (error) {
    return (
      <div className="error-container">
        <h2>{error}</h2>
        <p>
          Example in <strong>.env</strong>:{" "}
          <code>VITE_TMDB_API_KEY=your_api_key_here</code>
        </p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading movies...</p>
      </div>
    );
  }

  // 🏠 MAIN CONTENT
  return (
    <div className="home-container">
      <main className="rows-section">
        {isSearching ? (
          <div className="search-results">
            {searchResults.length > 0 ? (
              searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="search-card"
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : "/images/no-poster.png"
                    }
                    alt={movie.title}
                  />
                  <h3>{movie.title}</h3>
                </div>
              ))
            ) : (
              <p className="no-results">No results found.</p>
            )}
          </div>
        ) : (
          <>
            <Row title="Trending Now" fetchUrl={requests.fetchTrending} isLargeRow onSelect={setSelectedMovie} />
            <Row title="Top Rated" fetchUrl={requests.fetchTopRated} onSelect={setSelectedMovie} />
            <Row title="New & Popular" fetchUrl={requests.fetchUpcoming} onSelect={setSelectedMovie} />
            <Row title="Action Movies" fetchUrl={requests.fetchActionMovies} onSelect={setSelectedMovie} />
            <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies} onSelect={setSelectedMovie} />
            <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies} onSelect={setSelectedMovie} />
            <Row title="Romance Movies" fetchUrl={requests.fetchRomanceMovies} onSelect={setSelectedMovie} />
            <Row title="Documentaries" fetchUrl={requests.fetchDocumentaries} onSelect={setSelectedMovie} />
          </>
        )}
      </main>

      {/* 🎬 Popup Modal */}
      {selectedMovie && (
        <div className="movie-info-popup" onClick={() => setSelectedMovie(null)}>
          <div className="info-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-info" onClick={() => setSelectedMovie(null)}>
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

              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <button className="play-now" onClick={() => fetchTrailer(selectedMovie.title)}>
                  ▶ Play Trailer
                </button>
                <button
                  className="play-now"
                  style={{
                    background: myList.some((m) => m.id === selectedMovie.id)
                      ? "#2ecc71"
                      : "#555",
                  }}
                  onClick={() => toggleMyList(selectedMovie)}
                >
                  {myList.some((m) => m.id === selectedMovie.id)
                    ? "✓ Added to My List"
                    : "+ Add to My List"}
                </button>
              </div>
            </div>
          </div>

          {/* 🎥 Draggable Trailer */}
          {showTrailer && videoId && (
            <div
              ref={trailerRef}
              className="draggable-trailer"
              onMouseDown={handleMouseDown}
              style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
            >
              <iframe
                width="400"
                height="225"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Trailer"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
