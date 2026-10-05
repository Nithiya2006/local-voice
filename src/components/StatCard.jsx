import React from "react";

const StatCard = ({ label, value, icon, bg = "#eff6ff", color = "#2563eb", changeText }) => {
  return (
    <div className="stat-card">
      <div
        className="stat-icon-wrapper"
        style={{ backgroundColor: bg, color: color }}
      >
        {icon}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {changeText && (
          <div style={{ fontSize: "0.75rem", color: "#16a34a", fontWeight: 600, marginTop: "0.2rem" }}>
            {changeText}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
