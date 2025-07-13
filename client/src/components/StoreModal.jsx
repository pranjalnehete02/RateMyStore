// src/components/StoreModal.jsx
import React, { useState } from "react";
import StarRating from "./StarRating";

const StoreModal = ({ store, onClose }) => {
  if (!store) return null;

  const {
    store_name,
    owner_name,
    email,
    address,
    rating,
    userRating,
    imageUrl,
    id,
  } = store;

  const [selectedRating, setSelectedRating] = useState(userRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRating = async () => {
    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`http://localhost:3000/api/stores/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: selectedRating }),
      });

      const data = await res.json();
      console.log("Submitted rating:", data);
      onClose();
    } catch (err) {
      console.error("Error submitting rating", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-red-500 font-semibold"
        >
          close
        </button>

        {/* Store Image */}
        <img
          src={imageUrl || "https://placehold.co/600x200"}
          alt="store"
          className="rounded-md mb-4 object-cover w-full h-48"
        />

        <h2 className="text-xl font-bold mb-1">{store_name}</h2>
        <p className="text-sm text-gray-500 mb-4">{owner_name}</p>

        <div className="mb-2">
          <p className="font-semibold">Contact info</p>
          <p className="text-sm">
            Email: <span className="text-gray-700">{email}</span>
          </p>
          <p className="text-sm">
            Address: <span className="text-gray-700">{address}</span>
          </p>
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Overall Rating</p>
          <StarRating rating={rating} readOnly />
        </div>

        <div className="mt-4">
          <p className="font-semibold mb-1">Your Rating</p>
          <StarRating
            rating={selectedRating}
            onRate={setSelectedRating}
            readOnly={false}
          />
        </div>

        <div className="mt-4 text-right space-x-2">
          <button
            className="bg-gray-300 px-4 py-1 text-sm rounded-full hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-1 text-sm rounded-full hover:bg-blue-700"
            onClick={handleSubmitRating}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreModal;
