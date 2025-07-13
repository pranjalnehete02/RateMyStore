import React from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate, readOnly = false }) => {
  const [hoveredStar, setHoveredStar] = React.useState(null);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={`
            cursor-${readOnly ? "default" : "pointer"}
            transition duration-200
            w-6 h-6
            ${
              (hoveredStar || rating) >= star
                ? "text-yellow-400"
                : "text-gray-300"
            }
          `}
          onMouseEnter={() => !readOnly && setHoveredStar(star)}
          onMouseLeave={() => !readOnly && setHoveredStar(null)}
          onClick={() => !readOnly && onRate(star)}
        />
      ))}
    </div>
  );
};

export default StarRating;
