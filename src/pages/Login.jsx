import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, Lock, Mail, MapPin, Shield, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Button from "../components/Button";
import Logo from "../components/Logo";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("alex.morgan@community.org");
  const [password, setPassword] = useState("community2026");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      setIsLoading(false);
      if (res.success) {
        const destination = location.state?.from?.pathname || "/home";
        navigate(destination, { replace: true });
      } else {
        setError(res.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Failed to log in. Please ensure the backend server is running.");
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail("alex.morgan@community.org");
    setPassword("community2026");
    setIsLoading(true);
    setError("");

    try {
      const res = await login("alex.morgan@community.org", "community2026", true);
      setIsLoading(false);
      if (res.success) {
        navigate("/home", { replace: true });
      } else {
        setError(res.message || "Demo login failed");
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || "Demo login failed");
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Visual Hero Side */}
      <div className="auth-hero-side">
        <div className="auth-hero-brand" style={{ display: "flex", alignItems: "center" }}>
          <Logo size={42} textSize="1.5rem" light={true} />
        </div>

        <div className="auth-hero-main">
          <h1 className="auth-hero-headline">
            Your Voice.<br />Your Community.<br />Your Change.
          </h1>
          <p className="auth-hero-tagline">
            Join thousands of active residents who report potholes, broken lights, and water leaks to transform our city neighborhoods together.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <MapPin className="auth-feature-icon" size={20} />
              <span>Instant live GPS location detection for precision reporting</span>
            </div>
            <div className="auth-feature-item">
              <Users className="auth-feature-icon" size={20} />
              <span>Community co-signing & support count for high urgency</span>
            </div>
            <div className="auth-feature-item">
              <Shield className="auth-feature-icon" size={20} />
              <span>Direct transparent timeline tracking to municipal resolution</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          © 2026 LocalVoice Civic Platform. Frontend-Only Prototype.
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to make your local voice heard.</p>
          </div>

          {/* Quick Demo Login Callout */}
          <div className="demo-credentials-box">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <strong>Demo Access:</strong>
                <div style={{ fontSize: "0.75rem", marginTop: "2px" }}>
                  Email: <code>alex.morgan@community.org</code>
                </div>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="btn btn-primary btn-sm"
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem" }}
              >
                1-Click Demo Sign In
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#fee2e2",
                border: "1px solid #fecaca",
                color: "var(--danger)",
                padding: "0.75rem 1rem",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                marginBottom: "1.25rem"
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-control"
                  placeholder="name@example.com"
                  required
                  style={{ paddingLeft: "2.5rem" }}
                />
                <Mail
                  size={18}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label" htmlFor="password-input">
                  Password
                </label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert("Demo Mode: You can sign in using any password of 6+ characters or click '1-Click Demo Sign In'.");
                  }}
                  style={{ fontSize: "0.8125rem", color: "var(--primary)", fontWeight: 500 }}
                >
                  Forgot password?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                  required
                  style={{ paddingLeft: "2.5rem", paddingRight: "2.5rem" }}
                />
                <Lock
                  size={18}
                  style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--text-light)",
                    cursor: "pointer"
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "1rem 0 1.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", cursor: "pointer", color: "var(--text-main)" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                />
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              style={{ width: "100%", padding: "0.85rem" }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to LocalVoice
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.75rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
