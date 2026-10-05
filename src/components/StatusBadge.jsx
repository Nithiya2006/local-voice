import React from "react";
import { STATUS_CONFIG } from "../data/mockIssues";

const StatusBadge = ({ status = "Reported", size = "normal" }) => {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "#64748B",
    bg: "#F1F5F9",
    text: "#334155"
  };

  const statusClass = `status-${status.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <span
      className={`status-badge ${statusClass}`}
      style={{
        fontSize: size === "small" ? "0.7rem" : "0.75rem",
        padding: size === "small" ? "0.15rem 0.5rem" : "0.25rem 0.65rem"
      }}
    >
      <span
        className="status-dot"
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
};

export default StatusBadge;
