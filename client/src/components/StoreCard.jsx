import React, { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaTimes } from "react-icons/fa";
import StarRating from "./StarRating";

const StoreModal = ({ store, onClose }) => {
  const [rating, setRating] = useState(store.user_rating || 0);

  const handleSubmit = () => {
    // You can connect this to an API call here
    console.log("Rated:", rating);
    onClose(); // Close after submit
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 z-10">
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={onClose}
          >
            <FaTimes size={18} />
          </button>

          {/* Store Image */}
          <img
            src={store.imageUrl || "/store-placeholder.jpg"}
            alt="Store"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />

          {/* Store Details */}
          <h2 className="text-xl font-semibold">{store.store_name}</h2>
          <p className="text-sm text-gray-500 mb-1">{store.owner_name}</p>
          <p className="text-sm text-gray-500 mb-3">{store.address || "N/A"}</p>

          {/* Rating */}
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700">Your Rating</p>
            <StarRating rating={rating} onRate={setRating} />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800"
            onClick={handleSubmit}
          >
            Submit Rating
          </button>
        </div>
      </div>
    </Dialog>
  );
};

export default StoreModal;
