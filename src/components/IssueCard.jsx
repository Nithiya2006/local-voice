import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Clock, ThumbsUp, ArrowRight } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { useIssues } from "../context/IssueContext";
import { formatDistance } from "../utils/location";
import { CATEGORIES } from "../data/mockIssues";

const IssueCard = ({ issue }) => {
  const { getIssueDistance, supports, toggleSupport } = useIssues();

  const distance = getIssueDistance(issue);
  const isSupported = supports.includes(issue.id);
  const categoryInfo = CATEGORIES.find((c) => c.name === issue.category) || { icon: "📍" };

  const handleSupportClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSupport(issue.id);
  };

  return (
    <div className="issue-card">
      <Link to={`/issues/${issue.id}`} style={{ textDecoration: "none", color: "inherit" }}>
        <div className="issue-card-media">
          <img
            src={issue.image || "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"}
            alt={issue.title}
            className="issue-card-img"
            loading="lazy"
          />
          <div className="issue-card-badge-overlay">
            <StatusBadge status={issue.status} />
          </div>
          <div className="issue-card-category-overlay">
            <span>{categoryInfo.icon}</span>
            <span>{issue.category}</span>
          </div>
        </div>

        <div className="issue-card-body">
          <h3 className="issue-card-title">{issue.title}</h3>

          <div className="issue-card-location">
            <MapPin size={14} style={{ flexShrink: 0, color: "var(--primary)" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {issue.address || issue.area}
            </span>
            <span className="issue-card-distance">• {formatDistance(distance)}</span>
          </div>

          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              lineHeight: 1.45,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              marginBottom: "1rem"
            }}
          >
            {issue.description}
          </p>

          <div className="issue-card-meta">
            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--text-muted)" }}>
              <Clock size={13} />
              <span>{issue.reportedAt || "Recently"}</span>
            </div>

            <button
              type="button"
              onClick={handleSupportClick}
              title={isSupported ? "Click to remove support" : "Click to support this issue"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.3rem 0.65rem",
                borderRadius: "var(--radius-full)",
                border: isSupported ? "1px solid var(--primary)" : "1px solid var(--border-light)",
                backgroundColor: isSupported ? "var(--primary-light)" : "var(--bg-subtle)",
                color: isSupported ? "var(--primary)" : "var(--text-main)",
                fontWeight: 600,
                fontSize: "0.75rem",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }}
            >
              <ThumbsUp size={13} fill={isSupported ? "currentColor" : "none"} />
              <span>{issue.supportCount || 0} affected</span>
            </button>
          </div>
        </div>
      </Link>

      <div
        style={{
          padding: "0.65rem 1.25rem",
          backgroundColor: "#fafbfc",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          By {issue.reporterName || issue.reportedBy?.name || (typeof issue.reportedBy === "string" ? issue.reportedBy : "Citizen")}
        </span>
        <Link
          to={`/issues/${issue.id}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "0.8125rem",
            fontWeight: 600,
            color: "var(--primary)",
            textDecoration: "none"
          }}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default IssueCard;
