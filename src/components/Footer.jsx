import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, Globe, Shield, MessageSquare, Mail, Share2 } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand Info */}
          <div className="footer-brand">
            <div className="footer-brand-title" style={{ display: "flex", alignItems: "center" }}>
              <Logo size={32} textSize="1.3rem" light={true} />
            </div>
            <p className="footer-tagline">
              Your Voice. Your Community. Your Change.
            </p>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5 }}>
              Empowering citizens to report municipal problems, track repairs with live GPS, and support fellow neighbors.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}
                title="Community Web"
              >
                <Globe size={16} />
              </span>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}
                title="Civic Inquiries"
              >
                <Mail size={16} />
              </span>
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  backgroundColor: "#1e293b",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8"
                }}
                title="Citizen Feedback"
              >
                <MessageSquare size={16} />
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Navigation</h4>
            <ul className="footer-links">
              <li>
                <Link to={isLoggedIn ? "/home" : "/"} className="footer-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/issues" className="footer-link">
                  Nearby Issues
                </Link>
              </li>
              <li>
                <Link to="/report" className="footer-link">
                  Report Problem
                </Link>
              </li>
              <li>
                <Link to="/my-reports" className="footer-link">
                  My Reports
                </Link>
              </li>
              <li>
                <Link to="/about" className="footer-link">
                  About LocalVoice
                </Link>
              </li>
            </ul>
          </div>

          {/* Issue Types */}
          <div>
            <h4 className="footer-col-title">Categories</h4>
            <ul className="footer-links">
              <li>
                <Link to="/issues?category=Pothole" className="footer-link">
                  🕳️ Potholes & Roads
                </Link>
              </li>
              <li>
                <Link to="/issues?category=Streetlight" className="footer-link">
                  💡 Broken Streetlights
                </Link>
              </li>
              <li>
                <Link to="/issues?category=Garbage" className="footer-link">
                  🗑️ Waste Management
                </Link>
              </li>
              <li>
                <Link to="/issues?category=Water Leakage" className="footer-link">
                  🚰 Water Pipelines
                </Link>
              </li>
              <li>
                <Link to="/issues?category=Traffic Signal" className="footer-link">
                  🚦 Traffic Signals
                </Link>
              </li>
            </ul>
          </div>

          {/* Civic Pledge */}
          <div>
            <h4 className="footer-col-title">Civic Mission</h4>
            <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.6, marginBottom: "1rem" }}>
              Every issue reported helps municipal departments prioritize urgent community hazards and maintain accountability.
            </p>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.4rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "#1e293b",
                color: "#60a5fa",
                fontSize: "0.75rem",
                fontWeight: 600
              }}
            >
              <Shield size={14} />
              <span>100% Civic Privacy Protected</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© 2026 LocalVoice. All rights reserved.</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link to="/about" style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>
              Privacy Policy
            </Link>
            <Link to="/about" style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>
              Terms of Service
            </Link>
            <Link to="/about" style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>
              Civic Guidelines
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
