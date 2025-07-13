// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "@/services/api";
import StoreCard from "@/components/StoreCard";

const UserDashboard = () => {
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    try {
      const res = await api.get("/stores");
      setStores(res.data); // make sure your backend returns an array
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="px-4 py-6 md:px-12">
      <h1 className="text-3xl font-bold mb-6">Store Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} refreshStores={fetchStores} />
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
