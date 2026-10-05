import React, { useState } from "react";
import { useIssues } from "../context/IssueContext";
import { Bell, CheckCheck, Trash2, Filter } from "lucide-react";
import NotificationCard from "../components/NotificationCard";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";

const Notifications = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    unreadNotificationsCount
  } = useIssues();

  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  return (
    <div className="container-narrow page-content">
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.75rem" }}>
        <div>
          <span style={{ fontSize: "0.8125rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Community Alerts
          </span>
          <h1 style={{ fontSize: "2.25rem", color: "var(--text-dark)", marginTop: "0.25rem" }}>
            Notifications
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.25rem" }}>
            You have <strong>{unreadNotificationsCount}</strong> unread civic updates.
          </p>
        </div>

        {unreadNotificationsCount > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={markAllNotificationsRead}
            icon={CheckCheck}
          >
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Chips */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`filter-chip ${filter === "all" ? "active" : ""}`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`filter-chip ${filter === "unread" ? "active" : ""}`}
        >
          Unread ({unreadNotificationsCount})
        </button>
      </div>

      {/* Notification Items */}
      {filteredNotifications.length > 0 ? (
        <div>
          {filteredNotifications.map((notif) => (
            <NotificationCard
              key={notif.id}
              notification={notif}
              onMarkRead={markNotificationRead}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title={filter === "unread" ? "All caught up!" : "No notifications"}
          description={
            filter === "unread"
              ? "You have read all of your community alerts and issue status updates."
              : "No notification alerts have been posted yet."
          }
        />
      )}
    </div>
  );
};

export default Notifications;
