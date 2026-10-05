import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Phone, Lock, MapPin, ArrowRight, ShieldCheck } from "lucide-react";
import Button from "../components/Button";
import Logo from "../components/Logo";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    area: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = "Full Name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      errs.phone = "Phone number is required.";
    } else if (formData.phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Please enter a valid phone number (at least 7 digits).";
    }
    if (!formData.area.trim()) errs.area = "Area or City is required.";
    if (!formData.password) {
      errs.password = "Password is required.";
    } else if (formData.password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(formData);
      setIsLoading(false);
      if (res.success) {
        navigate("/home", { replace: true });
      } else {
        setServerError(res.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setIsLoading(false);
      setServerError(err.message || "Failed to register. Please check server connection.");
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Visual Brand Side */}
      <div className="auth-hero-side">
        <div className="auth-hero-brand" style={{ display: "flex", alignItems: "center" }}>
          <Logo size={42} textSize="1.5rem" light={true} />
        </div>

        <div className="auth-hero-main">
          <h1 className="auth-hero-headline">
            Start Fixing Your City Today.
          </h1>
          <p className="auth-hero-tagline">
            Your neighborhood needs proactive community eyes. Join LocalVoice to submit live photos, geo-tag issues, and turn municipal apathy into swift public action.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <ShieldCheck className="auth-feature-icon" size={20} />
              <span>Civic reports are validated & routed to ward officers</span>
            </div>
            <div className="auth-feature-item">
              <MapPin className="auth-feature-icon" size={20} />
              <span>Auto-detects live GPS coordinates on your mobile or desktop</span>
            </div>
            <div className="auth-feature-item">
              <User className="auth-feature-icon" size={20} />
              <span>Track all your reported issues in your personal dashboard</span>
            </div>
          </div>
        </div>

        <div className="auth-hero-footer">
          Civic Transparency Initiative • 100% Free & Open Community Platform
        </div>
      </div>

      {/* Right Registration Form */}
      <div className="auth-form-side" style={{ padding: "2.5rem 2rem" }}>
        <div className="auth-form-card" style={{ maxWidth: "480px" }}>
          <div className="auth-form-header">
            <h2 className="auth-title">Create Your Account</h2>
            <p className="auth-subtitle">Join your community and help make local places better.</p>
          </div>

          {serverError && (
            <div className="auth-error-banner" style={{ marginBottom: "1.25rem" }}>
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">
                Full Name
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-control ${errors.fullName ? "error" : ""}`}
                  placeholder="e.g. Alex Morgan"
                  style={{ paddingLeft: "2.5rem" }}
                />
                <User size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
              </div>
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? "error" : ""}`}
                    placeholder="name@email.com"
                    style={{ paddingLeft: "2.5rem" }}
                  />
                  <Mail size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  Phone Number
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`form-control ${errors.phone ? "error" : ""}`}
                    placeholder="+1 (555) 000-0000"
                    style={{ paddingLeft: "2.5rem" }}
                  />
                  <Phone size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                </div>
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="area">
                Area / City
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={formData.area}
                  onChange={handleChange}
                  className={`form-control ${errors.area ? "error" : ""}`}
                  placeholder="e.g. Downtown Metro, Sector 4"
                  style={{ paddingLeft: "2.5rem" }}
                />
                <MapPin size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
              </div>
              {errors.area && <span className="form-error">{errors.area}</span>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`form-control ${errors.password ? "error" : ""}`}
                    placeholder="Min 6 chars"
                    style={{ paddingLeft: "2.5rem" }}
                  />
                  <Lock size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirmPassword">
                  Confirm Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.confirmPassword ? "error" : ""}`}
                    placeholder="Re-type password"
                    style={{ paddingLeft: "2.5rem" }}
                  />
                  <Lock size={18} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-light)" }} />
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Create Account
            </Button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/" style={{ fontWeight: 600, color: "var(--primary)" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
