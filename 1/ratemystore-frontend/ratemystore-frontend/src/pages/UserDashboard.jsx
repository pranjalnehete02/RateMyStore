import { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard";
import RateModal from "../components/RateModal";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId, rating) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/ratings/submit",
        { store_id: storeId, rating },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchStores(); // Refresh
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Stores</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRateClick={(store) => {
                setSelectedStore(store);
                setShowModal(true);
              }}
            />
          ))}
        </div>
      )}

      {showModal && selectedStore && (
        <RateModal
          show={showModal}
          onClose={() => setShowModal(false)}
          store={selectedStore}
          onSubmit={handleRatingSubmit}
        />
      )}
    </div>
  );
}
