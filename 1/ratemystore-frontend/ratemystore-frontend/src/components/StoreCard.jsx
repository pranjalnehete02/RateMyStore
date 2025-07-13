import React from "react";

export default function StoreCard({ store, onRateClick, onDelete }) {
  return (
    <div className="w-full max-w-md mx-auto my-4 shadow-lg p-4 rounded-xl bg-white">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">{store.name}</h2>
        {onDelete && (
          <button
            onClick={() => onDelete(store.id)}
            className="text-red-600 text-sm hover:underline"
          >
            Delete
          </button>
        )}
      </div>
      <p className="text-gray-600">
        📍 {store.city} - {store.zip}
      </p>
      <p className="text-gray-600">📧 {store.email}</p>

      <div className="mt-2">
        <p className="text-sm text-gray-500">
          ⭐ Average Rating:{" "}
          {store.average_rating
            ? Number(store.average_rating).toFixed(1)
            : "N/A"}
        </p>
        <p className="text-sm text-gray-500">
          🙋 Your Rating: {store.user_rating ?? "Not Rated Yet"}
        </p>
      </div>

      {onRateClick && (
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => onRateClick(store)}
        >
          {store.user_rating ? "Edit Rating" : "Rate Store"}
        </button>
      )}
    </div>
  );
}
