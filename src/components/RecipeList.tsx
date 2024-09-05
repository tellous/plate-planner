import React, { useState, useEffect } from 'react';
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
    editingId: string | null;
    setEditingId: (id: string | null) => void;
}

export default function RecipeList({ recipes, onEdit, onDelete, searchTerm, selectedMealTimes, minIngredients, maxIngredients, editingId, setEditingId }: Props) {
    const [editValues, setEditValues] = useState<Recipe>({
        id: '',
        name: '',
        url: '',
        difficulty: 0,
        mealTimes: [],
        ingredients: []
    });

    useEffect(() => {
        if (editingId) {
            const recipe = recipes.find(r => r.id === editingId);
            if (recipe) {
                setEditValues(recipe);
                // Scroll to the edited recipe
                setTimeout(() => {
                    const element = document.getElementById(`recipe-${editingId}`);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        }
    }, [editingId, recipes]);

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
                <div key={recipe.id} id={`recipe-${recipe.id}`} className="recipe-row">
                    {editingId === recipe.id ? (
                        <div className="recipe-cell form-cell">
                            <RecipeForm
                                initialValues={editValues}
                                onSubmit={(updatedRecipe) => {
                                    onEdit(updatedRecipe);
                                    setEditingId(null);
                                }}
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
