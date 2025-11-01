import React, { createContext, useState, useEffect } from "react";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [myList, setMyList] = useState(() => JSON.parse(localStorage.getItem("myList")) || []);
  const [continueWatching, setContinueWatching] = useState(() => JSON.parse(localStorage.getItem("continueWatching")) || []);

  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
    localStorage.setItem("continueWatching", JSON.stringify(continueWatching));
  }, [myList, continueWatching]);

  const addToMyList = (movie) => {
    setMyList((prev) => [...prev.filter((m) => m.id !== movie.id), movie]);
  };

  const addToContinueWatching = (movie) => {
    setContinueWatching((prev) => [movie, ...prev.filter((m) => m.id !== movie.id)]);
  };

  return (
    <MovieContext.Provider value={{ myList, addToMyList, continueWatching, addToContinueWatching }}>
      {children}
    </MovieContext.Provider>
  );
};
