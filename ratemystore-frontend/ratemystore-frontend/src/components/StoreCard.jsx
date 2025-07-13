import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StoreCard({ store, onRateClick, onDelete }) {
  return (
    <div
      className="card h-100"
      style={{
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        animation: "slideUp 0.5s ease-in-out",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 30px rgba(0, 0, 0, 0.1)";
      }}
    >
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2
            className="card-title h5 mb-0 text-dark"
            style={{ fontWeight: "400", letterSpacing: "0.5px" }}
          >
            {store.name}
          </h2>
          {onDelete && (
            <button
              onClick={() => onDelete(store.id)}
              className="btn btn-link text-danger p-0"
              style={{ fontSize: "0.9rem", transition: "color 0.3s ease" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#dc3545")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#c82333")}
            >
              Delete
            </button>
          )}
        </div>
        <p className="text-dark mb-2" style={{ fontSize: "0.95rem" }}>
          📍 {store.city} - {store.zip}
        </p>
        <p className="text-dark mb-3" style={{ fontSize: "0.95rem" }}>
          📧 {store.email}
        </p>
        <div>
          <p className="text-dark small mb-1">
            ⭐ Average Rating:{" "}
            {store.average_rating
              ? Number(store.average_rating).toFixed(1)
              : "N/A"}
          </p>
          <p className="text-dark small">
            🙋 Your Rating: {store.user_rating ?? "Not Rated Yet"}
          </p>
        </div>
        {onRateClick && (
          <button
            className="btn w-100 mt-4 text-white"
            style={{
              background: "linear-gradient(90deg, #6c757d, #495057)",
              borderRadius: "10px",
              padding: "10px",
              transition: "all 0.3s ease",
              fontWeight: "500",
            }}
            onClick={() => onRateClick(store)}
            onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
          >
            {store.user_rating ? "Edit Rating" : "Rate Store"}
          </button>
        )}
      </div>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
