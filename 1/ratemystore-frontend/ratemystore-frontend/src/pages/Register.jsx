import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "normal_user",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("✅ Registered Successfully! Redirecting to Login...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Registration failed"));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-3 text-center">Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={handleChange}
          required
        />
        <select
          name="role"
          className="form-control mb-3"
          onChange={handleChange}
          required
        >
          <option value="normal_user">Normal User</option>
          <option value="store_owner">Store Owner</option>
        </select>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account?{" "}
        <a href="/" className="text-decoration-underline text-success">
          Login here
        </a>
      </p>
    </div>
  );
}
