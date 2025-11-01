import React from "react";
import "./Modal.css";

export default function MovieModal({ movie, onClose }) {
  return (
    <div className="movie-modal">
      <div className="modal-bg" onClick={onClose}></div>
      <div className="modal-content">
        <img src={`https://image.tmdb.org/t/p/w300${movie?.poster_path}`} alt={movie?.title} />
        <div className="modal-info">
          <h2>{movie?.title || movie?.name}</h2>
          <p>{movie?.overview}</p>
          <div className="modal-actions">
            <button className="play">▶ Play</button>
            <button className="list">＋ Add to My List</button>
          </div>
        </div>
        <button className="close-modal" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
