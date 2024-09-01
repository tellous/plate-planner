import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import { extractRecipeNameFromUrl } from '../utils/stringUtils';
import RecipeSelectionModal from './RecipeSelectionModal';
import DifficultyRating from './DifficultyRating';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

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

  const handleRandomize = (index: number, mealTime: MealTime) => {
    const eligibleRecipes = recipes.filter(recipe => recipe.mealTimes.includes(mealTime));
    const randomRecipe = eligibleRecipes[Math.floor(Math.random() * eligibleRecipes.length)];
    const newWeeklyRecipes = [...weeklyRecipes];
    newWeeklyRecipes[index] = { ...newWeeklyRecipes[index], [mealTime]: randomRecipe };
    setWeeklyRecipes(newWeeklyRecipes);
    localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes)); // Save to localStorage
  };

  const handleRandomizeWeek = () => {
    if (window.confirm('Are you sure you want to randomize all recipes for the week?')) {
      const newWeeklyRecipes = weeklyRecipes.map(() => {
        const mealTimes: Record<MealTime, Recipe | null> = { breakfast: null, lunch: null, dinner: null };
        enabledMeals.forEach(mealTime => {
          const eligibleRecipes = recipes.filter(recipe => recipe.mealTimes.includes(mealTime));
          const randomRecipe = eligibleRecipes[Math.floor(Math.random() * eligibleRecipes.length)];
          mealTimes[mealTime] = randomRecipe;
        });
        return mealTimes;
      });
      setWeeklyRecipes(newWeeklyRecipes);
      localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes)); // Save to localStorage
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
      localStorage.setItem('weeklyRecipes', JSON.stringify(newWeeklyRecipes)); // Save to localStorage
      setShowSelectionModal(false);
      setSelectedDayIndex(null);
      setSelectedMealTime(null);
    }
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
        <h2>This Week's Menu</h2>
      </div>
      <div className="weekly-recipes-footer">
        <button onClick={handleRandomizeWeek} className="randomize-week-btn">🎲 Randomize Week</button>
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
                  <span className="day-label">{dayLabel}{isToday && ' (Today)'}</span>
                  {enabledMeals.map((mealTime) => {
                    const recipe = dayRecipes[mealTime];
                    return (
                      <div key={mealTime} className="meal-time">
                        <h3>{mealTime.charAt(0).toUpperCase() + mealTime.slice(1)}</h3>
                        {recipe ? (
                          <>
                            <a href={recipe.url} target="_blank" rel="noopener noreferrer" className="recipe-url" title={recipe.url}>
                              {extractRecipeNameFromUrl(recipe.url)}
                            </a>
                            <DifficultyRating rating={recipe.difficulty} onRatingChange={() => {}} maxRating={10} readOnly={true} />
                            <div className="recipe-buttons">
                              <button onClick={() => handleRandomize(index, mealTime)} className="randomize-btn" title="Randomize">🎲</button>
                              <button onClick={() => handleManualSelect(index, mealTime)} className="manual-select-btn" title="Select">📋</button>
                            </div>
                          </>
                        ) : (
                          <div>
                            <span className="no-recipe">No recipe selected</span>
                            <div className="recipe-buttons">
                              <button onClick={() => handleRandomize(index, mealTime)} className="randomize-btn" title="Randomize">🎲</button>
                              <button onClick={() => handleManualSelect(index, mealTime)} className="manual-select-btn" title="Select">📋</button>
                            </div>
                          </div>
                        )}
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