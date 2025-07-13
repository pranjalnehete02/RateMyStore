import { useState } from "react";
import RateModal from "./RateModal";

export default function StoreCard({ store, onRatingUpdate }) {
  const [showModal, setShowModal] = useState(false);

  const handleRateClick = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <div className="bg-white rounded-2xl shadow p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2">{store.name}</h2>
        <p className="text-gray-700 text-sm">Email: {store.email}</p>
        <p className="text-gray-700 text-sm">City: {store.city}</p>
        <p className="text-gray-700 text-sm">ZIP: {store.zip}</p>
        <p className="text-gray-700 text-sm mt-2">
          Average Rating:{" "}
          <span className="font-medium">
            {store.average_rating ?? "Not rated yet"}
          </span>
        </p>
        <p className="text-gray-700 text-sm">
          Your Rating:{" "}
          <span className="font-medium">
            {store.user_rating ?? "You haven't rated yet"}
          </span>
        </p>
      </div>
      <button
        onClick={handleRateClick}
        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl text-sm"
      >
        Rate this Store
      </button>

      {/* Rating Modal */}
      {showModal && (
        <RateModal
          show={showModal}
          onClose={handleModalClose}
          store={store}
          onSubmit={onRatingUpdate}
        />
      )}
    </div>
  );
}
