import React from "react";
import RateModal from "../components/RateModal";

export default function StoreCard({ store, onRate }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{store.name}</h5>
        <p className="card-text">
          <strong>Email:</strong> {store.email} <br />
          <strong>City:</strong> {store.city}, <strong>ZIP:</strong> {store.zip}{" "}
          <br />
          <strong>Average Rating:</strong>{" "}
          {store.average_rating || "Not rated yet"} <br />
          {store.user_rating && (
            <>
              <strong>Your Rating:</strong> {store.user_rating} <br />
            </>
          )}
        </p>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={() => onRate(store)}
        >
          Rate Store
        </button>
      </div>
    </div>
  );
}
