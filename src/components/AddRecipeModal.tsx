import React from 'react';
import { Recipe } from '../hooks/useRecipes';
import RecipeForm from './RecipeForm';

interface Props {
    onAdd: (recipe: Omit<Recipe, 'id'>) => void;
    onClose: () => void;
}

export default function AddRecipeModal({ onAdd, onClose }: Props) {
    return (
        <div className="modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>add new recipe</h2>
                </div>
                <div className="modal-body">
                    <RecipeForm
                        onSubmit={onAdd}
                        onClose={onClose}
                        submitButtonText="add recipe"
                    />
                </div>
            </div>
        </div>
    );
}
