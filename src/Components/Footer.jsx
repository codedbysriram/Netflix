// src/Components/Footer.jsx
import React from "react";
import "../Styles/Footer.css";

export default function Footer() {
  return (
    <footer className="netflix-footer">
      <div className="footer-container">
        <div className="footer-top">
          <p>Questions? Call <a href="#">000-800-919-1694</a></p>
        </div>

        <div className="footer-links">
          <ul>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Investor Relations</a></li>
            <li><a href="#">Privacy</a></li>
            <li><a href="#">Speed Test</a></li>
          </ul>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Jobs</a></li>
            <li><a href="#">Cookie Preferences</a></li>
            <li><a href="#">Legal Notices</a></li>
          </ul>
          <ul>
            <li><a href="#">Account</a></li>
            <li><a href="#">Ways to Watch</a></li>
            <li><a href="#">Corporate Information</a></li>
            <li><a href="#">Only on Netflix</a></li>
          </ul>
        </div>

        <div className="footer-bottom">
          <p>Netflix Clone © {new Date().getFullYear()} | Created by <span className="dev-name">SRIRAM</span></p>
        </div>
      </div>
    </footer>
  );
}
