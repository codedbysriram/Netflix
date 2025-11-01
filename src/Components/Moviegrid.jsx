import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/MoviesGrid.css";

export default function MoviesGrid() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
const [myList, setMyList] = useState(() => {
  const saved = localStorage.getItem("myList");
  return saved ? JSON.parse(saved) : [];
});
const handleAddToList = (movie) => {
  setMyList((prevList) => {
    const updatedList = [...prevList, movie];
    localStorage.setItem("myList", JSON.stringify(updatedList));
    return updatedList;
  });
  alert(`${movie?.title || movie?.name} added to My List!`);
};

const handleRemoveFromList = (movieId) => {
  const updated = myList.filter((m) => m.id !== movieId);
  setMyList(updated);
  localStorage.setItem("myList", JSON.stringify(updated));
};

  useEffect(() => {
    const fetchMovies = async () => {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY;
      const { data } = await axios.get(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`
      );
      setMovies(data.results);
    };
    fetchMovies();
  }, []);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="movies-grid-container">
      <h2 className="section-title">🎬 Trending Movies</h2>
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <div className="movie-info">
              <h3>{movie.title}</h3>
              <p>{movie.release_date?.slice(0, 4)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";

function Banner({ movie }) {
  const [myList, setMyList] = useState(() => {
    const savedList = localStorage.getItem("myList");
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

  const toggleMyList = (movie) => {
    const exists = myList.find((m) => m.id === movie.id);
    if (exists) {
      setMyList(myList.filter((m) => m.id !== movie.id));
    } else {
      setMyList([...myList, movie]);
    }
  };

  return (
    <div className="banner-content">
      <h1>{movie?.title}</h1>
      <div className="banner-buttons">
        <button className="play">▶ Play</button>
        <button onClick={() => toggleMyList(movie)}>
          {myList.find((m) => m.id === movie.id)
            ? "✔ In My List"
            : "+ My List"}
        </button>
      </div>
    </div>
  );
}
