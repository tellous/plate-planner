import React, { useState } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import DifficultyRating from './DifficultyRating';

interface Props {
  onAdd: (recipe: Omit<Recipe, 'id'>) => void;
  onClose: () => void;
}

export default function AddRecipeModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState('');
  const [difficulty, setDifficulty] = useState(5);
  const [mealTimes, setMealTimes] = useState<MealTime[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealTimes.length === 0) {
      setError('Please select at least one meal time.');
      return;
    }
    onAdd({ url, difficulty, mealTimes });
    onClose();
  };

  const handleMealTimeToggle = (mealTime: MealTime) => {
    setMealTimes(prev =>
      prev.includes(mealTime)
        ? prev.filter(mt => mt !== mealTime)
        : [...prev, mealTime]
    );
    setError('');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Recipe</h2>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="url">Recipe URL:</label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="search-input"
              />
            </div>
            <div className="form-group">
              <label>Difficulty:</label>
              <DifficultyRating
                rating={difficulty}
                onRatingChange={setDifficulty}
                maxRating={10}
              />
            </div>
            <div className="form-group">
              <label>Meal Times:</label>
              <div className="meal-time-checkboxes">
                {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
                  <label key={mealTime} className="meal-time-filter">
                    <input
                      type="checkbox"
                      checked={mealTimes.includes(mealTime as MealTime)}
                      onChange={() => handleMealTimeToggle(mealTime as MealTime)}
                    />
                    {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                  </label>
                ))}
              </div>
            </div>
            {error && <div className="error-message">{error}</div>}
          </form>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button secondary-button">Cancel</button>
          <button onClick={handleSubmit} className="modal-button primary-button">Add Recipe</button>
        </div>
      </div>
    </div>
  );
}
