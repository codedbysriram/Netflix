import React, { useState, useEffect } from "react";
import "../Styles/Pages.css";

const MyList = () => {
  const [myList, setMyList] = useState([]);

  useEffect(() => {
    const storedList = JSON.parse(localStorage.getItem("myList")) || [];
    setMyList(storedList);
  }, []);

  // 🗑️ Remove a movie from the list
  const handleRemove = (movieId) => {
    const updatedList = myList.filter((movie) => movie.id !== movieId);
    setMyList(updatedList);
    localStorage.setItem("myList", JSON.stringify(updatedList));
  };

  return (
    <div className="page-container">
      <h2>My List</h2>
      <div className="mylist-container">
        {myList.length === 0 ? (
          <p className="empty-list">No movies or shows added yet.</p>
        ) : (
          myList.map((movie) => (
            <div key={movie.id} className="mylist-item">
              <div className="mylist-img-container">
                <img
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                  alt={movie.title}
                />
                {/* ❌ Remove Button */}
                <button
                  className="remove-btn"
                  onClick={() => handleRemove(movie.id)}
                >
                  ✕
                </button>
              </div>
              <h4>{movie.title}</h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyList;
