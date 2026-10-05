import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useIssues } from "../context/IssueContext";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  ThumbsUp,
  Share2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Shield,
  Layers,
  Check
} from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import LocationMap from "../components/LocationMap";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { formatDistance, formatCoordinates } from "../utils/location";
import { STATUS_STEPS, STATUS_CONFIG, CATEGORIES } from "../data/mockIssues";

const IssueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { issues, supports, toggleSupport, updateIssueStatus, userLocation, getIssueDistance } = useIssues();
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const issue = issues.find((item) => String(item.id || item._id) === String(id));

  if (!issue) {
    return (
      <div className="container page-content">
        <EmptyState
          title="Issue Not Found"
          description="The civic issue you are looking for does not exist or may have been archived."
          actionLabel="Back to Nearby Issues"
          onAction={() => navigate("/issues")}
        />
      </div>
    );
  }

  const isSupported = supports.includes(issue.id) || supports.includes(issue._id);
  const distance = getIssueDistance(issue);
  const categoryMeta = CATEGORIES.find((c) => c.name === issue.category) || { icon: "📍" };

  const handleSupportClick = () => {
    toggleSupport(issue.id || issue._id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdvanceStatus = async (newStatus) => {
    setIsUpdatingStatus(true);
    await updateIssueStatus(issue.id || issue._id, newStatus, statusNote || `Status updated to ${newStatus}`);
    setIsUpdatingStatus(false);
  };

  // Determine current timeline progress index
  const currentStepIndex = STATUS_STEPS.indexOf(issue.status);

  return (
    <div className="container page-content">
      {/* Back button & Breadcrumb */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-secondary btn-sm"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Share2 size={16} />}
            <span>{copied ? "Link Copied!" : "Share Issue"}</span>
          </button>
        </div>
      </div>

      <div className="issue-details-layout">
        {/* Left Column: Image, Description, Details */}
        <div>
          {/* Main Photo Banner */}
          <div style={{ position: "relative", marginBottom: "1.5rem" }}>
            <img
              src={issue.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1200&q=80"}
              alt={issue.title}
              className="issue-detail-main-img"
            />
            <div style={{ position: "absolute", top: "16px", left: "16px" }}>
              <StatusBadge status={issue.status} />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
                backgroundColor: "rgba(15, 23, 42, 0.85)",
                backdropFilter: "blur(4px)",
                color: "#ffffff",
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.8125rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <span>{categoryMeta.icon}</span>
              <span>{issue.category}</span>
            </div>
          </div>

          {/* Title & Metadata Strip */}
          <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--primary)", fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase" }}>
              <span>{categoryMeta.icon} {issue.category} Issue</span>
              <span>•</span>
              <span>ID: #{issue.id}</span>
            </div>

            <h1 style={{ fontSize: "1.95rem", color: "var(--text-dark)", lineHeight: 1.25, marginBottom: "1rem" }}>
              {issue.title}
            </h1>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1.25rem", padding: "1rem 0", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)", fontSize: "0.875rem", color: "var(--text-muted)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={16} color="#2563eb" />
                <span style={{ color: "var(--text-dark)", fontWeight: 500 }}>{issue.address || issue.area}</span>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>({formatDistance(distance)})</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Calendar size={16} />
                <span>Reported {issue.reportedAt || "Recently"}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <User size={16} />
                <span>Reported by <strong>{issue.reporterName || issue.reportedBy?.name || (typeof issue.reportedBy === "string" ? issue.reportedBy : "Citizen")}</strong></span>
              </div>
            </div>

            {/* Description Body */}
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.6rem", color: "var(--text-dark)" }}>
                Detailed Description & Hazard Report
              </h3>
              <p style={{ color: "var(--text-main)", fontSize: "0.95rem", lineHeight: 1.65 }}>
                {issue.description}
              </p>
            </div>

            {/* Support Call to Action Box */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1.25rem 1.5rem",
                backgroundColor: isSupported ? "var(--primary-light)" : "var(--bg-subtle)",
                border: isSupported ? "1px solid var(--primary-border)" : "1px solid var(--border-light)",
                borderRadius: "var(--radius-lg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "1rem"
              }}
            >
              <div>
                <strong style={{ fontSize: "1rem", color: "var(--text-dark)", display: "block" }}>
                  {issue.supportCount || 0} Community Members Affected
                </strong>
                <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {isSupported
                    ? "You have supported this report. Your confirmation has been recorded."
                    : "Confirm that you also experience this problem to boost priority for municipal repair crews."}
                </p>
              </div>

              <Button
                variant={isSupported ? "primary" : "secondary"}
                onClick={handleSupportClick}
                icon={ThumbsUp}
                size="md"
              >
                {isSupported ? "✓ You Supported This" : "👍 I Have the Same Problem"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Status Timeline & Location Pin Map */}
        <div>
          {/* 19. ISSUE STATUS TIMELINE */}
          <div className="card" style={{ padding: "1.75rem", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.15rem", color: "var(--text-dark)" }}>Status Timeline</h3>
              <StatusBadge status={issue.status} size="small" />
            </div>

            <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Municipal workflow tracking from submission to public verification.
            </p>

            <div className="timeline-flow">
              {STATUS_STEPS.map((step, idx) => {
                const isCompleted = idx < currentStepIndex || (idx === currentStepIndex && step === "Resolved");
                const isCurrent = idx === currentStepIndex && step !== "Resolved";
                const isPending = idx > currentStepIndex;

                const stepData = issue.timeline?.find((t) => t.status === step) || {
                  note: isPending ? "Awaiting stage kickoff." : "Completed stage.",
                  date: null
                };

                return (
                  <div
                    key={step}
                    className={`timeline-node ${isCompleted ? "completed" : isCurrent ? "active" : ""}`}
                  >
                    <div className="timeline-indicator">
                      {isCompleted ? (
                        <Check size={12} color="#ffffff" strokeWidth={3} />
                      ) : isCurrent ? (
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--primary)" }} />
                      ) : null}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span
                          className="timeline-content-title"
                          style={{
                            color: isCurrent ? "var(--primary)" : isCompleted ? "var(--text-dark)" : "var(--text-light)"
                          }}
                        >
                          {step}
                        </span>
                        {stepData.date && (
                          <span className="timeline-content-date">{stepData.date}</span>
                        )}
                      </div>

                      <p
                        className="timeline-content-note"
                        style={{ color: isCurrent ? "var(--text-main)" : "var(--text-muted)" }}
                      >
                        {stepData.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Status Workflow Actions */}
            <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--border-light)" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>
                Update Workflow Status
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                {STATUS_STEPS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={isUpdatingStatus || issue.status === s}
                    onClick={() => handleAdvanceStatus(s)}
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "0.3rem 0.65rem",
                      borderRadius: "var(--radius-sm)",
                      border: issue.status === s ? "2px solid var(--primary)" : "1px solid var(--border-light)",
                      backgroundColor: issue.status === s ? "var(--primary-light)" : "#ffffff",
                      color: issue.status === s ? "var(--primary)" : "var(--text-main)",
                      cursor: issue.status === s ? "default" : "pointer",
                      opacity: issue.status === s ? 1 : 0.85,
                      transition: "all var(--transition-fast)"
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Location Map Pin Card */}
          <div className="card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.15rem", color: "var(--text-dark)", marginBottom: "0.5rem" }}>
              Reported Location
            </h3>

            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
              {issue.address || issue.area}
            </p>

            <div style={{ height: "240px", borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "1rem" }}>
              <LocationMap
                center={[issue.latitude, issue.longitude]}
                zoom={15}
                issues={[issue]}
                userLocation={userLocation}
                height="240px"
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8125rem", color: "var(--text-muted)" }}>
              <span>Coordinates:</span>
              <strong style={{ color: "var(--text-dark)" }}>
                {formatCoordinates(issue.latitude, issue.longitude)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
