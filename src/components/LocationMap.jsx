import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { Link } from "react-router-dom";
import { createIssueIcon, createUserLocationIcon } from "./IssueMarker";
import StatusBadge from "./StatusBadge";
import { formatDistance, computeDistanceKm } from "../utils/location";
import { MapPin, ArrowRight, Eye } from "lucide-react";

// Helper component to smoothly center map when coordinates change
function RecenterMap({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true
      });
    }
  }, [center, zoom, map]);
  return null;
}

// Click handler for location picker in report page
function LocationPickerHandler({ onLocationPicked }) {
  useMapEvents({
    click(e) {
      if (onLocationPicked) {
        onLocationPicked({
          latitude: Number(e.latlng.lat.toFixed(5)),
          longitude: Number(e.latlng.lng.toFixed(5))
        });
      }
    }
  });
  return null;
}

const LocationMap = ({
  center,
  zoom = 14,
  userLocation,
  issues = [],
  height = "420px",
  interactive = true,
  isPicker = false,
  selectedLocation = null,
  onLocationPicked = null
}) => {
  const mapCenter = center || (userLocation ? [userLocation.latitude, userLocation.longitude] : [13.0827, 80.2707]);

  return (
    <div
      style={{
        width: "100%",
        height: height,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        position: "relative",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-sm)"
      }}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={interactive}
        dragging={interactive}
        touchZoom={interactive}
        doubleClickZoom={interactive}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} zoom={zoom} />

        {isPicker && <LocationPickerHandler onLocationPicked={onLocationPicked} />}

        {/* User Location Radar Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div style={{ padding: "0.5rem", maxWidth: "200px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontWeight: 700, color: "var(--primary)", fontSize: "0.875rem" }}>
                  <MapPin size={16} />
                  <span>Your Current Location</span>
                </div>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  {userLocation.name || "Live GPS location active."}
                </p>
                <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "0.25rem" }}>
                  Lat: {userLocation.latitude.toFixed(4)}, Lng: {userLocation.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Selected Location in Picker Mode */}
        {isPicker && selectedLocation && (
          <Marker
            position={[selectedLocation.latitude, selectedLocation.longitude]}
            icon={createIssueIcon("Infrastructure", "Reported")}
          >
            <Popup>
              <div style={{ padding: "0.5rem" }}>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-dark)" }}>Selected Problem Location</strong>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Lat: {selectedLocation.latitude.toFixed(4)}, Lng: {selectedLocation.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Nearby Issue Markers */}
        {!isPicker &&
          issues.map((issue) => {
            const distance = userLocation
              ? computeDistanceKm(userLocation.latitude, userLocation.longitude, issue.latitude, issue.longitude)
              : null;

            return (
              <Marker
                key={issue.id}
                position={[issue.latitude, issue.longitude]}
                icon={createIssueIcon(issue.category, issue.status)}
              >
                <Popup>
                  <div style={{ width: "240px" }}>
                    {issue.image && (
                      <img
                        src={issue.image}
                        alt={issue.title}
                        style={{
                          width: "100%",
                          height: "110px",
                          objectFit: "cover"
                        }}
                      />
                    )}
                    <div style={{ padding: "0.75rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)" }}>
                          {issue.category}
                        </span>
                        <StatusBadge status={issue.status} size="small" />
                      </div>

                      <h4
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          lineHeight: 1.3,
                          marginBottom: "0.35rem",
                          color: "var(--text-dark)"
                        }}
                      >
                        {issue.title}
                      </h4>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                          marginBottom: "0.75rem"
                        }}
                      >
                        <MapPin size={12} color="#2563eb" />
                        <span>{formatDistance(distance)}</span>
                      </div>

                      <Link
                        to={`/issues/${issue.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.35rem",
                          backgroundColor: "var(--primary)",
                          color: "#ffffff",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "0.45rem",
                          borderRadius: "var(--radius-sm)",
                          textDecoration: "none"
                        }}
                      >
                        <span>View Details</span>
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
