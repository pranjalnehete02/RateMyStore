import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/stores/add",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("✅ Store added:", res.data);
      onSuccess();
    } catch (err) {
      console.error("❌ Error adding store:", err);
    }
  };

  return (
    <form
      className="card p-4"
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "16px",
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(5px)",
        WebkitBackdropFilter: "blur(5px)",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        animation: "slideUp 0.5s ease-in-out",
      }}
    >
      <h2
        className="text-center text-dark mb-4"
        style={{ fontWeight: "400", letterSpacing: "0.5px" }}
      >
        Add New Store
      </h2>
      <div className="mb-3">
        <input
          type="text"
          name="name"
          placeholder="Store Name"
          value={formData.name}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            padding: "12px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6c757d")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255, 255, 255, 0.3)")
          }
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          name="email"
          placeholder="Store Email"
          value={formData.email}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            padding: "12px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6c757d")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255, 255, 255, 0.3)")
          }
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            padding: "12px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#6c757d")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255, 255, 255, 0.3)")
          }
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          name="zip"
          placeholder="Zip Code"
          value={formData.zip}
          onChange={handleChange}
          className="form-control"
          required
          style={{
            borderRadius: "10px",
            padding: "12px",
            transition: "all 0.3s ease",
            background: "rgba(255, 255, 255, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          }}
          onFocus={(e) => (e.target.style.borderColor = "# Volt... 6c757d")}
          onBlur={(e) =>
            (e.target.style.borderColor = "rgba(255, 255, 255, 0.3)")
          }
        />
      </div>
      <button
        type="submit"
        className="btn w-100 text-white"
        style={{
          background: "linear-gradient(90deg, #6c757d, #495057)",
          borderRadius: "10px",
          padding: "12px",
          transition: "all 0.3s ease",
          fontWeight: "500",
        }}
        onMouseOver={(e) => (e.target.style.opacity = "0.9")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Add Store
      </button>
      <style>
        {`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .form-control:focus {
            box-shadow: 0 0 5px rgba(108, 117, 125, 0.5);
          }
        `}
      </style>
    </form>
  );
}
