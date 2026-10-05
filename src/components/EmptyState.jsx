import React from "react";
import Button from "./Button";

const EmptyState = ({
  icon: Icon,
  title = "No items found",
  description = "There are no records matching your criteria.",
  actionLabel,
  onAction,
  emoji = "🔍"
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "3.5rem 1.5rem",
        backgroundColor: "#ffffff",
        borderRadius: "var(--radius-lg)",
        border: "1px dashed var(--border-light)",
        maxWidth: "520px",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          backgroundColor: "var(--bg-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.75rem",
          marginBottom: "1rem"
        }}
      >
        {Icon ? <Icon size={28} color="#64748b" /> : emoji}
      </div>
      <h3 style={{ fontSize: "1.15rem", marginBottom: "0.4rem", color: "var(--text-dark)" }}>
        {title}
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", maxWidth: "380px", marginBottom: actionLabel ? "1.5rem" : 0 }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
