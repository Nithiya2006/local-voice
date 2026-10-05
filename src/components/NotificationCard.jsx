import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ThumbsUp, Clock, MapPin, CheckCircle2, Bell } from "lucide-react";

const NOTIF_ICONS = {
  verified: { icon: ShieldCheck, bg: "#dbeafe", color: "#1e40af" },
  support: { icon: ThumbsUp, bg: "#dcfce7", color: "#15803d" },
  progress: { icon: Clock, bg: "#ffedd5", color: "#c2410c" },
  nearby: { icon: MapPin, bg: "#ede9fe", color: "#6d28d9" },
  resolved: { icon: CheckCircle2, bg: "#dcfce7", color: "#15803d" }
};

const NotificationCard = ({ notification, onMarkRead }) => {
  const meta = NOTIF_ICONS[notification.type] || { icon: Bell, bg: "#f1f5f9", color: "#475569" };
  const Icon = meta.icon;

  const handleClick = () => {
    if (!notification.read && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const cardContent = (
    <div
      className={`notification-item ${!notification.read ? "unread" : ""}`}
      onClick={handleClick}
      style={{ cursor: notification.issueId ? "pointer" : "default" }}
    >
      <div className="notif-icon-circle" style={{ backgroundColor: meta.bg, color: meta.color }}>
        <Icon size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem", marginBottom: "0.25rem" }}>
          <h4 style={{ fontSize: "0.9375rem", fontWeight: 700, color: "var(--text-dark)" }}>
            {notification.title}
          </h4>
          <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
            {notification.time}
          </span>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-main)", lineHeight: 1.45 }}>
          {notification.message}
        </p>

        {notification.issueId && (
          <span style={{ display: "inline-block", marginTop: "0.4rem", fontSize: "0.75rem", color: "var(--primary)", fontWeight: 600 }}>
            View related issue →
          </span>
        )}
      </div>

      {!notification.read && (
        <span
          title="Unread notification"
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "var(--primary)",
            flexShrink: 0,
            marginTop: "6px"
          }}
        />
      )}
    </div>
  );

  if (notification.issueId) {
    return (
      <Link to={`/issues/${notification.issueId}`} style={{ textDecoration: "none", color: "inherit" }}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};

export default NotificationCard;
