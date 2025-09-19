import React, { useState, useEffect, useRef } from "react";
import API from "../services/api";
import QRCode from "react-qr-code";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./Visitor.css";

function Visitor() {
  const [visitorForm, setVisitorForm] = useState({
    name: "",
    contact: "",
    purpose: "",
    vehicleNo: "",
    validTill: "",
  });
  const [qrToken, setQrToken] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [pendingVisitors, setPendingVisitors] = useState([]);
  const [allVisitors, setAllVisitors] = useState([]);
  const [showQrForm, setShowQrForm] = useState(false);

  const qrRef = useRef();
  const scannerRef = useRef(null);

  const role = localStorage.getItem("role");

  //Resident: Create Visitor
  const handleVisitorChange = (e) =>
    setVisitorForm({ ...visitorForm, [e.target.name]: e.target.value });

  const handleCreateVisitor = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/visitor/create", visitorForm);
      setQrToken(res.data.qrCode);
      setVisitorForm({
        name: "",
        contact: "",
        purpose: "",
        vehicleNo: "",
        validTill: "",
      });
      alert("Visitor created! QR generated below.");
    } catch (err) {
      console.error("Visitor creation error:", err.response?.data);
      alert(err.response?.data?.message || "Failed to create visitor");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "visitor_qr.png";
    link.click();
  };

  //  Guard: Scan & Verify
  useEffect(() => {
    if (role !== "guard" || scannerRef.current) return;

    const config = { fps: 10, qrbox: 250 };
    scannerRef.current = new Html5QrcodeScanner("qr-reader", config, false);
    scannerRef.current.render(
      async (decodedText) => {
        try {
          await API.post("/visitors/verify", { qrCode: decodedText });
          setScanMessage("Visitor verified and checked-in!");
          fetchPendingVisitors();
        } catch (err) {
          setScanMessage(
            err.response?.data?.message || "Invalid or expired QR code"
          );
        }
      },
      () => {}
    );
  }, [role]);

  const fetchPendingVisitors = async () => {
    try {
      const res = await API.get("/visitors/pending");
      setPendingVisitors(res.data);
    } catch (err) {
      console.log("Failed to fetch pending visitors");
    }
  };

  // Admin: Fetch All Visitors 
  const fetchAllVisitors = async () => {
    try {
      const res = await API.get("/visitors/all"); // backend route for admins
      setAllVisitors(res.data);
    } catch (err) {
      console.log("Failed to fetch visitors");
    }
  };

  useEffect(() => {
    if (role === "guard") fetchPendingVisitors();
    if (role === "admin") fetchAllVisitors();
  }, [role]);

  return (
    <div className="visitor-page">
      <h2>Visitor Management</h2>

      {/* Resident View */}
      {role === "resident" && (
        <div className="section">
          <h3>Resident: Create Visitor</h3>
          <button
            className="action-btn"
            onClick={() => setShowQrForm(!showQrForm)}
          >
            {showQrForm ? "Cancel" : "Create Visitor / Generate QR"}
          </button>

          {showQrForm && (
            <form className="visitor-form" onSubmit={handleCreateVisitor}>
              <input
                name="name"
                placeholder="Visitor Name"
                value={visitorForm.name}
                onChange={handleVisitorChange}
                required
              />
              <input
                name="contact"
                placeholder="Contact Number"
                value={visitorForm.contact}
                onChange={handleVisitorChange}
                required
              />
              <input
                name="purpose"
                placeholder="Purpose"
                value={visitorForm.purpose}
                onChange={handleVisitorChange}
              />
              <input
                name="vehicleNo"
                placeholder="Vehicle Number"
                value={visitorForm.vehicleNo}
                onChange={handleVisitorChange}
              />
              <input
                type="date"
                name="validTill"
                value={visitorForm.validTill}
                onChange={handleVisitorChange}
              />
              <button type="submit">Generate QR</button>
            </form>
          )}

          {qrToken && (
            <div className="qr-container" ref={qrRef}>
              <QRCode value={qrToken} size={200} />
              <p>Share this QR with your visitor</p>
              <button className="action-btn" onClick={handleDownloadQR}>
                Download QR
              </button>
            </div>
          )}
        </div>
      )}

      {/* Guard View */}
      {role === "guard" && (
        <>
          <div className="section">
            <h3>Guard: Scan Visitor QR</h3>
            <div id="qr-reader" style={{ width: "300px", margin: "auto" }}></div>
            {scanMessage && <p className="info">{scanMessage}</p>}
          </div>

          <div className="section">
            <h3>Guard: Pending Visitors</h3>
            <button className="action-btn" onClick={fetchPendingVisitors}>
              Refresh List
            </button>
            {pendingVisitors.length === 0 ? (
              <p className="info">No pending visitors</p>
            ) : (
              <ul className="visitor-list">
                {pendingVisitors.map((v) => (
                  <li key={v._id} className="visitor-card">
                    <div>
                      <strong>Name:</strong> {v.name}
                    </div>
                    <div>
                      <strong>Flat:</strong> {v.flatNo}
                    </div>
                    <div>
                      <strong>Contact:</strong> {v.contact}
                    </div>
                    <div>
                      <strong>Purpose:</strong> {v.purpose}
                    </div>
                    <div>
                      <strong>Status:</strong>{" "}
                      <span className={v.status}>{v.status}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {/* Admin View */}
      {role === "admin" && (
        <div className="section">
          <h3>Admin: All Visitors by Flat</h3>
          <button className="action-btn" onClick={fetchAllVisitors}>
            Refresh List
          </button>
          {allVisitors.length === 0 ? (
            <p className="info">No visitors found</p>
          ) : (
            <ul className="visitor-list">
              {allVisitors.map((v) => (
                <li key={v._id} className="visitor-card">
                  <div>
                    <strong>Name:</strong> {v.name}
                  </div>
                  <div>
                    <strong>Flat:</strong> {v.flatNo}
                  </div>
                  <div>
                    <strong>Resident:</strong> {v.residentName}
                  </div>
                  <div>
                    <strong>Contact:</strong> {v.contact}
                  </div>
                  <div>
                    <strong>Status:</strong>{" "}
                    <span className={v.status}>{v.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Visitor;
