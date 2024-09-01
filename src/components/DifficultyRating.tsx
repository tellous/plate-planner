import React from 'react';

interface DifficultyRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
  readOnly?: boolean;
}

const DifficultyRating: React.FC<DifficultyRatingProps> = ({ rating, onRatingChange, maxRating = 10, readOnly = false }) => {
  return (
    <div className="difficulty-rating-container">
      <div className="difficulty-rating">
        {[...Array(Math.min(maxRating, 10))].map((_, index) => {
          const fireValue = index + 1;
          return (
            <span
              key={index}
              onClick={() => !readOnly && onRatingChange(fireValue)}
              className={`difficulty-icon ${fireValue <= rating ? 'active' : ''} ${readOnly ? 'read-only' : ''}`}
            >
              {fireValue <= rating ? '🔥' : '⚪'}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default DifficultyRating;