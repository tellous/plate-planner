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
    const [minIngredients, setMinIngredients] = useState('0');
    const [maxIngredients, setMaxIngredients] = useState('');

    const filteredRecipes = useMemo(() => {
        return recipes.filter(recipe => {
            const mealtimeMatch = recipe.mealTimes.includes(mealTime);
            const minIngredientsMatch = minIngredients === '' || recipe.ingredients.length >= parseInt(minIngredients);
            const maxIngredientsMatch = maxIngredients === '' || recipe.ingredients.length <= parseInt(maxIngredients);
            return mealtimeMatch && minIngredientsMatch && maxIngredientsMatch;
        });
    }, [recipes, mealTime, minIngredients, maxIngredients]);

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
                    <h2>select a {mealTime} recipe</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <div className="ingredient-count-filter">
                            <span>ingredient count:</span>
                            <div className="ingredient-count-inputs">
                                <label>
                                    min:
                                    <input
                                        type="number"
                                        value={minIngredients}
                                        onChange={(e) => setMinIngredients(e.target.value)}
                                        className="ingredient-count-input"
                                        min="0"
                                    />
                                </label>
                                <label>
                                    max:
                                    <input
                                        type="number"
                                        value={maxIngredients}
                                        onChange={(e) => setMaxIngredients(e.target.value)}
                                        className="ingredient-count-input"
                                        min="0"
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
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
                                        onRatingChange={() => { }}
                                        maxRating={10}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="recipe-selection-ingredient-count">
                                    Ingredients: {recipe.ingredients.length}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-button secondary-button">close</button>
                </div>
            </div>
        </div>
    );
}