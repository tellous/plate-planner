import React, { useState } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import DifficultyRating from './DifficultyRating';
import { extractRecipeNameFromUrl } from '../utils/stringUtils';

interface Props {
  recipes: Recipe[];
  onEdit: (id: string, updates: Partial<Recipe>) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  selectedMealTimes: MealTime[];
}

export default function RecipeList({ recipes, onEdit, onDelete, searchTerm, selectedMealTimes }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<Recipe>>({});
  const [error, setError] = useState('');

  const handleEdit = (id: string) => {
    setEditingId(id);
    setEditValues(recipes.find(r => r.id === id) || {});
    setError('');
  };

  const handleSave = (id: string) => {
    if (!editValues.mealTimes || editValues.mealTimes.length === 0) {
      setError('Please select at least one meal time.');
      return;
    }
    onEdit(id, editValues);
    setEditingId(null);
    setEditValues({});
    setError('');
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
    setError('');
  };

  const handleChange = (field: keyof Recipe, value: string | number | MealTime[]) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleMealTimeToggle = (mealTime: MealTime) => {
    const currentMealTimes = editValues.mealTimes || [];
    const newMealTimes = currentMealTimes.includes(mealTime)
      ? currentMealTimes.filter(mt => mt !== mealTime)
      : [...currentMealTimes, mealTime];
    handleChange('mealTimes', newMealTimes);
  };

  const filteredRecipes = recipes.filter(recipe =>
    extractRecipeNameFromUrl(recipe.url).toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedMealTimes.length === 0 || recipe.mealTimes.some(mt => selectedMealTimes.includes(mt)))
  );

  return (
    <div className="recipe-list">
      {filteredRecipes.map(recipe => (
        <div key={recipe.id} className="recipe-row">
          <div className="recipe-cell url-cell">
            {editingId === recipe.id ? (
              <input
                type="text"
                value={editValues.url || recipe.url}
                onChange={e => handleChange('url', e.target.value)}
              />
            ) : (
              <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                {extractRecipeNameFromUrl(recipe.url)}
              </a>
            )}
          </div>
          <div className="recipe-cell difficulty-cell">
            {editingId === recipe.id ? (
              <DifficultyRating
                rating={editValues.difficulty || recipe.difficulty}
                onRatingChange={(value) => handleChange('difficulty', value)}
                maxRating={10}
              />
            ) : (
              <DifficultyRating
                rating={recipe.difficulty}
                onRatingChange={() => {}}
                maxRating={10}
                readOnly={true}
              />
            )}
          </div>
          <div className="recipe-cell meal-times-cell">
            {editingId === recipe.id ? (
              <div className="meal-time-checkboxes">
                {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
                  <label key={mealTime} className="meal-time-filter">
                    <input
                      type="checkbox"
                      checked={(editValues.mealTimes || recipe.mealTimes).includes(mealTime as MealTime)}
                      onChange={() => handleMealTimeToggle(mealTime as MealTime)}
                      className="meal-time-checkbox"
                    />
                    {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                  </label>
                ))}
              </div>
            ) : (
              <div className="meal-times">
                {recipe.mealTimes.map(mealTime => (
                  <span key={mealTime} className="meal-time-tag">
                    {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="recipe-cell action-cell">
            {editingId === recipe.id && (
              <div className="error-container">
                {error && <div className="error-message">{error}</div>}
              </div>
            )}
            <div className="action-buttons">
              {editingId === recipe.id ? (
                <>
                  <button onClick={() => handleSave(recipe.id)} className="modal-button primary-button">Save</button>
                  <button onClick={handleCancel} className="modal-button secondary-button">Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEdit(recipe.id)} className="modal-button edit-button">Edit</button>
                  <button onClick={() => onDelete(recipe.id)} className="modal-button delete-button">Delete</button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
