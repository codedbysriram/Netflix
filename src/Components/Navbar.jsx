import React, { useEffect, useState, useRef } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import "../Styles/Navbar.css";
import logoImg from "../assets/netflix_logo.png";
import profileImg from "../assets/profile.png";

const TMDB_API_KEY = "f1a8e1514a47a9c2350a980047c30f85";

export default function Navbar({ onSearch }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [myList, setMyList] = useState([]);

  const menuRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setShowProfileMenu(false);
        setSearchResults([]);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${value}`
      );
      const data = await res.json();
      setSearchResults(data.results.slice(0, 6));
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = async (movieId, mediaType) => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${mediaType}/${movieId}?api_key=${TMDB_API_KEY}&append_to_response=videos`
      );
      const data = await res.json();
      setSelectedMovie(data);
    } catch (err) {
      console.error("Movie fetch failed:", err);
    }
  };

  const toggleMyList = (movie) => {
    const isInList = myList.some((m) => m.id === movie.id);
    const updatedList = isInList
      ? myList.filter((m) => m.id !== movie.id)
      : [...myList, movie];
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="navbar-left">
          <img src={logoImg} alt="Netflix Logo" className="logo-img" />
          <div className="nav-links">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/tvshows">TV Shows</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            <NavLink to="/newpopular">New & Popular</NavLink>
            <NavLink to="/mylist">My List</NavLink>
          </div>
        </div>

        <div className="navbar-right">
          {/* 🔍 Search Box */}
          <div
            className={`search-box ${isSearchActive ? "active" : ""}`}
            ref={searchRef}
          >
            <Search
              size={18}
              color="white"
              className={`search-icon ${isSearchActive ? "glow" : ""}`}
              onClick={() => setIsSearchActive(true)}
            />
            <input
              type="text"
              placeholder="Titles, people, genres"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchActive(true)}
              onBlur={() => {
                if (!searchQuery) setIsSearchActive(false);
              }}
            />

            {/* 🔽 Live Search Results */}
            {isSearchActive && searchResults.length > 0 && (
              <div className="search-results">
                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  searchResults.map((item, index) => (
                    <div
                      key={index}
                      className="search-item"
                      onClick={() => handleSelectMovie(item.id, item.media_type)}
                    >
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w92${item.poster_path}`
                            : "/images/placeholder.png"
                        }
                        alt={item.title || item.name}
                      />
                      <p>{item.title || item.name}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="profile-menu" ref={menuRef}>
            <div
              className="profile-btn"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <img src={profileImg} alt="Profile" className="profile-img" />
              <ChevronDown
                size={16}
                color="white"
                className={`arrow ${showProfileMenu ? "rotate" : ""}`}
              />
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <div className="profiles">
                  <div className="profile">
                    <img src="/images/profile1.jpg" alt="Profile" />
                    <p>Sriram</p>
                  </div>
                  <div className="profile">
                    <img src="../images/profile2.jpg" alt="Profile" />
                    <p>Guest</p>
                  </div>
                </div>
                <hr />
                <button onClick={() => alert("Manage Profiles Coming Soon!")}>
                  Manage Profiles
                </button>
                <button onClick={() => alert("Account Page Coming Soon!")}>
                  Account
                </button>
                <button className="logout" onClick={handleLogout}>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🎬 Movie Info Popup */}
      {selectedMovie && (
        <div
          className="movie-popup-overlay"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="movie-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={() => setSelectedMovie(null)}>
              <X size={22} />
            </button>
            <img
              src={
                selectedMovie.backdrop_path
                  ? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
                  : "/images/placeholder.png"
              }
              alt={selectedMovie.title || selectedMovie.name}
              className="movie-backdrop"
            />
            <div className="movie-info">
              <h2>{selectedMovie.title || selectedMovie.name}</h2>
              <p className="movie-overview">{selectedMovie.overview}</p>

              {/* 🔘 Buttons */}
              <div className="movie-buttons">
                <button className="play-btn">▶ Play</button>
                <button
                  className="mylist-btn"
                  onClick={() => toggleMyList(selectedMovie)}
                >
                  {myList.some((m) => m.id === selectedMovie.id)
                    ? "✓ Added to My List"
                    : "+ My List"}
                </button>
              </div>

              <p>
                ⭐ Rating:{" "}
                <strong>{selectedMovie.vote_average?.toFixed(1) || "N/A"}</strong>
              </p>
              <p>
                📅 Release Date:{" "}
                <strong>
                  {selectedMovie.release_date || selectedMovie.first_air_date}
                </strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
