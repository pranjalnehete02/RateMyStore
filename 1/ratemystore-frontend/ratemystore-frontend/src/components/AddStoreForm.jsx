// src/components/AddStoreForm.jsx
import { useState } from "react";
import axios from "axios";

export default function AddStoreForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    zip: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    console.log("Submitting with token:", token);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stores/add",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Store added:", res.data);

      // ✅ Trigger success callback to reload stores
      if (onSuccess) onSuccess();

      // ✅ Clear form
      setFormData({ name: "", email: "", city: "", zip: "" });
    } catch (err) {
      console.error("Error adding store:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md space-y-4"
    >
      <h2 className="text-xl font-semibold">Add New Store</h2>

      <input
        type="text"
        name="name"
        placeholder="Store Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Store Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />
      <input
        type="text"
        name="zip"
        placeholder="Zip Code"
        value={formData.zip}
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add Store
      </button>
    </form>
  );
}
