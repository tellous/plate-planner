import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import { Recipe, MealTime } from '../hooks/useRecipes';
import DifficultyRating from './DifficultyRating';
import { extractRecipeNameFromUrl } from '../utils/stringUtils';

interface Props {
  recipes: Recipe[];
  onSelect: (recipe: Recipe) => void;
  onClose: () => void;
  mealTime: MealTime;
}

export default function RecipeSelectionModal({ recipes, onSelect, onClose, mealTime }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => recipe.mealTimes.includes(mealTime));
  }, [recipes, mealTime]);

  const fuse = useMemo(() => new Fuse(filteredRecipes, {
    keys: ['url'],
    threshold: 0.3,
  }), [filteredRecipes]);

  const searchedRecipes = useMemo(() => {
    if (!searchTerm) return filteredRecipes;
    return fuse.search(searchTerm).map(result => result.item);
  }, [fuse, filteredRecipes, searchTerm]);

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Select a {mealTime.charAt(0).toUpperCase() + mealTime.slice(1)} Recipe</h2>
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="modal-body">
          <div className="recipe-selection-list">
            {searchedRecipes.map(recipe => (
              <div key={recipe.id} className="recipe-selection-item" onClick={() => onSelect(recipe)}>
                <div className="recipe-selection-url" title={recipe.url}>
                  {extractRecipeNameFromUrl(recipe.url)}
                </div>
                <div className="recipe-selection-difficulty">
                  <DifficultyRating
                    rating={recipe.difficulty}
                    onRatingChange={() => {}}
                    maxRating={10}
                    readOnly={true}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button onClick={onClose} className="modal-button secondary-button">Close</button>
        </div>
      </div>
    </div>
  );
}