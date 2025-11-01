import React from "react";
import "../Styles/MovieModal.css";

export default function MovieModal({ movie, onClose }) {
  if (!movie) return null;
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button className="close-btn" onClick={onClose}>✕</button>
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          className="modal-banner"
        />
        <div className="modal-details">
          <h2>{movie.title || movie.name}</h2>
          <p className="rating">⭐ {movie.vote_average?.toFixed(1)}</p>
          <p className="overview">{movie.overview}</p>
          <div className="modal-actions">
            <button className="play-btn">▶ Play</button>
            <button className="add-btn">+ My List</button>
          </div>
        </div>
      </div>
    </div>
  );
}
