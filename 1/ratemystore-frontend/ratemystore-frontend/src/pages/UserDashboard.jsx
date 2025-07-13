import { useState } from "react";
import StoreCard from "../components/StoreCard";
import RateModal from "../components/RateModal";

export default function UserDashboard() {
  // ✅ Hardcoded store data
  const [stores, setStores] = useState([
    {
      id: 1,
      name: "D-Mart",
      email: "dmart@example.com",
      city: "Pune",
      zip: "411001",
      average_rating: 4.2,
      user_rating: 5,
    },
    {
      id: 2,
      name: "Reliance Mart",
      email: "reliance@example.com",
      city: "Mumbai",
      zip: "400001",
      average_rating: 3.8,
      user_rating: null,
    },
    {
      id: 3,
      name: "Tech World",
      email: "tech@store.com",
      city: "Bangalore",
      zip: "560001",
      average_rating: 4.7,
      user_rating: 4,
    },
    {
      id: 4,
      name: "Fresh Mart",
      email: "fresh@store.com",
      city: "Hyderabad",
      zip: "500001",
      average_rating: 4.1,
      user_rating: null,
    },
  ]);

  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRateClick = (store) => {
    setSelectedStore(store);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedStore(null);
  };

  const handleModalSubmit = () => {
    // You can update the state here in the future when connecting to API
    handleModalClose();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Welcome! Rate the Stores Below</h2>

      {stores.length === 0 ? (
        <p>No stores available for rating.</p>
      ) : (
        <div className="row">
          {stores.map((store) => (
            <div className="col-md-4 mb-3" key={store.id}>
              <StoreCard store={store} onRate={handleRateClick} />
            </div>
          ))}
        </div>
      )}

      {/* Rating Modal */}
      <RateModal
        show={showModal}
        store={selectedStore}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
