import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Parcels.css";

function Parcels() {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchParcels = async () => {
    setLoading(true);
    try {
      const res = await API.get("/parcels/my"); // Fetch parcels for logged-in resident
      setParcels(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch parcels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels();
  }, []);

  // Mark parcel as collected
  const handleCollect = async (parcelId) => {
    try {
      await API.put(`/parcels/${parcelId}/collect`);
      fetchParcels(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to mark as collected");
    }
  };

  return (
    <div className="parcels-page">
      <h3>My Parcels</h3>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="parcel-list">
        {parcels.map((parcel) => (
          <li key={parcel._id} className="parcel-card">
            <div><strong>Sender:</strong> {parcel.sender}</div>
            <div><strong>Description:</strong> {parcel.description}</div>
            <div><strong>Status:</strong> <span className={parcel.status}>{parcel.status}</span></div>
            <div><strong>Received On:</strong> {new Date(parcel.receivedAt).toLocaleDateString()}</div>
            {parcel.status === "uncollected" && (
              <button className="collect-btn" onClick={() => handleCollect(parcel._id)}>
                Mark as Collected
              </button>
            )}
          </li>
        ))}
      </ul>

      {parcels.length === 0 && !loading && <p className="info">No parcels found.</p>}
    </div>
  );
}

export default Parcels;
