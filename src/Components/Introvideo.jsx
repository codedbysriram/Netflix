import React from "react";
import IntroVideo from "../assets/NETFLIX_intro.mp4";
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
