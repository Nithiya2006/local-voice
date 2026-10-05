import { INITIAL_MOCK_ISSUES } from "../data/mockIssues";
import { INITIAL_MOCK_NOTIFICATIONS } from "../data/mockNotifications";

const STORAGE_KEYS = {
  USER: "localvoice_user",
  LOGGED_IN: "localvoice_logged_in",
  REPORTS: "localvoice_reports",
  NOTIFICATIONS: "localvoice_notifications",
  SUPPORTS: "localvoice_supports"
};

export const DEFAULT_USER = {
  id: "usr-demo",
  name: "Alex Morgan",
  email: "alex.morgan@community.org",
  phone: "+1 (555) 019-2834",
  area: "Central Metro Ward 12",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
  joinedDate: "January 2026"
};

// Safe JSON get/set
function getStoredJson(key, defaultValue) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e);
    return defaultValue;
  }
}

function setStoredJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving to localStorage key "${key}":`, e);
  }
}

// Authentication
export const getStoredAuth = () => {
  const loggedIn = localStorage.getItem(STORAGE_KEYS.LOGGED_IN) === "true";
  let user = getStoredJson(STORAGE_KEYS.USER, null);
  if (loggedIn && !user) {
    user = DEFAULT_USER;
    setStoredJson(STORAGE_KEYS.USER, user);
  }
  return { loggedIn, user };
};

export const setStoredAuth = (loggedIn, user = null) => {
  if (loggedIn) {
    localStorage.setItem(STORAGE_KEYS.LOGGED_IN, "true");
    if (user) {
      setStoredJson(STORAGE_KEYS.USER, user);
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    // keep or clear user
  }
};

// Issues / Reports
export const getStoredIssues = () => {
  const issues = getStoredJson(STORAGE_KEYS.REPORTS, null);
  if (!issues || !Array.isArray(issues) || issues.length === 0) {
    setStoredJson(STORAGE_KEYS.REPORTS, INITIAL_MOCK_ISSUES);
    return INITIAL_MOCK_ISSUES;
  }
  return issues;
};

export const saveStoredIssues = (issues) => {
  setStoredJson(STORAGE_KEYS.REPORTS, issues);
};

// Notifications
export const getStoredNotifications = () => {
  const notifs = getStoredJson(STORAGE_KEYS.NOTIFICATIONS, null);
  if (!notifs || !Array.isArray(notifs)) {
    setStoredJson(STORAGE_KEYS.NOTIFICATIONS, INITIAL_MOCK_NOTIFICATIONS);
    return INITIAL_MOCK_NOTIFICATIONS;
  }
  return notifs;
};

export const saveStoredNotifications = (notifs) => {
  setStoredJson(STORAGE_KEYS.NOTIFICATIONS, notifs);
};

// Supports
export const getStoredSupports = () => {
  return getStoredJson(STORAGE_KEYS.SUPPORTS, ["iss-101", "iss-104"]);
};

export const saveStoredSupports = (supports) => {
  setStoredJson(STORAGE_KEYS.SUPPORTS, supports);
};

// Reset demo state if needed
export const resetDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.LOGGED_IN, "true");
  setStoredJson(STORAGE_KEYS.USER, DEFAULT_USER);
  setStoredJson(STORAGE_KEYS.REPORTS, INITIAL_MOCK_ISSUES);
  setStoredJson(STORAGE_KEYS.NOTIFICATIONS, INITIAL_MOCK_NOTIFICATIONS);
  setStoredJson(STORAGE_KEYS.SUPPORTS, ["iss-101", "iss-104"]);
};
