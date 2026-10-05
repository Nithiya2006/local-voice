import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { IssueProvider } from "./context/IssueContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import NearbyIssues from "./pages/NearbyIssues";
import IssueDetails from "./pages/IssueDetails";
import ReportIssue from "./pages/ReportIssue";
import MyReports from "./pages/MyReports";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import About from "./pages/About";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <IssueProvider>
        <BrowserRouter>
          <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Navbar />
            <main style={{ flex: "1 0 auto" }}>
              <Routes>
                {/* Public Auth Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />

                {/* Protected Community Routes */}
                <Route
                  path="/home"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues"
                  element={
                    <ProtectedRoute>
                      <NearbyIssues />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/issues/:id"
                  element={
                    <ProtectedRoute>
                      <IssueDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <ReportIssue />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-reports"
                  element={
                    <ProtectedRoute>
                      <MyReports />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/notifications"
                  element={
                    <ProtectedRoute>
                      <Notifications />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </IssueProvider>
    </AuthProvider>
  );
}

export default App;
