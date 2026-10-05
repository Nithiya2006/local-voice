import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";
import { FileText, PlusCircle, Clock, MapPin, ThumbsUp, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { CATEGORIES } from "../data/mockIssues";

const MyReports = () => {
  const { issues } = useIssues();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'active' | 'resolved'

  // User's own reports (marked as isUserReport or matching user's ID or name)
  const myReports = useMemo(() => {
    return issues.filter((iss) => {
      const reporterId = iss.reportedBy?._id || iss.reportedBy;
      const currentUserId = user?._id || user?.id;
      return (
        iss.isUserReport === true ||
        (reporterId && currentUserId && String(reporterId) === String(currentUserId)) ||
        iss.reportedBy === user?.name ||
        iss.reporterName === user?.name ||
        iss.reportedBy === "You"
      );
    });
  }, [issues, user]);

  const filteredReports = useMemo(() => {
    if (activeTab === "active") {
      return myReports.filter((r) => r.status !== "Resolved");
    } else if (activeTab === "resolved") {
      return myReports.filter((r) => r.status === "Resolved");
    }
    return myReports;
  }, [myReports, activeTab]);

  const activeCount = myReports.filter((r) => r.status !== "Resolved").length;
  const resolvedCount = myReports.filter((r) => r.status === "Resolved").length;

  return (
    <div className="container page-content">
      {/* Header with CTA */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Personal Incident Log
          </span>
          <h1 style={{ fontSize: "2.25rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>
            My Reports
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            Track the status and progress of all infrastructure problems you have submitted.
          </p>
        </div>

        <Link to="/report" className="btn btn-primary">
          <PlusCircle size={18} />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Tabs Row */}
      <div style={{ display: "flex", gap: "0.5rem", borderBottom: "1px solid var(--border-light)", marginBottom: "2rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9375rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: activeTab === "all" ? "var(--primary)" : "var(--text-muted)",
            borderBottom: activeTab === "all" ? "2px solid var(--primary)" : "2px solid transparent",
            transition: "all var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>All Reports</span>
          <span style={{ fontSize: "0.75rem", backgroundColor: activeTab === "all" ? "var(--primary-light)" : "var(--bg-subtle)", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)" }}>
            {myReports.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9375rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: activeTab === "active" ? "var(--primary)" : "var(--text-muted)",
            borderBottom: activeTab === "active" ? "2px solid var(--primary)" : "2px solid transparent",
            transition: "all var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>Active</span>
          <span style={{ fontSize: "0.75rem", backgroundColor: activeTab === "active" ? "var(--primary-light)" : "var(--bg-subtle)", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)" }}>
            {activeCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("resolved")}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "0.9375rem",
            fontWeight: 600,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: activeTab === "resolved" ? "var(--primary)" : "var(--text-muted)",
            borderBottom: activeTab === "resolved" ? "2px solid var(--primary)" : "2px solid transparent",
            transition: "all var(--transition-fast)",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}
        >
          <span>Resolved</span>
          <span style={{ fontSize: "0.75rem", backgroundColor: activeTab === "resolved" ? "var(--primary-light)" : "var(--bg-subtle)", padding: "0.15rem 0.5rem", borderRadius: "var(--radius-full)" }}>
            {resolvedCount}
          </span>
        </button>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {filteredReports.map((report) => {
            const cat = CATEGORIES.find((c) => c.name === report.category) || { icon: "📍" };

            return (
              <div
                key={report.id}
                className="card"
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr auto",
                  gap: "1.5rem",
                  padding: "1.25rem",
                  alignItems: "center"
                }}
              >
                {/* Media Image */}
                <div style={{ height: "130px", borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative" }}>
                  <img
                    src={report.image}
                    alt={report.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "6px",
                      backgroundColor: "rgba(15, 23, 42, 0.8)",
                      color: "#fff",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      padding: "0.15rem 0.45rem",
                      borderRadius: "var(--radius-full)"
                    }}
                  >
                    {cat.icon} {report.category}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.35rem" }}>
                    <StatusBadge status={report.status} size="small" />
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      Reported {report.reportedAt || "Recently"}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--text-dark)", marginBottom: "0.4rem" }}>
                    {report.title}
                  </h3>

                  <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "0.6rem" }}>
                    <MapPin size={14} color="#2563eb" />
                    <span>{report.address || report.area}</span>
                  </div>

                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-main)",
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {report.description}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.35rem",
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--primary)",
                      backgroundColor: "var(--primary-light)",
                      padding: "0.3rem 0.65rem",
                      borderRadius: "var(--radius-full)"
                    }}
                  >
                    <ThumbsUp size={13} />
                    <span>{report.supportCount || 0} co-signed</span>
                  </div>

                  <Link
                    to={`/issues/${report.id}`}
                    className="btn btn-secondary btn-sm"
                    style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                  >
                    <span>Track Status</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title={activeTab === "all" ? "No reports submitted yet" : `No ${activeTab} reports`}
          description={
            activeTab === "all"
              ? "You haven't reported any local infrastructure problems yet. Be the first to report an issue in your street!"
              : `You have no reports currently marked as ${activeTab}.`
          }
          actionLabel="Report a Problem Now"
          onAction={() => navigate("/report")}
        />
      )}
    </div>
  );
};

export default MyReports;
