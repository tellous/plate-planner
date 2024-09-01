import React from 'react';
import { MealTime } from '../hooks/useRecipes';

interface Props {
  enabledMeals: MealTime[];
  onToggleMeal: (meal: MealTime) => void;
  onClose: () => void;
}

export default function Settings({ enabledMeals, onToggleMeal, onClose }: Props) {
  const allMeals: MealTime[] = ['breakfast', 'lunch', 'dinner'];

  return (
    <div className="modal settings-modal">
      <div className="modal-content settings-content">
        <div className="modal-header">
          <h2>Settings</h2>
        </div>
        <div className="modal-body">
          <h3>Meal Preferences</h3> {/* Added header */}
          <div className="meal-time-checkboxes two-column"> {/* Added class for two columns */}
            {allMeals.map((meal) => (
              <label key={meal} className="meal-time-filter">
                <input
                  type="checkbox"
                  checked={enabledMeals.includes(meal)}
                  onChange={() => onToggleMeal(meal)}
                />
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button primary-button">Close</button>
        </div>
      </div>
    </div>
  );
}