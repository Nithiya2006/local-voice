import React from "react";
import { Link } from "react-router-dom";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";
import {
  MapPin,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Users,
  AlertTriangle,
  Activity,
  Sparkles
} from "lucide-react";
import LocationButton from "../components/LocationButton";
import LocationMap from "../components/LocationMap";
import IssueCard from "../components/IssueCard";
import StatCard from "../components/StatCard";
import { CATEGORIES } from "../data/mockIssues";

const Home = () => {
  const { user } = useAuth();
  const { issues, userLocation, dashboardStats } = useIssues();

  // Show top 3 recent / active issues
  const recentIssues = issues.slice(0, 3);

  // Dynamic category count calculation
  const getCategoryCount = (categoryName) => {
    return issues.filter((i) => i.category === categoryName).length;
  };

  const resolutionRate =
    dashboardStats.totalIssues > 0
      ? ((dashboardStats.resolvedIssues / dashboardStats.totalIssues) * 100).toFixed(0) + "% resolution rate"
      : "100% resolution rate";

  return (
    <div className="home-page">
      {/* 9. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-pill">
                <Sparkles size={14} />
                <span>Civic Empowerment • Ward 12 & Citywide</span>
              </div>

              <h1 className="hero-title">
                Make Your <span className="highlight">Local Voice</span> Heard.
              </h1>

              <p className="hero-desc">
                Report local infrastructure problems, discover issues near you, and work together with your community to create safer, cleaner, and better places to live.
              </p>

              <div className="hero-actions">
                <Link to="/report" className="btn btn-primary btn-lg">
                  <PlusCircle size={20} />
                  <span>Report an Issue</span>
                </Link>

                <Link to="/issues" className="btn btn-secondary btn-lg">
                  <MapPin size={20} />
                  <span>Explore Nearby Issues</span>
                </Link>
              </div>

              {/* Citizen Greeting Tag */}
              <div style={{ marginTop: "1.75rem", display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.875rem", color: "var(--text-muted)" }}>
                <span>Welcome, <strong>{user?.name || "Neighbor"}</strong>.</span>
                <span>•</span>
                <span>Active location: <strong>{userLocation?.name || "Default Civic Center"}</strong></span>
              </div>
            </div>

            {/* Quick Live Location Interactive Box */}
            <div className="hero-interactive-card">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: userLocation?.isLive ? "#16a34a" : "#2563eb" }} />
                  <strong style={{ fontSize: "0.95rem", color: "var(--text-dark)" }}>
                    {userLocation?.isLive ? "Live GPS Connected" : "Local Radar Standby"}
                  </strong>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>
                  {issues.length} Issues Tracked
                </span>
              </div>

              <div style={{ height: "230px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
                <LocationMap
                  center={[userLocation.latitude, userLocation.longitude]}
                  userLocation={userLocation}
                  issues={issues}
                  height="230px"
                  zoom={13}
                  interactive={true}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <div style={{ fontSize: "0.8125rem", color: "var(--text-muted)" }}>
                  Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                </div>
                <Link
                  to="/issues"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "0.8125rem",
                    fontWeight: 700,
                    color: "var(--primary)"
                  }}
                >
                  <span>Open Full Map</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10 & 11. LIVE LOCATION SECTION */}
      <section style={{ padding: "3rem 0", backgroundColor: "#ffffff", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div className="location-radar-box">
            <div className="location-radar-header">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <h2 style={{ fontSize: "1.45rem", color: "var(--text-dark)" }}>📍 Problems Near You</h2>
                  <span className={`location-status-badge ${userLocation?.isLive ? "live" : "default"}`}>
                    {userLocation?.isLive ? "Live Location Active" : "Preset Civic Center"}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9375rem" }}>
                  Find infrastructure problems around your current location. We only access your GPS when you click below.
                </p>
              </div>

              <LocationButton />
            </div>

            {/* Current Coordinates Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                padding: "1rem 1.25rem",
                backgroundColor: "var(--bg-subtle)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-light)",
                marginTop: "1rem"
              }}
            >
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  📍 Current Location
                </span>
                <p style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: "0.9375rem", marginTop: "2px" }}>
                  {userLocation?.name || "Detected Area"}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Latitude
                </span>
                <p style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.9375rem", marginTop: "2px" }}>
                  {userLocation.latitude.toFixed(4)}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  Longitude
                </span>
                <p style={{ fontWeight: 600, color: "var(--primary)", fontSize: "0.9375rem", marginTop: "2px" }}>
                  {userLocation.longitude.toFixed(4)}
                </p>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>
                  GPS Status
                </span>
                <p style={{ fontWeight: 600, color: userLocation?.isLive ? "#16a34a" : "#475569", fontSize: "0.9375rem", marginTop: "2px" }}>
                  {userLocation?.isLive ? "✓ High Accuracy Live Lock" : "Standard Zone"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. STATISTICS SECTION */}
      <section className="container">
        <div className="stats-grid">
          <StatCard
            value={dashboardStats.totalIssues.toLocaleString()}
            label="Issues Reported"
            icon={<Activity size={24} />}
            bg="#eff6ff"
            color="#2563eb"
            changeText="Real-time MongoDB verified"
          />
          <StatCard
            value={dashboardStats.resolvedIssues.toLocaleString()}
            label="Issues Resolved"
            icon={<CheckCircle2 size={24} />}
            bg="#dcfce7"
            color="#16a34a"
            changeText={resolutionRate}
          />
          <StatCard
            value={dashboardStats.activeIssues.toLocaleString()}
            label="Active Issues"
            icon={<AlertTriangle size={24} />}
            bg="#fef3c7"
            color="#d97706"
            changeText="In inspection & repair"
          />
          <StatCard
            value={dashboardStats.totalUsers.toLocaleString()}
            label="Community Members"
            icon={<Users size={24} />}
            bg="#ede9fe"
            color="#7c3aed"
            changeText="Active citizens registered"
          />
        </div>
      </section>

      {/* RECENT NEARBY ISSUES PREVIEW */}
      <section className="container" style={{ marginBottom: "4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.75rem" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Live Civic Feed
            </span>
            <h2 style={{ fontSize: "1.85rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>
              Latest Reports Around You
            </h2>
          </div>
          <Link
            to="/issues"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontWeight: 700,
              fontSize: "0.9375rem",
              color: "var(--primary)"
            }}
          >
            <span>View All {issues.length} Issues</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="issues-grid">
          {recentIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </section>

      {/* 14. HOW LOCALVOICE WORKS */}
      <section style={{ backgroundColor: "#ffffff", padding: "4.5rem 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="container">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 3rem" }}>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Transparent Process
            </span>
            <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", marginTop: "0.35rem" }}>
              How LocalVoice Works
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>
              From initial photo report to verified repair on the ground, every step is visible and collaborative.
            </p>
          </div>

          <div className="how-it-works-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3 className="step-title">Report</h3>
              <p className="step-description">
                Snap a photo, select a category, and let your browser pinpoint the exact GPS coordinates in seconds.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">02</div>
              <h3 className="step-title">Community Support</h3>
              <p className="step-description">
                Neighbors confirm they are affected by clicking "+1 Have the Same Problem", elevating urgency to officials.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">03</div>
              <h3 className="step-title">Track</h3>
              <p className="step-description">
                Follow real-time status milestones: Reported, Verified, Assigned to departments, and In Progress.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">04</div>
              <h3 className="step-title">Resolve</h3>
              <p className="step-description">
                Inspect final repairs, verify resolution, and receive instant frontend confirmation updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 15. ISSUE CATEGORIES */}
      <section className="container" style={{ padding: "4.5rem 1.25rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
          <div>
            <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Explore By Problem
            </span>
            <h2 style={{ fontSize: "2rem", color: "var(--text-dark)", marginTop: "0.35rem" }}>
              Issue Categories
            </h2>
            <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>
              Select a category to filter civic problems in your sector.
            </p>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
            const count = getCategoryCount(cat.name);
            return (
              <Link
                key={cat.id}
                to={`/issues?category=${encodeURIComponent(cat.name)}`}
                className="category-card"
              >
                <div className="category-card-top">
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-count">{count} {count === 1 ? "report" : "reports"}</span>
                </div>
                <h3 className="category-name">{cat.label || cat.name}</h3>
                <p className="category-desc">{cat.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
