import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./Maintenance.css";

function Maintenance({ user }) {
  // user.role should be "admin" or "resident"
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchBills = async () => {
    setLoading(true);
    try {
      const res = user.role === "admin"
        ? await API.get("/maintenance")       // admin fetches all bills
        : await API.get("/maintenance/my");  // resident fetches own bills
      setBills(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  // Admin: handle update of a bill
  const handleUpdate = async (billId, field, value) => {
    try {
      await API.put(`/maintenance/${billId}`, { [field]: value });
      fetchBills();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="maintenance-page">
      <h3>Maintenance Bills</h3>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="bill-list">
        {bills.map((bill) => (
          <li key={bill._id} className={`bill-card ${bill.status}`}>
            <div>
              <strong>Resident:</strong>{" "}
              {bill.residentId?.name || "N/A"} ({bill.residentId?.flatNumber || ""})
            </div>
            <div>
              <strong>Month:</strong>{" "}
              {user.role === "admin" ? (
                <input
                  type="text"
                  value={bill.month}
                  onChange={(e) => handleUpdate(bill._id, "month", e.target.value)}
                />
              ) : (
                bill.month
              )}
            </div>
            <div>
              <strong>Amount:</strong>{" "}
              {user.role === "admin" ? (
                <input
                  type="number"
                  value={bill.amount}
                  onChange={(e) => handleUpdate(bill._id, "amount", e.target.value)}
                />
              ) : (
                `₹${bill.amount}`
              )}
            </div>
            <div>
              <strong>Status:</strong>{" "}
              {user.role === "admin" ? (
                <select
                  value={bill.status}
                  onChange={(e) => handleUpdate(bill._id, "status", e.target.value)}
                >
                  <option value="unpaid">unpaid</option>
                  <option value="paid">paid</option>
                </select>
              ) : (
                <span className={bill.status}>{bill.status}</span>
              )}
            </div>
            <div>
              <strong>Due Date:</strong>{" "}
              {user.role === "admin" ? (
                <input
                  type="date"
                  value={bill.dueDate?.split("T")[0] || ""}
                  onChange={(e) => handleUpdate(bill._id, "dueDate", e.target.value)}
                />
              ) : (
                new Date(bill.dueDate).toLocaleDateString()
              )}
            </div>
          </li>
        ))}
      </ul>

      {bills.length === 0 && !loading && <p className="info">No maintenance bills found.</p>}
    </div>
  );
}

export default Maintenance;
