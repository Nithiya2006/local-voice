import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useIssues } from "../context/IssueContext";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Edit3,
  Key,
  CheckCircle2,
  FileText,
  ThumbsUp,
  Award
} from "lucide-react";
import Button from "../components/Button";
import StatCard from "../components/StatCard";

const Profile = () => {
  const { user, logout, updateProfile } = useAuth();
  const { issues, supports } = useIssues();
  const navigate = useNavigate();

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Edit form state
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editArea, setEditArea] = useState(user?.area || "");

  // Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Calculated statistics
  const userReports = issues.filter((i) => {
    const reporterId = i.reportedBy?._id || i.reportedBy;
    const currentUserId = user?._id || user?.id;
    return (
      i.isUserReport ||
      (reporterId && currentUserId && String(reporterId) === String(currentUserId)) ||
      i.reportedBy === user?.name ||
      i.reporterName === user?.name ||
      i.reportedBy === "You"
    );
  });
  const totalReportsCount = userReports.length;
  const resolvedReportsCount = userReports.filter((i) => i.status === "Resolved").length;
  const totalSupportedCount = supports.length;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      phone: editPhone,
      area: editArea
    });
    setShowEditModal(false);
    setSaveSuccessMsg("Profile details updated successfully!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    setPasswordError("");

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setShowPasswordModal(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setSaveSuccessMsg("Password changed successfully (Demo simulation).");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  return (
    <div className="container-narrow page-content">
      {/* Success banner */}
      {saveSuccessMsg && (
        <div
          style={{
            backgroundColor: "#dcfce7",
            border: "1px solid #86efac",
            color: "#15803d",
            padding: "0.85rem 1.25rem",
            borderRadius: "var(--radius-md)",
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem"
          }}
        >
          <CheckCircle2 size={18} />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="card" style={{ padding: "2.5rem 2rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "1.85rem", color: "var(--text-dark)", margin: 0 }}>
                {user?.name || "Alex Morgan"}
              </h1>
              <span
                style={{
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  padding: "0.2rem 0.6rem",
                  borderRadius: "var(--radius-full)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.3rem"
                }}
              >
                <Award size={12} />
                <span>Civic Guardian</span>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--text-muted)", fontSize: "0.875rem", marginTop: "0.35rem" }}>
              <MapPin size={15} color="#2563eb" />
              <span>{user?.area || "Central Metro Ward 12"}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <Button
              variant="secondary"
              size="sm"
              icon={Edit3}
              onClick={() => {
                setEditName(user?.name || "");
                setEditPhone(user?.phone || "");
                setEditArea(user?.area || "");
                setShowEditModal(true);
              }}
            >
              Edit Profile
            </Button>

            <Button
              variant="secondary"
              size="sm"
              icon={Key}
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* User Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1.25rem",
            padding: "1.25rem",
            backgroundColor: "var(--bg-subtle)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)"
          }}
        >
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Email Address
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", color: "var(--text-dark)", fontWeight: 600, fontSize: "0.9375rem" }}>
              <Mail size={16} color="#64748b" />
              <span>{user?.email || "alex.morgan@community.org"}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Phone Number
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", color: "var(--text-dark)", fontWeight: 600, fontSize: "0.9375rem" }}>
              <Phone size={16} color="#64748b" />
              <span>{user?.phone || "+1 (555) 019-2834"}</span>
            </div>
          </div>

          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
              Member Since
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginTop: "0.25rem", color: "var(--text-dark)", fontWeight: 600, fontSize: "0.9375rem" }}>
              <Calendar size={16} color="#64748b" />
              <span>{user?.joinedDate || "January 2026"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Metrics */}
      <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)", marginBottom: "1rem" }}>
        Community Activity Metrics
      </h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
        <StatCard
          value={totalReportsCount}
          label="Total Reports Logged"
          icon={<FileText size={22} />}
          bg="#eff6ff"
          color="#2563eb"
        />
        <StatCard
          value={resolvedReportsCount}
          label="Resolved Reports"
          icon={<CheckCircle2 size={22} />}
          bg="#dcfce7"
          color="#16a34a"
        />
        <StatCard
          value={totalSupportedCount}
          label="Community Issues Supported"
          icon={<ThumbsUp size={22} />}
          bg="#ede9fe"
          color="#7c3aed"
        />
      </div>

      {/* Account Actions / Logout */}
      <div className="card" style={{ padding: "1.5rem 1.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ color: "var(--text-dark)", fontSize: "1rem" }}>Session Management</strong>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "2px" }}>
            Sign out of your local session or clear browser demo tokens.
          </p>
        </div>

        <Button variant="danger" icon={LogOut} onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={() => setShowEditModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              boxShadow: "var(--shadow-xl)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.35rem", marginBottom: "1.25rem", color: "var(--text-dark)" }}>
              Edit Civic Profile
            </h3>

            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Neighborhood / Area</label>
                <input
                  type="text"
                  value={editArea}
                  onChange={(e) => setEditArea(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <Button variant="ghost" type="button" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "1rem"
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "440px",
              boxShadow: "var(--shadow-xl)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: "1.35rem", marginBottom: "0.5rem", color: "var(--text-dark)" }}>
              Change Password
            </h3>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Frontend simulation: password update will be persisted in demo storage.
            </p>

            {passwordError && (
              <div style={{ color: "var(--danger)", fontSize: "0.8125rem", marginBottom: "1rem" }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleSavePassword}>
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="form-control"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                  placeholder="Min 6 characters"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-control"
                  placeholder="Re-type new password"
                  required
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1.5rem" }}>
                <Button variant="ghost" type="button" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
