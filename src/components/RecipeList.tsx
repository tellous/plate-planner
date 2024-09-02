import React, { useState } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import DifficultyRating from './DifficultyRating';
import RecipeForm from './RecipeForm';

interface Props {
    recipes: Recipe[];
    onEdit: (recipe: Recipe) => void;
    onDelete: (id: string) => void;
    searchTerm: string;
    selectedMealTimes: MealTime[];
    minIngredients: string;
    maxIngredients: string;
}

export default function RecipeList({ recipes, onEdit, onDelete, searchTerm, selectedMealTimes, minIngredients, maxIngredients }: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<Recipe>({
        id: '',
        name: '',
        url: '',
        difficulty: 0,
        mealTimes: [],
        ingredients: []
    });

    const handleEdit = (id: string) => {
        setEditingId(id);
        const recipe = recipes.find(r => r.id === id);
        setEditValues(recipe || {
            id: '',
            name: '',
            url: '',
            difficulty: 0,
            mealTimes: [],
            ingredients: []
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditValues({
            id: '',
            name: '',
            url: '',
            difficulty: 0,
            mealTimes: [],
            ingredients: []
        });
    };

    return (
        <div className="recipe-list">
            {recipes.map(recipe => (
                <div key={recipe.id} className="recipe-row">
                    {editingId === recipe.id ? (
                        <div className="recipe-cell form-cell">
                            <RecipeForm
                                initialValues={editValues}
                                onSubmit={onEdit}
                                onClose={handleCancel}
                                submitButtonText="save"
                            />
                        </div>
                    ) : (
                        <>
                            <div className="recipe-cell url-cell">
                                <a href={recipe.url} target="_blank" rel="noopener noreferrer">
                                    {recipe.name}
                                </a>
                            </div>
                            <div className="recipe-cell difficulty-cell">
                                <DifficultyRating
                                    rating={recipe.difficulty}
                                    onRatingChange={() => { }}
                                    maxRating={10}
                                    readOnly={true}
                                />
                            </div>
                            <div className="recipe-cell meal-times-cell">
                                <div className="meal-times">
                                    {recipe.mealTimes.map(mealTime => (
                                        <span key={mealTime} className="meal-time-tag">
                                            {mealTime}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="recipe-cell ingredient-count-cell">
                                Ingredients: {recipe.ingredients.length}
                            </div>
                            <div className="recipe-cell action-cell">
                                <div className="action-buttons">
                                    <button onClick={() => handleEdit(recipe.id)} className="modal-button edit-button">edit</button>
                                    <button onClick={() => onDelete(recipe.id)} className="modal-button delete-button">delete</button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
