import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

export default function RateModal({ show, onClose, store, onSubmit }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (store?.user_rating) {
      setRating(store.user_rating);
    } else {
      setRating(0);
    }
  }, [store]);

  if (!show || !store) return null;

  const handleRatingSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/ratings/${store.id}`,
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ Rating submitted successfully!");
      onSubmit(store.id, rating);
    } catch (err) {
      console.error("Rating error:", err.response?.data?.message);
      alert("❌ " + (err.response?.data?.message || "Rating failed"));
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : "d-none"}`}
      tabIndex="-1"
      role="dialog"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        animation: show ? "fadeIn 0.5s ease-in-out" : "none",
      }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div
          className="modal-content"
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "16px",
            boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(5px)",
            WebkitBackdropFilter: "blur(5px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            animation: show ? "slideUp 0.5s ease-in-out" : "none",
          }}
        >
          <div className="modal-header border-0">
            <h5
              className="modal-title text-dark"
              style={{ fontWeight: "400", letterSpacing: "0.5px" }}
            >
              Rate {store.store_name}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="d-flex justify-content-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  style={{
                    fontSize: "2rem",
                    cursor: "pointer",
                    color: num <= rating ? "#ffc107" : "#6c757d",
                    transition: "color 0.3s ease, transform 0.2s ease",
                  }}
                  onClick={() => setRating(num)}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.transform = "scale(1.2)")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          <div className="modal-footer border-0">
            <button
              className="btn btn-outline-secondary"
              onClick={onClose}
              style={{ borderRadius: "10px", transition: "all 0.3s ease" }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Cancel
            </button>
            <button
              className="btn text-white"
              onClick={handleRatingSubmit}
              style={{
                background: "linear-gradient(90deg, #6c757d, #495057)",
                borderRadius: "10px",
                transition: "all 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
}
