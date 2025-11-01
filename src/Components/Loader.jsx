import React, { useEffect } from "react";
import "../Styles/Loader.css";

export default function Loader({ onFinish }) {
  useEffect(() => {
    if (onFinish) {
      const timer = setTimeout(onFinish, 3000); // 3s animation
      return () => clearTimeout(timer);
    }
  }, [onFinish]);

  return (
    <div className="loader-overlay">
      <div className="netflix-loader">
        <div className="netflix-n">
          <span className="bar left"></span>
          <span className="bar middle"></span>
          <span className="bar right"></span>
        </div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
}
