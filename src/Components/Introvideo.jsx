import React, { useEffect, useRef } from "react";
import "../Styles/IntroVideo.css";
import IntroVideo from "../assets/NETFLIX_intro.mp4";


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
