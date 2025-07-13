// src/components/StarRating.jsx
import React from "react";

export default function StarRating({ value = 0, max = 5 }) {
  const filledStars = Math.round(value);
  const stars = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      <span
        key={i}
        className={i <= filledStars ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    );
  }

  return <div className="text-lg">{stars}</div>;
}
