import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Visitor from "./pages/Visitors.jsx";
import Complaints from "./pages/Complaints.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import Notices from "./pages/Notices.jsx";
import Parcels from "./pages/Parcels.jsx";
import Parking from "./pages/Parking.jsx";
import ServiceProviders from "./pages/ServiceProviders.jsx";

// Optional: 404 page
const NotFound = () => (
  <h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>
);

function App() {
  // Read user dynamically from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/visitors" element={<ProtectedRoute><Visitor /></ProtectedRoute>} />
        <Route
          path="/complaints"
          element={<ProtectedRoute><Complaints isAdmin={isAdmin} /></ProtectedRoute>}
        />
        <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        <Route path="/notices" element={<ProtectedRoute><Notices /></ProtectedRoute>} />
        <Route path="/parcels" element={<ProtectedRoute><Parcels /></ProtectedRoute>} />
        <Route path="/parking" element={<ProtectedRoute><Parking /></ProtectedRoute>} />
        <Route
          path="/service-providers"
          element={<ProtectedRoute><ServiceProviders /></ProtectedRoute>}
        />

        {/* Wildcard route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
