import React from "react";
import YouTube from "react-youtube";
import "../Styles/TrailerModel.css";

export default function TrailerModel({ movie, trailerUrl, onClose }) {
  if (!movie) return null;

  const opts = {
    height: "390",
    width: "100%",
    playerVars: { autoplay: 1 },
  };
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
    <div className="trailer-overlay" onClick={onClose}>
      <div className="trailer-model" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>
        <h2>{movie.title || movie.name}</h2>
        {trailerUrl ? (
          <YouTube videoId={"https://youtu.be/PssKpzB0Ah0?si=q4A8xP8jzFXNMcwk"} opts={opts} />
        ) : (
          <p>No trailer found 😢</p>
        )}
      </div>
    </div>
  );
}
