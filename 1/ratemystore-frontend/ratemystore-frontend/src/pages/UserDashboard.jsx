import { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStores(response.data);
    } catch (error) {
      console.error("Error fetching stores:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Stores</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading stores...</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              onRatingUpdate={fetchStores} // To refresh after rating
            />
          ))}
        </div>
      )}
    </div>
  );
}
