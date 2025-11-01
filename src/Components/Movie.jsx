// src/components/Movies.jsx
import React, { useEffect, useState } from "react";
import "./Movie.css";

const Movies = ({ title, fetchUrl }) => {
  const [movies, setMovies] = useState([]);
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
    const fetchData = async () => {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      setMovies(data.results);
    };
    fetchData();
  }, [fetchUrl]);

  return (
    <div className="movies">
      <h2>{title}</h2>
      <div className="movie-grid">
        {movies.map((movie) => (
          <img
            key={movie.id}
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ))}
      </div>
    </div>
    
  );
};

export default Movies;
