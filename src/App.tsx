import React, { useState, useEffect } from 'react';
import WeeklyRecipes from './components/WeeklyRecipes';
import AddRecipeModal from './components/AddRecipeModal';
import RecipeListModal from './components/RecipeListModal';
import Settings from './components/Settings';
import WeeklyIngredientsModal from './components/WeeklyIngredientsModal';
import { useRecipes, MealTime } from './hooks/useRecipes';
import './App.css';

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, resetToDefault, deleteAllRecipes } = useRecipes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecipeListModal, setShowRecipeListModal] = useState(false);
  const [showWeeklyIngredientsModal, setShowWeeklyIngredientsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledMeals, setEnabledMeals] = useState<MealTime[]>(['breakfast', 'lunch', 'dinner']);
  const [allowReset, setAllowReset] = useState(false);

  const handleToggleMeal = (meal: MealTime) => {
    setEnabledMeals(prev =>
      prev.includes(meal) ? prev.filter(m => m !== meal) : [...prev, meal]
    );
  };

  const handleDataImport = () => {
    window.location.reload();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>plate planner</h1>
        <div className="floral-separator"></div>
        <div className="header-buttons">
          <button onClick={() => setShowAddModal(true)} className="header-button">➕</button>
          <button onClick={() => setShowRecipeListModal(true)} className="header-button">📃</button>
          <button onClick={() => setShowSettings(true)} className="header-button">⚙️</button>
        </div>
      </header>
      <main className="main-content">
        <WeeklyRecipes recipes={recipes} enabledMeals={enabledMeals} />
      </main>
      {showAddModal && (
        <AddRecipeModal onAdd={addRecipe} onClose={() => setShowAddModal(false)} />
      )}
      {showRecipeListModal && (
        <RecipeListModal
          recipes={recipes}
          onClose={() => setShowRecipeListModal(false)}
          onEdit={updateRecipe}
          onDelete={deleteRecipe}
          onResetToDefault={resetToDefault}
          onDeleteAll={deleteAllRecipes}
          allowReset={allowReset}
        />
      )}
      {showSettings && (
        <Settings
          enabledMeals={enabledMeals}
          onToggleMeal={handleToggleMeal}
          onClose={() => setShowSettings(false)}
          allowReset={allowReset}
          onAllowResetChange={setAllowReset}
          onDataImport={handleDataImport}
        />
      )}
      <div className="floating-button-container">
        <button
          className="floating-button"
          onClick={() => setShowWeeklyIngredientsModal(true)}
        >
          🧺 view weekly ingredients
        </button>
      </div>
      {showWeeklyIngredientsModal && (
        <WeeklyIngredientsModal
          onClose={() => setShowWeeklyIngredientsModal(false)}
          enabledMeals={enabledMeals}
        />
      )}
    </div>
  );
}

export default App;