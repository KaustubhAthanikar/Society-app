import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Complaint.css";

function Complaints({ isAdmin }) {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });

  // Fetch complaints based on role
  const fetchComplaints = async () => {
    try {
      const endpoint = isAdmin ? "/complaints/all" : "/complaints/my";
      const res = await API.get(endpoint);
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [isAdmin]);

  // Resident form handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      try {
        await API.post("/complaints", form);
        setForm({ title: "", description: "" });
        fetchComplaints();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Admin status update
  const updateStatus = async (id, status) => {
    if (!isAdmin) return;
    try {
      await API.put(`/complaints/${id}/status`, { status });
      fetchComplaints();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h3>{isAdmin ? "All Complaints (Admin)" : "My Complaints"}</h3>

      {/* Only show form for residents */}
      {!isAdmin && (
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
          />
          <button type="submit">Submit Complaint</button>
        </form>
      )}

      {/* Admin table */}
      {isAdmin && (
        <table>
          <thead>
            <tr>
              <th>Resident</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>{c.user?.name} ({c.user?.flatNumber})</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>
                  <select value={c.status} onChange={(e) => updateStatus(c._id, e.target.value)}>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Resident list */}
      {!isAdmin && (
        <ul>
          {complaints.map((c) => (
            <li key={c._id}>
              <strong>{c.title}</strong> - {c.status}
              <p>{c.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Complaints;
