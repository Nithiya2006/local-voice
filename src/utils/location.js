// Geolocation utility for LocalVoice

export const DEFAULT_LOCATION = {
  latitude: 13.0827,
  longitude: 80.2707,
  accuracy: 15,
  name: "Central Metro, Ward 12",
  isLive: false
};

export const PRESET_LOCATIONS = [
  { name: "Central Metro Hub (Default)", latitude: 13.0827, longitude: 80.2707 },
  { name: "North Waterfront Enclave", latitude: 13.0985, longitude: 80.2841 },
  { name: "Tech Corridor & Outer Ring", latitude: 12.9815, longitude: 80.2180 },
  { name: "West Suburb & University", latitude: 13.0520, longitude: 80.2120 },
  { name: "Downtown New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Central London", latitude: 51.5074, longitude: -0.1278 }
];

/**
 * Haversine formula to compute great-circle distance between two GPS coordinates
 * @returns {number} distance in kilometers
 */
export function computeDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return null;
  }
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
}

/**
 * Formats distance in km or meters
 */
export function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return "Nearby";
  }
  if (distanceKm < 0.1) {
    return "< 100 m away";
  }
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m away`;
  }
  return `${distanceKm.toFixed(1)} km away`;
}

/**
 * Formats GPS coords into readable DMS or degree strings
 */
export function formatCoordinates(lat, lng) {
  if (lat === undefined || lng === undefined) return "N/A";
  const latDir = lat >= 0 ? "N" : "S";
  const lngDir = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Requests one-shot current location from browser Geolocation API
 * Does NOT track continuously.
 */
export function requestBrowserLocation() {
  return new Promise((resolve) => {
    if (!navigator || !navigator.geolocation) {
      resolve({
        success: false,
        error: "UNSUPPORTED",
        message: "Geolocation is not supported by your current browser."
      });
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          success: true,
          coords: {
            latitude: Number(position.coords.latitude.toFixed(5)),
            longitude: Number(position.coords.longitude.toFixed(5)),
            accuracy: Math.round(position.coords.accuracy || 10)
          },
          timestamp: position.timestamp
        });
      },
      (error) => {
        let message = "We couldn't access your location.";
        let errType = "UNKNOWN";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errType = "PERMISSION_DENIED";
            message = "Location permission was denied. Please allow location access in your browser or select an area manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            errType = "POSITION_UNAVAILABLE";
            message = "Location information is unavailable on your device or network.";
            break;
          case error.TIMEOUT:
            errType = "TIMEOUT";
            message = "The request to get your location timed out. Try again or choose manual location.";
            break;
          default:
            errType = "UNKNOWN";
            message = error.message || "An unknown error occurred while retrieving location.";
            break;
        }

        resolve({
          success: false,
          error: errType,
          message
        });
      },
      options
    );
  });
}
