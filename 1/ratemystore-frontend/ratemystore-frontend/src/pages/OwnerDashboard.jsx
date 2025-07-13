import { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard";
import AddStoreForm from "../components/AddStoreForm";

function OwnerDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch stores created by the owner
  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stores/owner", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(res.data);
    } catch (err) {
      console.error("Error fetching owner stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleStoreAdded = () => {
    setShowForm(false);
    fetchStores(); // 🔁 Refresh the list
  };

  const handleDelete = async (storeId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/stores/${storeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchStores(); // refresh list
    } catch (err) {
      console.error("Delete store error:", err);
      alert("Error deleting store");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Stores</h1>

      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        ➕ Add New Store
      </button>

      {/* 🧾 Show Form Modal */}
      {showForm && (
        <AddStoreForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchStores}
        />
      )}

      {/* ⏳ Loading or No Stores Fallback */}
      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p className="text-gray-500">You haven’t added any stores yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
