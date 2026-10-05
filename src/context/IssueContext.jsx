import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../services/api";
import {
  DEFAULT_LOCATION,
  requestBrowserLocation,
  computeDistanceKm,
  formatCoordinates
} from "../utils/location";

const IssueContext = createContext(null);

export const IssueProvider = ({ children }) => {
  const [issues, setIssues] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [supports, setSupports] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalIssues: 0,
    resolvedIssues: 0,
    activeIssues: 0,
    totalUsers: 0
  });

  const [isLoadingIssues, setIsLoadingIssues] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // Location state
  const [userLocation, setUserLocation] = useState(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState("idle"); // 'idle' | 'loading' | 'success' | 'denied' | 'error'
  const [locationError, setLocationError] = useState(null);

  /**
   * Fetch dashboard statistics from backend MongoDB
   */
  const fetchDashboardStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await api.getDashboardStats();
      if (data.success && data.stats) {
        setDashboardStats(data.stats);
      }
    } catch (err) {
      console.warn("Failed to fetch dashboard stats:", err.message);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  /**
   * Fetch all issues from backend MongoDB
   */
  const fetchIssues = useCallback(async (params = {}) => {
    setIsLoadingIssues(true);
    try {
      const data = await api.getIssues(params);
      if (data.success && Array.isArray(data.issues)) {
        // Map _id to id if needed for compatibility
        const mappedIssues = data.issues.map((item) => ({
          ...item,
          id: item._id || item.id
        }));
        setIssues(mappedIssues);
      }
    } catch (err) {
      console.warn("Failed to fetch issues from backend:", err.message);
    } finally {
      setIsLoadingIssues(false);
    }
  }, []);

  /**
   * Fetch user's notifications and supported list
   */
  const fetchUserData = useCallback(async () => {
    const token = localStorage.getItem("localvoice_token");
    if (!token) return;

    try {
      const [notifData, supportData] = await Promise.all([
        api.getNotifications().catch(() => ({ success: false })),
        api.getMySupports().catch(() => ({ success: false }))
      ]);

      if (notifData.success && Array.isArray(notifData.notifications)) {
        const mapped = notifData.notifications.map((n) => ({
          ...n,
          id: n._id || n.id
        }));
        setNotifications(mapped);
      }

      if (supportData.success && Array.isArray(supportData.supportedIssueIds)) {
        setSupports(supportData.supportedIssueIds);
      }
    } catch (err) {
      console.warn("Error fetching user notifications/supports:", err.message);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchIssues();
    fetchDashboardStats();
    fetchUserData();
  }, [fetchIssues, fetchDashboardStats, fetchUserData]);

  /**
   * Request live browser coordinates
   */
  const requestLocation = useCallback(async () => {
    setLocationStatus("loading");
    setLocationError(null);

    const result = await requestBrowserLocation();

    if (result.success) {
      const liveLoc = {
        latitude: result.coords.latitude,
        longitude: result.coords.longitude,
        accuracy: result.coords.accuracy,
        name: `Live GPS (${formatCoordinates(result.coords.latitude, result.coords.longitude)})`,
        isLive: true
      };

      setUserLocation(liveLoc);
      setLocationStatus("success");
      setLocationError(null);

      // Fetch nearby issues from MongoDB geospatial API
      try {
        const nearbyData = await api.getNearbyIssues(
          result.coords.latitude,
          result.coords.longitude
        );
        if (nearbyData.success && Array.isArray(nearbyData.issues)) {
          const mapped = nearbyData.issues.map((i) => ({
            ...i,
            id: i._id || i.id
          }));
          setIssues(mapped);
        }
      } catch (err) {
        console.warn("Nearby API warning:", err.message);
      }

      return { success: true, location: liveLoc };
    } else {
      setLocationStatus(result.error === "PERMISSION_DENIED" ? "denied" : "error");
      setLocationError(result.message);
      return { success: false, error: result.error, message: result.message };
    }
  }, []);

  /**
   * Set manual location from preset or coordinate inputs
   */
  const setManualLocation = useCallback((loc) => {
    const manualLoc = {
      latitude: Number(loc.latitude),
      longitude: Number(loc.longitude),
      accuracy: 25,
      name: loc.name || "Manually Selected Area",
      isLive: false
    };
    setUserLocation(manualLoc);
    setLocationStatus("success");
    setLocationError(null);
  }, []);

  /**
   * Toggle community support on an issue via backend API
   */
  const toggleSupport = useCallback(async (issueId) => {
    try {
      const res = await api.supportIssue(issueId);
      if (res.success) {
        setSupports((prev) => {
          if (res.supported) {
            return prev.includes(issueId) ? prev : [...prev, issueId];
          } else {
            return prev.filter((id) => id !== issueId);
          }
        });

        // Update local issue support count
        setIssues((prev) =>
          prev.map((iss) => {
            const currentId = String(iss._id || iss.id);
            if (currentId === String(issueId)) {
              return { ...iss, supportCount: res.supportCount };
            }
            return iss;
          })
        );

        fetchUserData();
        return { success: true, supported: res.supported, count: res.supportCount };
      }
      return { success: false };
    } catch (err) {
      console.error("Support API Error:", err.message);
      return { success: false, message: err.message };
    }
  }, [fetchUserData]);

  /**
   * Add a new civic issue report via backend API
   */
  const addReport = useCallback(async (newReportData) => {
    try {
      let payload;

      if (newReportData instanceof FormData) {
        payload = newReportData;
      } else {
        // If image is a File object, use FormData; otherwise JSON
        if (newReportData.imageFile instanceof File) {
          const formData = new FormData();
          formData.append("title", newReportData.title);
          formData.append("category", newReportData.category);
          formData.append("description", newReportData.description);
          formData.append("latitude", newReportData.latitude || userLocation.latitude);
          formData.append("longitude", newReportData.longitude || userLocation.longitude);
          formData.append("locationName", newReportData.address || userLocation.name || "Civic Ward");
          formData.append("address", newReportData.address || userLocation.name || "Civic Ward");
          formData.append("image", newReportData.imageFile);
          payload = formData;
        } else {
          payload = {
            title: newReportData.title,
            category: newReportData.category,
            description: newReportData.description,
            latitude: Number(newReportData.latitude || userLocation.latitude),
            longitude: Number(newReportData.longitude || userLocation.longitude),
            locationName: newReportData.address || userLocation.name || "Civic Ward",
            address: newReportData.address || userLocation.name || "Civic Ward",
            image: newReportData.image
          };
        }
      }

      const res = await api.createIssue(payload);
      if (res.success && res.issue) {
        const createdIssue = {
          ...res.issue,
          id: res.issue._id || res.issue.id,
          isUserReport: true
        };

        setIssues((prev) => [createdIssue, ...prev]);
        setSupports((prev) => [...prev, createdIssue.id]);

        // Refresh stats and notifications
        fetchDashboardStats();
        fetchUserData();

        return { success: true, issue: createdIssue };
      }
      return { success: false, message: res.message || "Failed to create issue" };
    } catch (err) {
      console.error("Add Report Error:", err.message);
      return { success: false, message: err.message };
    }
  }, [userLocation, fetchDashboardStats, fetchUserData]);

  /**
   * Update issue status (Reported -> Verified -> Assigned -> In Progress -> Resolved)
   */
  const updateIssueStatus = useCallback(async (issueId, status, note = "") => {
    try {
      const res = await api.updateIssue(issueId, { status, note });
      if (res.success && res.issue) {
        const updated = {
          ...res.issue,
          id: res.issue._id || res.issue.id
        };

        setIssues((prev) =>
          prev.map((iss) => (String(iss._id || iss.id) === String(issueId) ? updated : iss))
        );

        fetchDashboardStats();
        fetchUserData();
        return { success: true, issue: updated };
      }
      return { success: false, message: res.message };
    } catch (err) {
      console.error("Update Issue Status Error:", err.message);
      return { success: false, message: err.message };
    }
  }, [fetchDashboardStats, fetchUserData]);

  /**
   * Notification handlers
   */
  const markNotificationRead = useCallback(async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (String(n._id || n.id) === String(id) ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.warn("Mark notification read error:", err.message);
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.warn("Mark all notifications read error:", err.message);
    }
  }, []);

  // Compute issue distance from current location
  const getIssueDistance = useCallback(
    (issue) => {
      if (!userLocation || !issue) return null;
      return computeDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        issue.latitude,
        issue.longitude
      );
    },
    [userLocation]
  );

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <IssueContext.Provider
      value={{
        issues,
        notifications,
        supports,
        dashboardStats,
        isLoadingIssues,
        isLoadingStats,
        userLocation,
        locationStatus,
        locationError,
        requestLocation,
        setManualLocation,
        toggleSupport,
        addReport,
        updateIssueStatus,
        fetchIssues,
        fetchDashboardStats,
        fetchUserData,
        markNotificationRead,
        markAllNotificationsRead,
        getIssueDistance,
        unreadNotificationsCount
      }}
    >
      {children}
    </IssueContext.Provider>
  );
};

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (!context) {
    throw new Error("useIssues must be used within an IssueProvider");
  }
  return context;
};

export default IssueContext;
