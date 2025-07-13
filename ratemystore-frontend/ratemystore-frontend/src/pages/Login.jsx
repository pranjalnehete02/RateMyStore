import { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
          window.location.href = "/owner-dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1500);
    } catch (err) {
      alert("❌ " + (err.response?.data?.message || "Login failed"));
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
      }}
    >
      <div
        className="card p-4"
        style={{
          maxWidth: "400px",
          width: "100%",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(5px)",
          WebkitBackdropFilter: "blur(5px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h2
          className="mb-4 text-center text-dark"
          style={{ fontWeight: "300", letterSpacing: "1px" }}
        >
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              onChange={handleChange}
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
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              onChange={handleChange}
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
            Login
          </button>
        </form>
        <p className="text-center mt-3 text-dark">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-decoration-none"
            style={{
              color: "#6c757d",
              fontWeight: "500",
              transition: "color 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.color = "#343a40")}
            onMouseOut={(e) => (e.target.style.color = "#6c757d")}
          >
            Register here
          </a>
        </p>
      </div>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .card:hover {
            transform: translateY(-5px);
            transition: transform 0.3s ease;
          }
          .form-control:focus {
            box-shadow: 0 0 5px rgba(108, 117, 125, 0.5);
          }
        `}
      </style>
    </div>
  );
}
