import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Parking.css";

function Parking() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const res = await API.get("/parking/my"); // fetch resident's parking slots
      setSlots(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch parking slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  // Optionally toggle occupancy
  const toggleOccupancy = async (slotId) => {
    try {
      await API.put(`/parking/${slotId}/toggle`);
      fetchSlots(); // refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update slot");
    }
  };

  return (
    <div className="parking-page">
      <h3>My Parking Slots</h3>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="parking-list">
        {slots.map((slot) => (
          <li key={slot._id} className="parking-card">
            <div><strong>Slot Number:</strong> {slot.slotNumber}</div>
            <div><strong>Status:</strong> <span className={slot.status}>{slot.status}</span></div>
            {slot.status === "free" && (
              <button className="toggle-btn" onClick={() => toggleOccupancy(slot._id)}>
                Mark as Occupied
              </button>
            )}
            {slot.status === "occupied" && (
              <button className="toggle-btn" onClick={() => toggleOccupancy(slot._id)}>
                Mark as Free
              </button>
            )}
          </li>
        ))}
      </ul>

      {slots.length === 0 && !loading && <p className="info">No parking slots assigned.</p>}
    </div>
  );
}

export default Parking;
