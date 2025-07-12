import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await api.post("/auth/login", values);

        const { token, user } = res.data;
        const { role, email } = user;

        if (!token || !role || !email) {
          setErrors({ password: "Invalid response from server" });
          return;
        }

        login({ token, role, email });

        const redirectMap = {
          admin: "/admin",
          user: "/user",
          store_owner: "/owner",
        };

        if (redirectMap[role]) {
          navigate(redirectMap[role]);
        } else {
          console.warn("Unknown role:", role);
          navigate("/");
        }
      } catch (err) {
        setErrors({ password: "Invalid email or password" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="login-container">
      <style jsx>{`
        .login-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e, #16213e);
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.05" d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,96C672,96,768,128,864,149.3C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
          background-size: cover;
          background-position: center;
          opacity: 0.4;
        }

        .glass-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 30px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease;
        }

        .glass-container:hover {
          transform: translateY(-5px);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 12px 15px;
          border-radius: 8px;
          color: white;
          outline: none;
          transition: all 0.3s ease;
        }

        input:focus {
          border-color: rgba(96, 165, 250, 0.5);
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
        }

        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .error {
          color: #ef4444;
          font-size: 14px;
          margin-top: 5px;
        }

        button {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          border: none;
          padding: 12px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        button:hover {
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        button:disabled {
          background: linear-gradient(90deg, #6b7280, #4b5563);
          cursor: not-allowed;
          box-shadow: none;
        }

        .title {
          color: white;
          margin-bottom: 20px;
          font-size: 24px;
          font-weight: 600;
        }

        @media (prefers-reduced-motion: no-preference) {
          .login-container {
            animation: float 6s ease-in-out infinite;
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>

      <div className="glass-container">
        <h2 className="title">Login</h2>
        <form onSubmit={formik.handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            value={formik.values.email}
            autoComplete="email"
          />
          {formik.touched.email && formik.errors.email && (
            <p className="error">{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={formik.handleChange}
            value={formik.values.password}
            autoComplete="current-password"
          />
          {formik.touched.password && formik.errors.password && (
            <p className="error">{formik.errors.password}</p>
          )}

          <button type="submit" disabled={formik.isSubmitting}>
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
