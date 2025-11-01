import React from "react";
import "./PlayerOverlay.css";

export default function PlayerOverlay({ movie, onClose }) {
  return (
    <div className="player-overlay">
      <div className="overlay-bg" onClick={onClose}></div>
      <div className="player-content">
        <iframe
          src={`https://www.youtube.com/embed/${movie?.id}?autoplay=1&controls=1`}
          title="Trailer"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
    </div>
  );
}
