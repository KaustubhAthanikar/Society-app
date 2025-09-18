import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ServiceProviders.css";

function ServiceProviders() {
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const res = await API.get("/service-providers"); // fetch all providers
      setProviders(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch service providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="providers-page">
      <h3>Service Providers</h3>

      {loading && <p className="info">Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="provider-list">
        {providers.map((provider) => (
          <li key={provider._id} className="provider-card">
            <div className="provider-name">{provider.name}</div>
            <div className="provider-type"><strong>Type:</strong> {provider.type}</div>
            <div className="provider-contact"><strong>Contact:</strong> {provider.contact}</div>
            {provider.website && (
              <div className="provider-website">
                <strong>Website:</strong> <a href={provider.website} target="_blank" rel="noopener noreferrer">{provider.website}</a>
              </div>
            )}
          </li>
        ))}
      </ul>

      {providers.length === 0 && !loading && <p className="info">No service providers available.</p>}
    </div>
  );
}

export default ServiceProviders;
