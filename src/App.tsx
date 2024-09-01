import React, { useState } from 'react';
import WeeklyRecipes from './components/WeeklyRecipes';
import AddRecipeModal from './components/AddRecipeModal';
import RecipeListModal from './components/RecipeListModal';
import Settings from './components/Settings';
import { useRecipes, MealTime } from './hooks/useRecipes';
import './App.css';

function App() {
  const [showInput, setShowInput] = useState(false);
  const [showList, setShowList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledMeals, setEnabledMeals] = useState<MealTime[]>(['breakfast', 'lunch', 'dinner']);
  const { recipes, addRecipe, updateRecipe, deleteRecipe, resetToDefault } = useRecipes();

  const handleToggleMeal = (meal: MealTime) => {
    setEnabledMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  };

  return (
    <div className="App">
      <div className="header-container">
        <h1>Weekly Recipe Planner</h1>
        <div className="header-buttons">
          <button onClick={() => setShowInput(true)} className="header-button">Add Recipes</button>
          <button onClick={() => setShowList(true)} className="header-button">View All Recipes</button>
          <button onClick={() => setShowSettings(true)} className="header-button">Settings</button>
        </div>
      </div>

      {showInput && (
        <AddRecipeModal
          onAdd={addRecipe}
          onClose={() => setShowInput(false)}
        />
      )}

      {showList && (
        <RecipeListModal
          recipes={recipes}
          onClose={() => setShowList(false)}
          onEdit={updateRecipe}
          onDelete={deleteRecipe}
          onResetToDefault={resetToDefault}
        />
      )}

      {showSettings && (
        <Settings
          enabledMeals={enabledMeals}
          onToggleMeal={handleToggleMeal}
          onClose={() => setShowSettings(false)}  // Add this line
        />
      )}

      <WeeklyRecipes recipes={recipes} enabledMeals={enabledMeals} />
    </div>
  );
}

export default App;