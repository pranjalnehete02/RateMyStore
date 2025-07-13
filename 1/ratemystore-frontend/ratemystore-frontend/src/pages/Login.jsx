import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user.id);

      alert(
        `✅ Login Successful as ${user.role.toUpperCase()}! Redirecting...`
      );

      setTimeout(() => {
        if (user.role === "normal_user") {
          window.location.href = "/user-dashboard";
        } else if (user.role === "store_owner") {
          window.location.href = "/store-dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1500);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-3 text-center">Login</h2>
      <form onSubmit={handleSubmit}>
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
          className="form-control mb-3"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don’t have an account?{" "}
        <a href="/register" className="text-decoration-underline text-primary">
          Register here
        </a>
      </p>
    </div>
  );
}
