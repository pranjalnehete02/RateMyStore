import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function StarRating({ value = 0, max = 5 }) {
  const filledStars = Math.round(value);
  const stars = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        key={i}
        className={i <= filledStars ? "text-warning" : "text-muted"}
        style={{
          fontSize: "1.5rem",
          transition: "color 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.currentTarget.style.color =
            i <= filledStars ? "#ffc107" : "#adb5bd")
        }
        onMouseOut={(e) =>
          (e.currentTarget.style.color =
            i <= filledStars ? "#ffc107" : "#6c757d")
        }
      >
        ★
      </span>
    );
  }

  return (
    <div
      className="d-flex justify-content-center gap-1"
      style={{ animation: "fadeIn 0.5s ease-in-out" }}
    >
      {stars}
    </div>
  );
}
