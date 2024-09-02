import React, { useState, useEffect } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import DifficultyRating from './DifficultyRating';
import { extractIngredientsFromImage } from '../utils/imageUtils';
import { extractRecipeNameFromUrl } from '../utils/stringUtils';

interface Props {
    initialValues?: Recipe;
    onSubmit: (recipe: Recipe) => void;
    onClose: () => void;
    submitButtonText: string;
}

export default function RecipeForm({ initialValues, onSubmit, onClose, submitButtonText }: Props) {
    const [name, setName] = useState(initialValues?.name || '');
    const [url, setUrl] = useState(initialValues?.url || '');
    const [difficulty, setDifficulty] = useState(initialValues?.difficulty || 5);
    const [mealTimes, setMealTimes] = useState<MealTime[]>(initialValues?.mealTimes || []);
    const [ingredients, setIngredients] = useState<string[]>(initialValues?.ingredients || []);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isNameManuallySet, setIsNameManuallySet] = useState(false);

    useEffect(() => {
        if (!isNameManuallySet && url) {
            const extractedName = extractRecipeNameFromUrl(url);
            setName(extractedName);
        }
    }, [url, isNameManuallySet]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mealTimes.length === 0) {
            setError('Please select at least one meal time.');
            return;
        }
        try {
            const recipeToSubmit = {
                id: initialValues?.id || '',
                name: name || extractRecipeNameFromUrl(url),
                url,
                difficulty,
                mealTimes,
                ingredients
            };
            await onSubmit(recipeToSubmit);
            onClose();
        } catch (error) {
            console.error('Error submitting recipe:', error);
            setError('Failed to submit the recipe. Please try again.');
        }
    };

    const handleMealTimeToggle = (mealTime: MealTime) => {
        setMealTimes(prev =>
            prev.includes(mealTime)
                ? prev.filter(mt => mt !== mealTime)
                : [...prev, mealTime]
        );
        setError('');
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setIsProcessing(true);
            try {
                const extractedIngredients = await extractIngredientsFromImage(file);
                setIngredients(Array.isArray(extractedIngredients) ? extractedIngredients : []);
            } catch (error) {
                console.error('Error extracting ingredients:', error);
                setError('Failed to extract ingredients from the image. Please try again or check your API key in Settings.');
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
        setIsNameManuallySet(true);
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target.value);
        if (!isNameManuallySet) {
            const extractedName = extractRecipeNameFromUrl(e.target.value);
            setName(extractedName);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="name">recipe name (optional):</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    placeholder="Enter recipe name or leave blank to extract from URL"
                />
            </div>
            <div className="form-group">
                <label htmlFor="url">recipe url:</label>
                <input
                    type="url"
                    id="url"
                    value={url}
                    onChange={handleUrlChange}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="difficulty">difficulty:</label>
                <DifficultyRating
                    rating={difficulty}
                    onRatingChange={setDifficulty}
                    maxRating={10}
                />
            </div>
            <div className="form-group">
                <label>meal times:</label>
                {['breakfast', 'lunch', 'dinner'].map((meal) => (
                    <label key={meal} className="meal-time-checkbox">
                        <input
                            type="checkbox"
                            checked={mealTimes.includes(meal.toLowerCase() as MealTime)}
                            onChange={() => handleMealTimeToggle(meal.toLowerCase() as MealTime)}
                        />
                        {meal}
                    </label>
                ))}
            </div>
            <div className="form-group">
                <label htmlFor="image-upload">upload ingredients screenshot:</label>
                <input
                    className='image-upload'
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isProcessing}
                />
            </div>
            {isProcessing && <p>processing image...</p>}
            <div className="form-group">
                <label htmlFor="ingredients">ingredients:</label>
                <textarea
                    id="ingredients"
                    value={Array.isArray(ingredients) ? ingredients.join('\n') : ingredients}
                    onChange={(e) => setIngredients(e.target.value.split('\n').filter(i => i.trim() !== ''))}
                    rows={8}
                    placeholder="enter ingredients or upload an image"
                />
            </div>
            {error && <p className="error">{error}</p>}
            <div className="modal-footer">
                <button type="button" onClick={onClose} className="modal-button primary-button">cancel</button>
                <button type="submit" disabled={isProcessing} className="modal-button secondary-button">{submitButtonText}</button>
            </div>
        </form>
    );
}