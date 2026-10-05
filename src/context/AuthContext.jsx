import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize auth state from stored JWT token
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("localvoice_token");
      if (!token) {
        setIsLoggedIn(false);
        setUser(null);
        setIsInitializing(false);
        return;
      }

      try {
        const data = await api.getCurrentUser();
        if (data.success && data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("localvoice_token");
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (err) {
        console.warn("Auth initialization error:", err.message);
        // If token is invalid/expired
        localStorage.removeItem("localvoice_token");
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, []);

  // Real backend Login
  const login = async (email, password, rememberMe = true) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.token) {
        localStorage.setItem("localvoice_token", res.token);
        setUser(res.user);
        setIsLoggedIn(true);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || "Login failed" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Real backend Register
  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success && res.token) {
        localStorage.setItem("localvoice_token", res.token);
        setUser(res.user);
        setIsLoggedIn(true);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message || "Registration failed" };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("localvoice_token");
    setUser(null);
    setIsLoggedIn(false);
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const res = await api.updateUserProfile(profileData);
      if (res.success && res.user) {
        setUser(res.user);
        return { success: true, user: res.user };
      }
      return { success: false, message: res.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isInitializing,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
