import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Heart,
  Users,
  MapPin,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  Globe
} from "lucide-react";
import Button from "../components/Button";
import { LogoIcon } from "../components/Logo";

const About = () => {
  return (
    <div className="container page-content">
      {/* Hero Banner */}
      <div style={{ textAlign: "center", maxWidth: "780px", margin: "1rem auto 3.5rem" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <LogoIcon size={56} />
        </div>
        <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          About LocalVoice
        </span>
        <h1 style={{ fontSize: "2.75rem", color: "var(--text-dark)", marginTop: "0.35rem", lineHeight: 1.2 }}>
          Your Voice. Your Community. <br />Your Change.
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", marginTop: "1rem", lineHeight: 1.6 }}>
          LocalVoice gives communities a simple way to report, discover, and track local infrastructure problems in real-time using live GPS coordinates and collaborative citizen action.
        </p>
      </div>

      {/* 3 Pillar Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem", marginBottom: "4rem" }}>
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", backgroundColor: "var(--primary-light)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <MapPin size={24} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
            Live Geo-Awareness
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Accurate GPS coordinates remove ambiguity. Municipal authorities know the precise spot of the pothole, water leak, or downed power line immediately.
          </p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", backgroundColor: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Users size={24} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
            Community Co-Signing
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            Single complaints often get ignored. When dozens of neighbors click "+1 I Have the Same Problem", the collective weight elevates priority for rapid resolution.
          </p>
        </div>

        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "var(--radius-md)", backgroundColor: "#ede9fe", color: "#7c3aed", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Shield size={24} />
          </div>
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
            Radical Transparency
          </h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6 }}>
            No black-box complaint forms. Track public status stages from Reported to Inspection, Contractor Assignment, In Progress, and Final Public Verification.
          </p>
        </div>
      </div>

      {/* Our Mission Section */}
      <section style={{ backgroundColor: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)", padding: "3rem", marginBottom: "3.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Our Mission
            </span>
            <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", marginTop: "0.35rem", marginBottom: "1rem" }}>
              Bridging the Gap Between Citizens & Public Works
            </h2>
            <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.65, marginBottom: "1rem" }}>
              Cities belong to the people who walk their sidewalks, drive their roads, and inhabit their parks. When public infrastructure deteriorates, ordinary citizens suffer the daily friction of broken streetlamps, dangerous potholes, and stagnant waste.
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: 1.65 }}>
              LocalVoice turns passive frustration into actionable civic coordination. By making neighborhood issues publicly visible on an interactive map, we hold public agencies accountable and celebrate the field workers who restore our communal spaces.
            </p>
          </div>

          <div style={{ backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-lg)", padding: "2rem", border: "1px solid var(--border-light)" }}>
            <h4 style={{ fontSize: "1.1rem", color: "var(--text-dark)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <TrendingUp size={20} color="#2563eb" />
              <span>Measurable Community Impact</span>
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                  <strong>68% faster response times</strong> for issues with 20+ community co-signs
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                  <strong>Over 850+ safety hazards</strong> resolved across central wards
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <CheckCircle2 size={18} color="#16a34a" />
                <span style={{ fontSize: "0.9rem", color: "var(--text-main)" }}>
                  <strong>Zero bureaucracy</strong>: One-click photo upload with instant GPS geotagging
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture & Backend-Ready Design */}
      <section style={{ padding: "2.5rem", backgroundColor: "var(--bg-subtle)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-light)", marginBottom: "3.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <Cpu size={22} color="#2563eb" />
          <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)" }}>
            Frontend-First Architecture (Ready for Node.js + Express + MongoDB)
          </h3>
        </div>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, maxWidth: "860px" }}>
          This application is designed as a production-grade 100% frontend client using React 19, React Router 7, Leaflet, and standard browser Geolocation APIs. State operations are modularized into clean Context & Storage providers (<code>IssueContext</code>, <code>AuthContext</code>, <code>storage.js</code>), allowing effortless plug-and-play connection to a RESTful Node.js + Express backend with MongoDB GeoJSON queries whenever required.
        </p>
      </section>

      {/* Call to Action */}
      <div style={{ textAlign: "center", padding: "3rem 1rem", backgroundColor: "#ffffff", borderRadius: "var(--radius-xl)", border: "1px solid var(--border-light)" }}>
        <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", marginBottom: "0.75rem" }}>
          Ready to Make an Impact in Your Area?
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "540px", margin: "0 auto 1.75rem" }}>
          Spot a problem in your street? Submit a quick report or explore active infrastructure repairs near you.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <Link to="/report" className="btn btn-primary btn-lg">
            <span>Report an Issue</span>
            <ArrowRight size={18} />
          </Link>
          <Link to="/issues" className="btn btn-secondary btn-lg">
            <span>Explore Issues Map</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
