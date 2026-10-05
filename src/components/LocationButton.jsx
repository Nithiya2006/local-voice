import React, { useState } from "react";
import { Navigation, AlertCircle, CheckCircle2, Compass } from "lucide-react";
import { useIssues } from "../context/IssueContext";
import { PRESET_LOCATIONS } from "../utils/location";
import Button from "./Button";

const LocationButton = ({ onLocationSelect, showManualToggle = true, variant = "primary" }) => {
  const {
    userLocation,
    locationStatus,
    locationError,
    requestLocation,
    setManualLocation
  } = useIssues();

  const [showManualModal, setShowManualModal] = useState(false);
  const [customLat, setCustomLat] = useState("");
  const [customLng, setCustomLng] = useState("");
  const [customName, setCustomName] = useState("");
  const [manualFormError, setManualFormError] = useState("");

  const handleRequestLive = async () => {
    const res = await requestLocation();
    if (!res.success && res.error === "PERMISSION_DENIED") {
      setShowManualModal(true);
    }
  };

  const handleApplyPreset = (preset) => {
    setManualLocation(preset);
    if (onLocationSelect) onLocationSelect(preset);
    setShowManualModal(false);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);

    if (isNaN(lat) || lat < -90 || lat > 90) {
      setManualFormError("Please enter a valid Latitude (-90 to 90).");
      return;
    }
    if (isNaN(lng) || lng < -180 || lng > 180) {
      setManualFormError("Please enter a valid Longitude (-180 to 180).");
      return;
    }

    const manual = {
      latitude: lat,
      longitude: lng,
      name: customName || `Custom (${lat.toFixed(4)}, ${lng.toFixed(4)})`
    };

    setManualLocation(manual);
    if (onLocationSelect) onLocationSelect(manual);
    setManualFormError("");
    setShowManualModal(false);
  };

  const isLoading = locationStatus === "loading";
  const isLive = userLocation?.isLive;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
        <Button
          onClick={handleRequestLive}
          variant={isLive ? "primary" : variant}
          loading={isLoading}
          icon={isLive ? CheckCircle2 : Navigation}
        >
          {isLoading
            ? "Detecting Live Location..."
            : isLive
            ? `GPS Active (${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)})`
            : "Use My Current Location"}
        </Button>

        {showManualToggle && (
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="btn btn-secondary btn-sm"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
          >
            <Compass size={15} />
            <span>Enter Location Manually</span>
          </button>
        )}
      </div>

      {/* Permission Denied or Error Message */}
      {locationStatus === "denied" && (
        <div
          style={{
            backgroundColor: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-md)",
            padding: "0.85rem 1rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.75rem",
            fontSize: "0.875rem",
            color: "#92400e"
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
          <div>
            <strong>We couldn't access your location.</strong>
            <p style={{ marginTop: "0.25rem", color: "#b45309" }}>
              {locationError || "Location permission was denied. You can select your area manually below to continue."}
            </p>
            <button
              type="button"
              onClick={() => setShowManualModal(true)}
              style={{
                marginTop: "0.5rem",
                color: "#1d4ed8",
                fontWeight: 600,
                textDecoration: "underline",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
                fontSize: "0.8125rem"
              }}
            >
              Enter Location Manually →
            </button>
          </div>
        </div>
      )}

      {/* Manual Location Modal / Dialog */}
      {showManualModal && (
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
          onClick={() => setShowManualModal(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "var(--radius-lg)",
              padding: "2rem",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "var(--shadow-xl)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h3 style={{ fontSize: "1.25rem", color: "var(--text-dark)" }}>Set Location Manually</h3>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer", color: "var(--text-muted)" }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
              Choose a preset civic neighborhood or input specific latitude/longitude coordinates to discover local issues.
            </p>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                Civic Area Presets
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {PRESET_LOCATIONS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.65rem 0.85rem",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--border-light)",
                      background: "#ffffff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all var(--transition-fast)"
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--primary-light)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ffffff")}
                  >
                    <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--text-dark)" }}>
                      {preset.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {preset.latitude.toFixed(3)}, {preset.longitude.toFixed(3)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleApplyCustom}>
              <label style={{ fontSize: "0.8125rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
                Or Custom GPS Coordinates
              </label>

              {manualFormError && (
                <div style={{ color: "var(--danger)", fontSize: "0.8125rem", marginBottom: "0.75rem" }}>
                  {manualFormError}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude (e.g. 13.0827)"
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    className="form-control"
                    style={{ padding: "0.55rem 0.75rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude (e.g. 80.2707)"
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    className="form-control"
                    style={{ padding: "0.55rem 0.75rem", fontSize: "0.875rem" }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "1.25rem" }}>
                <input
                  type="text"
                  placeholder="Area / Neighborhood Name (optional)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="form-control"
                  style={{ padding: "0.55rem 0.75rem", fontSize: "0.875rem" }}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <Button variant="ghost" onClick={() => setShowManualModal(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Set Location
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationButton;
