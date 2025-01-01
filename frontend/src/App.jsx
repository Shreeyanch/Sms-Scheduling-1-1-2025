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
import { ToastContainer, toast } from "react-toastify";
import MessageForm from "./pages/MessageForm";

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
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/messageForm"
          element={
            <ProtectedRoute>
              <>
                <MessageForm />
              </>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
