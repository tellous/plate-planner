import React, { useState, useEffect } from 'react';
import WeeklyRecipes from './components/WeeklyRecipes';
import AddRecipeModal from './components/AddRecipeModal';
import RecipeListModal from './components/RecipeListModal';
import Settings from './components/Settings';
import WeeklyIngredientsModal from './components/WeeklyIngredientsModal';
import { useRecipes, MealTime, Recipe } from './hooks/useRecipes';
import './App.css';

function App() {
  const { recipes, addRecipe, updateRecipe, deleteRecipe, resetToDefault, deleteAllRecipes } = useRecipes();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRecipeListModal, setShowRecipeListModal] = useState(false);
  const [showWeeklyIngredientsModal, setShowWeeklyIngredientsModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enabledMeals, setEnabledMeals] = useState<MealTime[]>(() => {
    const savedEnabledMeals = localStorage.getItem('enabledMeals');
    return savedEnabledMeals ? JSON.parse(savedEnabledMeals) : ['breakfast', 'lunch', 'dinner'];
  });
  const [allowReset, setAllowReset] = useState(() => {
    const savedAllowReset = localStorage.getItem('allowReset');
    return savedAllowReset ? JSON.parse(savedAllowReset) : false;
  });
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleDataImport = () => {
    window.location.reload();
  };

  const handleSaveSettings = (newEnabledMeals: MealTime[], newAllowReset: boolean) => {
    setEnabledMeals(newEnabledMeals);
    setAllowReset(newAllowReset);
    localStorage.setItem('enabledMeals', JSON.stringify(newEnabledMeals));
    localStorage.setItem('allowReset', JSON.stringify(newAllowReset));
  };

  const handleEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setShowRecipeListModal(true);
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
        <WeeklyRecipes recipes={recipes} enabledMeals={enabledMeals} onEdit={handleEdit} />
      </main>
      {showAddModal && (
        <AddRecipeModal onAdd={addRecipe} onClose={() => setShowAddModal(false)} />
      )}
      {showRecipeListModal && (
        <RecipeListModal
          recipes={recipes}
          onClose={() => {
            setShowRecipeListModal(false);
            setEditingRecipe(null);
          }}
          onEdit={updateRecipe}
          onDelete={deleteRecipe}
          onResetToDefault={resetToDefault}
          onDeleteAll={deleteAllRecipes}
          allowReset={allowReset}
          editingRecipe={editingRecipe}
        />
      )}
      {showSettings && (
        <Settings
          enabledMeals={enabledMeals}
          onSaveSettings={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          allowReset={allowReset}
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