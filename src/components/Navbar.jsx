import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Society Manager</h2>
      <ul className="nav-links">
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/visitors">Visitors</Link></li>
            <li><Link to="/parcels">Parcels</Link></li>
            <li><Link to="/parking">Parking</Link></li>
            <li><Link to="/complaints">Complaints</Link></li>
            <li><Link to="/maintenance">Maintenance</Link></li>
            <li><Link to="/notices">Notices</Link></li>
            <li><Link to="/service-providers">Service Providers</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>

      {user && (
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      )}
    </nav>
  );
}

export default Navbar;
