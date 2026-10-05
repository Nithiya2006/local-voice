import React from "react";

const LoadingSpinner = ({ text = "Loading...", size = "normal" }) => {
  const spinnerSize = size === "small" ? "20px" : size === "large" ? "48px" : "32px";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "3rem 1rem",
        color: "var(--text-muted)"
      }}
    >
      <div
        style={{
          width: spinnerSize,
          height: spinnerSize,
          border: "3px solid #e2e8f0",
          borderTopColor: "var(--primary)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }}
      />
      {text && <p style={{ fontSize: "0.875rem", fontWeight: 500 }}>{text}</p>}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
