import React, { useEffect, useRef } from "react";
import "../Styles/IntroVideo.css";
import videoFile from "../assets/netflix_intro.mp4"; // ✅ updated path

export default function IntroVideo({ onFinish }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch((err) => {
        console.warn("Autoplay blocked or failed:", err);
      });
    }
  }, []);

  return (
    <div className="intro-video-overlay">
      <video
        ref={videoRef}
        className="intro-video"
        src={videoFile}
        autoPlay
        playsInline
        onEnded={onFinish}
      />
    </div>
  );
}
