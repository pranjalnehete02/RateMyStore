import { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard";
import RateModal from "../components/RateModal";
import "bootstrap/dist/css/bootstrap.min.css";

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
      fetchStores();
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div
      className="min-vh-100 bg-light p-4 p-md-5"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        animation: "fadeIn 1s ease-in-out",
      }}
    >
      <div className="container">
        <h1
          className="text-center text-dark mb-5"
          style={{
            fontWeight: "300",
            letterSpacing: "1px",
            fontSize: "2.5rem",
          }}
        >
          Discover Stores
        </h1>

        {loading ? (
          <div className="text-center">
            <div
              className="spinner-border text-secondary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-dark mt-3">Fetching stores...</p>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4">
            {stores.map((store) => (
              <div key={store.id} className="col">
                <StoreCard
                  store={store}
                  onRateClick={(store) => {
                    setSelectedStore(store);
                    setShowModal(true);
                  }}
                />
              </div>
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
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
