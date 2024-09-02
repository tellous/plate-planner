import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import { extractRecipeNameFromUrl } from '../utils/stringUtils';
import RecipeSelectionModal from './RecipeSelectionModal';
import DifficultyRating from './DifficultyRating';

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

interface Props {
    recipes: Recipe[];
    enabledMeals: MealTime[];
}

export default function WeeklyRecipes({ recipes, enabledMeals }: Props) {
    const [weeklyRecipes, setWeeklyRecipes] = useState<Record<MealTime, Recipe | null>[]>(() => {
        const savedWeeklyRecipes = localStorage.getItem('weeklyRecipes');
        return savedWeeklyRecipes ? JSON.parse(savedWeeklyRecipes) : Array(7).fill({ breakfast: null, lunch: null, dinner: null });
    });
    const [currentDayIndex, setCurrentDayIndex] = useState(new Date().getDay());
    const [showSelectionModal, setShowSelectionModal] = useState(false);
    const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);
    const [selectedMealTime, setSelectedMealTime] = useState<MealTime | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef({
        isDragging: false,
        startX: 0,
        scrollLeft: 0,
    });
    const todayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        localStorage.setItem('weeklyRecipes', JSON.stringify(weeklyRecipes));
    }, [weeklyRecipes]);

    const handleRandomize = async (index: number, mealTime: MealTime) => {
        const eligibleRecipes = recipes.filter(recipe => recipe.mealTimes.includes(mealTime));
        const randomRecipe = eligibleRecipes[Math.floor(Math.random() * eligibleRecipes.length)];
        const newWeeklyRecipes = [...weeklyRecipes];
        newWeeklyRecipes[index] = { ...newWeeklyRecipes[index], [mealTime]: randomRecipe };
        setWeeklyRecipes(newWeeklyRecipes);
        localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes));
    };

    const handleRandomizeWeek = async () => {
        if (window.confirm('Are you sure you want to randomize all recipes for the week?')) {
            const newWeeklyRecipes = weeklyRecipes.map(() => {
                const mealTimes: Record<MealTime, Recipe | null> = { breakfast: null, lunch: null, dinner: null };
                for (const mealTime of enabledMeals) {
                    const eligibleRecipes = recipes.filter(recipe => recipe.mealTimes.includes(mealTime));
                    mealTimes[mealTime] = eligibleRecipes[Math.floor(Math.random() * eligibleRecipes.length)];
                }
                return mealTimes;
            });
            setWeeklyRecipes(newWeeklyRecipes);
            localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes));
        }
    };

    const handleManualSelect = (index: number, mealTime: MealTime) => {
        setSelectedDayIndex(index);
        setSelectedMealTime(mealTime);
        setShowSelectionModal(true);
    };

    const handleSelectRecipe = (recipe: Recipe) => {
        if (selectedDayIndex !== null && selectedMealTime !== null) {
            const newWeeklyRecipes = [...weeklyRecipes];
            newWeeklyRecipes[selectedDayIndex] = { ...newWeeklyRecipes[selectedDayIndex], [selectedMealTime]: recipe };
            setWeeklyRecipes(newWeeklyRecipes);
            localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes));
            setShowSelectionModal(false);
            setSelectedDayIndex(null);
            setSelectedMealTime(null);
        }
    };

    const handleClearMeal = (index: number, mealTime: MealTime) => {
        const newWeeklyRecipes = [...weeklyRecipes];
        newWeeklyRecipes[index] = { ...newWeeklyRecipes[index], [mealTime]: null };
        setWeeklyRecipes(newWeeklyRecipes);
        localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes));
    };

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        dragRef.current = {
            isDragging: true,
            startX: e.pageX - containerRef.current.offsetLeft,
            scrollLeft: containerRef.current.scrollLeft,
        };
    }, []);

    const handleMouseUp = useCallback(() => {
        dragRef.current.isDragging = false;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current || !dragRef.current.isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - dragRef.current.startX) * 2;
        containerRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
    }, []);

    const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        dragRef.current = {
            isDragging: true,
            startX: e.touches[0].pageX - containerRef.current.offsetLeft,
            scrollLeft: containerRef.current.scrollLeft,
        };
    }, []);

    const handleTouchEnd = useCallback(() => {
        dragRef.current.isDragging = false;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current || !dragRef.current.isDragging) return;
        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const walk = (x - dragRef.current.startX) * 2;
        containerRef.current.scrollLeft = dragRef.current.scrollLeft - walk;
    }, []);

    return (
        <div className="weekly-recipes">
            <div className="weekly-recipes-header">
                <h2>this week's menu</h2>
            </div>
            <div className="weekly-recipes-footer">
                <button onClick={handleRandomizeWeek} className="randomize-week-btn">🎲 randomize week</button>
            </div>
            <div className="recipes-container-wrapper">
                <div
                    className="recipes-container"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onTouchMove={handleTouchMove}
                >
                    {weeklyRecipes.map((dayRecipes, index) => {
                        const dayIndex = (index + currentDayIndex) % 7;
                        const isToday = dayIndex === currentDayIndex;
                        const dayLabel = DAYS[dayIndex];

                        return (
                            <div key={index} className="recipe-card" ref={isToday ? todayRef : null}>
                                <div className="recipe-content">
                                    <span className="day-label">{dayLabel}{isToday && ' (today)'}</span>
                                    {['breakfast', 'lunch', 'dinner'].map((mealTime) => {
                                        if (!enabledMeals.includes(mealTime as MealTime)) return null;
                                        const recipe = dayRecipes[mealTime as MealTime];
                                        return (
                                            <div key={mealTime}>
                                                <div className="meal-time-header">
                                                    <h3>{mealTime}</h3>
                                                </div>
                                                <div className="meal-time">
                                                    {recipe ? (
                                                        <>
                                                            <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="recipe-url" title={recipe.url}>
                                                                {recipe.name || extractRecipeNameFromUrl(recipe.url)}
                                                            </a>
                                                            <DifficultyRating rating={recipe?.difficulty || 0} onRatingChange={() => { }} maxRating={10} readOnly={true} />
                                                        </>
                                                    ) : (
                                                        <span className="no-recipe">No recipe selected</span>
                                                    )}
                                                    <ul className="ingredient-count">
                                                        {recipe?.ingredients.map((ingredient, index) => (
                                                            <li key={index}>{ingredient}</li>
                                                        ))}
                                                    </ul>

                                                    <div className="recipe-buttons">
                                                        <button onClick={() => handleManualSelect(index, mealTime as MealTime)} className="manual-select-btn">🔎</button>
                                                        <button onClick={() => handleRandomize(index, mealTime as MealTime)} className="randomize-btn">🎲</button>
                                                        <button onClick={() => handleClearMeal(index, mealTime as MealTime)} className="clear-btn">🗑️</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {showSelectionModal && selectedMealTime && (
                <RecipeSelectionModal
                    recipes={recipes}
                    onSelect={handleSelectRecipe}
                    onClose={() => setShowSelectionModal(false)}
                    mealTime={selectedMealTime}
                />
            )}
        </div>
    );
}