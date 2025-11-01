import React from "react";
import "../Styles/NoInternet.css";
import { WifiOff, RefreshCcw } from "lucide-react";
import logoImg from "../assets/netflix_logo.png";

export default function NoInternet({ onRetry }) {
  return (
    <div className="no-internet fade-in">
      <img src={logoImg} alt="Netflix Logo" className="no-net-logo logo-glow" />

      <div className="wifi-animation bounce">
        <WifiOff size={70} className="wifi-icon" />
        <div className="wifi-pulse"></div>
        <div className="wifi-pulse second"></div>
      </div>

      <h1 className="no-net-title flicker">No Connection. No Chill. 😩</h1>

      <p className="no-net-msg">
        Your Wi-Fi just walked out on us. <br />
        Even Netflix can’t stream feelings without the Internet. 💔  
        <br />  
        Reconnect the cables, whisper sweet nothings to your router, and try again.
      </p>

      <button className="retry-btn pulse" onClick={onRetry}>
        <RefreshCcw size={18} /> Reconnect & Chill 🔁
      </button>

      <p className="small-hint flicker-soft">
        (If that doesn’t work… maybe your router is binge-watching too.)
      </p>
    </div>
  );
}
