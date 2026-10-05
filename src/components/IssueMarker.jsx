import L from "leaflet";

const CATEGORY_ICONS = {
  Pothole: "🕳️",
  Streetlight: "💡",
  Garbage: "🗑️",
  "Water Leakage": "🚰",
  "Road Damage": "🛣️",
  "Traffic Signal": "🚦",
  "Fallen Tree": "🌳",
  Infrastructure: "🚧"
};

/**
 * Creates custom Leaflet HTML icon for community issues
 */
export const createIssueIcon = (category = "Pothole", status = "Reported") => {
  const iconEmoji = CATEGORY_ICONS[category] || "📍";
  
  let borderColor = "#2563eb";
  if (status === "Resolved") borderColor = "#16a34a";
  else if (status === "In Progress") borderColor = "#f97316";
  else if (status === "Reported") borderColor = "#f59e0b";

  return L.divIcon({
    className: "custom-issue-marker",
    html: `
      <div class="civic-pin-marker" style="border-color: ${borderColor};">
        <span class="pin-icon">${iconEmoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36]
  });
};

/**
 * Creates custom Leaflet HTML icon for User's Live GPS location
 */
export const createUserLocationIcon = () => {
  return L.divIcon({
    className: "custom-user-marker",
    html: `
      <div class="user-gps-marker">
        <div class="user-gps-pulse"></div>
        <div class="user-gps-center"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};
