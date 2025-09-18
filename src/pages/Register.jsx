import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "",
    flatNumber: "",
    vehicleNo: ""
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="contact"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="">Select Role</option>
            <option value="resident">Resident</option>
            <option value="guard">Guard</option>
            <option value="admin">Admin</option>
          </select>

          {/* Only show flatNumber and vehicleNo for residents */}
          {formData.role === "resident" && (
            <>
              <input
                type="text"
                name="flatNumber"
                placeholder="Flat Number"
                value={formData.flatNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="vehicleNo"
                placeholder="Vehicle Number (optional)"
                value={formData.vehicleNo}
                onChange={handleChange}
              />
            </>
          )}

          <button type="submit">Register</button>
        </form>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}

export default Register;
