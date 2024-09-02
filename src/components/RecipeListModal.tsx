import React, { useState } from 'react';
import RecipeList from './RecipeList';
import { Recipe, MealTime } from '../hooks/useRecipes';

interface Props {
    recipes: Recipe[];
    onClose: () => void;
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    onResetToDefault: () => void;
    allowReset: boolean;
    onDeleteAll: () => void;
}

export default function RecipeListModal({ recipes, onClose, onEdit, onDelete, onResetToDefault, onDeleteAll, allowReset }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMealTimes, setSelectedMealTimes] = useState<MealTime[]>([]);
    const [minIngredients, setMinIngredients] = useState('0');
    const [maxIngredients, setMaxIngredients] = useState('');

    const handleMealTimeToggle = (mealTime: MealTime) => {
        setSelectedMealTimes(prev =>
            prev.includes(mealTime)
                ? prev.filter(mt => mt !== mealTime)
                : [...prev, mealTime]
        );
    };

    const handleResetToDefault = () => {
        if (window.confirm('Are you sure you want to reset to default recipes? This action cannot be undone.')) {
            onResetToDefault();
        }
    };

    const handleDeleteAll = () => {
        if (window.confirm('Are you sure you want to delete all recipes? This action cannot be undone.')) {
            onDeleteAll();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>all recipes</h2>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <div className="filter-section">
                            <span>meal time:</span>
                            <div className="meal-time-filters">
                                {['breakfast', 'lunch', 'dinner'].map((mealTime) => (
                                    <label key={mealTime} className="meal-time-filter">
                                        <input
                                            type="checkbox"
                                            checked={selectedMealTimes.includes(mealTime as MealTime)}
                                            onChange={() => handleMealTimeToggle(mealTime as MealTime)}
                                        />
                                        {mealTime}
                                    </label>
                                ))}
                            </div>
                        </div>
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
                    <RecipeList
                        recipes={recipes}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        searchTerm={searchTerm}
                        selectedMealTimes={selectedMealTimes}
                        minIngredients={minIngredients}
                        maxIngredients={maxIngredients}
                    />
                </div>
                <div className="modal-footer">
                    <button onClick={onClose} className="modal-button secondary-button">close</button>
                    {allowReset && (
                        <button onClick={handleResetToDefault} className="modal-button danger-button">reset to default</button>
                    )}
                    <button onClick={handleDeleteAll} className="modal-button danger-button">delete all</button>
                </div>
            </div>
        </div>
    );
}