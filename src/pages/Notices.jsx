import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Notices.css";

function Notices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await API.get("/notices"); // GET all notices
      setNotices(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <div className="notices-page">
      <h3>Society Notices</h3>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="notice-list">
        {notices.map((notice) => (
          <li key={notice._id} className="notice-card">
            <div className="notice-title">{notice.title}</div>
            <div className="notice-description">{notice.description}</div>
            <div className="notice-date">Posted on: {new Date(notice.createdAt).toLocaleDateString()}</div>
          </li>
        ))}
      </ul>

      {notices.length === 0 && !loading && <p className="info">No notices available.</p>}
    </div>
  );
}

export default Notices;
