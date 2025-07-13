import { useState, useEffect } from "react";
import axios from "axios";

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
        `http://localhost:5000/api/ratings/${store.id}`, // ✅ correct endpoint
        { rating },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Rating submitted successfully!");
      onSubmit(); // Refresh store list
    } catch (err) {
      console.error("Rating error:", err.response?.data?.message);
      alert("❌ " + (err.response?.data?.message || "Rating failed"));
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Rate {store.store_name}</h5>
            <button type="button" className="close" onClick={onClose}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body text-center">
            {[1, 2, 3, 4, 5].map((num) => (
              <span
                key={num}
                style={{
                  fontSize: "2rem",
                  cursor: "pointer",
                  color: num <= rating ? "#f1c40f" : "#ccc",
                }}
                onClick={() => setRating(num)}
              >
                ★
              </span>
            ))}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRatingSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
