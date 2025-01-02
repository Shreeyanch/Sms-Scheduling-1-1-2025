import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/admin/Dashboard";
import { ToastContainer } from "react-toastify";
import MessageForm from "./pages/MessageForm";
import ScheduledMessage from "./pages/admin/ScheduledMessage";

const App = () => {
  const ProtectedRoute = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");

    // If no user info or token, redirect to login
    if (!userInfo || !token) {
      return <Navigate to="/" replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const token = localStorage.getItem("token");

    // If user info and token exist, redirect to dashboard
    if (userInfo && token) {
      if (userInfo.role == "admin") {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/messageForm" replace />;
      }
    }

    return children;
  };

  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public Route with Protection */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/work"
          element={
            <ProtectedRoute>
              <ScheduledMessage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/messageForm"
          element={
            <ProtectedRoute>
              <MessageForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
