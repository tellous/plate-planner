import React, { useState } from 'react';
import RecipeList from './RecipeList';
import { Recipe, MealTime } from '../hooks/useRecipes';

interface Props {
  recipes: Recipe[];
  onClose: () => void;
  onEdit: (id: string, updates: Partial<Recipe>) => void;
  onDelete: (id: string) => void;
  onResetToDefault: () => void;
}

export default function RecipeListModal({ recipes, onClose, onEdit, onDelete, onResetToDefault }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMealTimes, setSelectedMealTimes] = useState<MealTime[]>([]);

  const handleResetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default recipes? This action cannot be undone.')) {
      onResetToDefault();
    }
  };

  const handleMealTimeToggle = (mealTime: MealTime) => {
    setSelectedMealTimes(prev =>
      prev.includes(mealTime)
        ? prev.filter(mt => mt !== mealTime)
        : [...prev, mealTime]
    );
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>All Recipes</h2>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="meal-time-filters">
            {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
              <label key={mealTime} className="meal-time-filter">
                <input
                  type="checkbox"
                  checked={selectedMealTimes.includes(mealTime as MealTime)}
                  onChange={() => handleMealTimeToggle(mealTime as MealTime)}
                />
                {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <div className="modal-body">
          <RecipeList
            recipes={recipes}
            onEdit={onEdit}
            onDelete={onDelete}
            searchTerm={searchTerm}
            selectedMealTimes={selectedMealTimes}
          />
        </div>
        <div className="modal-footer">
          <button onClick={handleResetToDefault} className="modal-button danger-button">Reset to Default</button>
          <button onClick={onClose} className="modal-button secondary-button">Close</button>
        </div>
      </div>
    </div>
  );
}