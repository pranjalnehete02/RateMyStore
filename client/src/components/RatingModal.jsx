// src/components/RatingModal.jsx
import React from "react";
import { Dialog } from "@headlessui/react";
import StarRating from "./StarRating";

const RatingModal = ({ isOpen, onClose, onSubmit, storeName }) => {
  const [rating, setRating] = React.useState(0);

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed z-50 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md relative z-50">
          <Dialog.Title className="text-xl font-semibold mb-4 text-center">
            Rate {storeName}
          </Dialog.Title>

          <div className="flex justify-center mb-4">
            <StarRating rating={rating} onRate={setRating} />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default RatingModal;
