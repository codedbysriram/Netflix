import React from "react";
import introVideoSrc from "../assets/NETFLIX_intro.mp4"; // renamed variable
import "../Styles/IntroVideo.css";

export default function IntroVideo({ onFinish }) {
  return (
    <video
      className="intro-video"
      autoPlay
      muted
      onEnded={onFinish}
      src={introVideoSrc}
    />
  );
}
