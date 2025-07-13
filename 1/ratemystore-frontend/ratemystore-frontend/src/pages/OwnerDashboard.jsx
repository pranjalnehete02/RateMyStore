// src/pages/OwnerDashboard.jsx

import { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard";
import AddStoreForm from "../components/AddStoreForm";

export default function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stores/owner", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data); // ✅ update UI
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  const handleDelete = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStores(); // Refresh list
    } catch (err) {
      console.error("Error deleting store:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Stores</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add Store
        </button>
      </div>

      {showForm && (
        <AddStoreForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchStores}
        />
      )}

      {loading ? (
        <p>Loading your stores...</p>
      ) : stores.length === 0 ? (
        <p className="text-gray-600">No stores found. Please add one!</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
