import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")); // get logged-in user info

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user?.name || "Resident"} </h1>
      <p>Select an option below:</p>

      <div className="dashboard-grid">
        <Link to="/visitors" className="dashboard-card">Visitors</Link>
        <Link to="/parcels" className="dashboard-card">Parcels</Link>
        <Link to="/parking" className="dashboard-card">Parking</Link>
        <Link to="/complaints" className="dashboard-card">Complaints</Link>
        <Link to="/maintenance" className="dashboard-card">Maintenance</Link>
        <Link to="/notices" className="dashboard-card">Notices</Link>
        <Link to="/service-providers" className="dashboard-card">Service Providers</Link>
      </div>
    </div>
  );
}

export default Dashboard;
