// src/hooks/useMyList.js
import { useState, useEffect } from "react";

export default function useMyList() {
  const [myList, setMyList] = useState(() => {
    try {
      const stored = localStorage.getItem("myList");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("myList", JSON.stringify(myList));
  }, [myList]);

  const toggleMyList = (item) => {
    const isInList = myList.some((m) => m.id === item.id);
    const updated = isInList
      ? myList.filter((m) => m.id !== item.id)
      : [...myList, item];
    setMyList(updated);
  };

  const isInMyList = (item) => myList.some((m) => m.id === item.id);

  return { myList, toggleMyList, isInMyList };
}
