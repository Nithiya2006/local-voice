import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIssues } from "../context/IssueContext";
import Logo from "./Logo";
import {
  Bell,
  Menu,
  X,
  PlusCircle,
  Home,
  MapPin,
  FileText,
  User,
  LogOut,
  Info,
  Compass
} from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const { unreadNotificationsCount } = useIssues();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo */}
          <Link to={isLoggedIn ? "/home" : "/"} className="navbar-brand" onClick={closeMobile} style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Logo size={36} textSize="1.3rem" />
          </Link>

          {/* Navigation Links for Logged-In Users */}
          {isLoggedIn ? (
            <>
              <nav className="navbar-links">
                <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Home size={16} />
                  <span>Home</span>
                </NavLink>

                <NavLink to="/issues" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <MapPin size={16} />
                  <span>Nearby Issues</span>
                </NavLink>

                <NavLink to="/report" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <PlusCircle size={16} />
                  <span>Report Issue</span>
                </NavLink>

                <NavLink to="/my-reports" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <FileText size={16} />
                  <span>My Reports</span>
                </NavLink>

                <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                  <Info size={16} />
                  <span>About</span>
                </NavLink>
              </nav>

              {/* Actions Right */}
              <div className="navbar-actions">
                <Link
                  to="/notifications"
                  className="notif-badge-btn"
                  title="Notifications"
                  aria-label="View notifications"
                >
                  <Bell size={18} />
                  {unreadNotificationsCount > 0 && (
                    <span className="notif-count-pill">
                      {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
                    </span>
                  )}
                </Link>

                <Link to="/profile" className="user-profile-pill" title="My Profile">
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                    alt={user?.name || "User avatar"}
                    className="user-avatar-small"
                  />
                  <span style={{ maxWidth: "110px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user?.name?.split(" ")[0] || "Profile"}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-ghost btn-sm"
                  title="Log out"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", color: "var(--text-muted)" }}
                >
                  <LogOut size={16} />
                  <span style={{ fontSize: "0.8125rem" }}>Logout</span>
                </button>

                <button
                  type="button"
                  className="hamburger-btn"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
              <Link to="/" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer */}
      {isLoggedIn && (
        <div className={`mobile-nav-drawer ${mobileMenuOpen ? "open" : ""}`}>
          <NavLink to="/home" className="nav-link" onClick={closeMobile}>
            <Home size={18} />
            <span>Home Dashboard</span>
          </NavLink>
          <NavLink to="/issues" className="nav-link" onClick={closeMobile}>
            <MapPin size={18} />
            <span>Nearby Issues</span>
          </NavLink>
          <NavLink to="/report" className="nav-link" onClick={closeMobile}>
            <PlusCircle size={18} />
            <span>Report New Issue</span>
          </NavLink>
          <NavLink to="/my-reports" className="nav-link" onClick={closeMobile}>
            <FileText size={18} />
            <span>My Reports</span>
          </NavLink>
          <NavLink to="/notifications" className="nav-link" onClick={closeMobile}>
            <Bell size={18} />
            <span>Notifications ({unreadNotificationsCount})</span>
          </NavLink>
          <NavLink to="/profile" className="nav-link" onClick={closeMobile}>
            <User size={18} />
            <span>Profile ({user?.name})</span>
          </NavLink>
          <NavLink to="/about" className="nav-link" onClick={closeMobile}>
            <Info size={18} />
            <span>About LocalVoice</span>
          </NavLink>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-danger btn-sm"
            style={{ width: "100%", marginTop: "0.5rem" }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
