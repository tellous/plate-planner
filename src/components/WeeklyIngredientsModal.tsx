import React, { useState, useEffect } from 'react';
import { Recipe, MealTime } from '../hooks/useRecipes';
import { IngredientCategory, categorizeIngredient } from '../utils/ingredientCategories';

interface Props {
  onClose: () => void;
  enabledMeals: MealTime[];
}

interface IngredientState {
  [key: string]: {
    amount: string;
    have: boolean;
    category: IngredientCategory;
  };
}

export default function WeeklyIngredientsModal({ onClose, enabledMeals }: Props) {
  const [ingredients, setIngredients] = useState<IngredientState>({});

  useEffect(() => {
    const savedWeeklyRecipes = localStorage.getItem('weeklyRecipes');
    const savedIngredientState = localStorage.getItem('ingredientState');
    if (savedWeeklyRecipes) {
      const weeklyRecipes = JSON.parse(savedWeeklyRecipes) as Record<MealTime, Recipe | null>[];
      const allIngredients = weeklyRecipes
        .flatMap(day => Object.entries(day)
          .filter(([mealTime]) => enabledMeals.includes(mealTime as MealTime))
          .map(([, recipe]) => recipe)
        )
        .filter((recipe): recipe is Recipe => recipe !== null)
        .flatMap(recipe => recipe.ingredients)
        .reduce((acc, ingredient) => {
          const [amount, ...nameParts] = ingredient.split(' ');
          const name = nameParts.join(' ');
          const numericAmount = parseFloat(amount);
          const category = categorizeIngredient(name);
          
          if (!isNaN(numericAmount)) {
            if (acc[name]) {
              acc[name].amount = addAmounts(acc[name].amount, amount);
            } else {
              acc[name] = { amount, have: false, category };
            }
          } else {
            const fullName = `${amount} ${name}`;
            if (!acc[fullName]) {
              acc[fullName] = { amount: '', have: false, category };
            }
          }
          return acc;
        }, {} as IngredientState);

      if (savedIngredientState) {
        const parsedIngredientState = JSON.parse(savedIngredientState) as IngredientState;
        Object.keys(allIngredients).forEach(key => {
          if (parsedIngredientState[key]) {
            allIngredients[key].have = parsedIngredientState[key].have;
          }
        });
      }
      setIngredients(allIngredients);
    }
  }, [enabledMeals]);

  const addAmounts = (amount1: string, amount2: string): string => {
    const num1 = parseFloat(amount1);
    const num2 = parseFloat(amount2);
    if (!isNaN(num1) && !isNaN(num2)) {
      return (num1 + num2).toString();
    }
    return amount1; // Return the original amount if addition is not possible
  };

  const toggleIngredient = (ingredient: string) => {
    setIngredients(prev => {
      const newIngredients = {
        ...prev,
        [ingredient]: { ...prev[ingredient], have: !prev[ingredient].have }
      };
      localStorage.setItem('ingredientState', JSON.stringify(newIngredients));
      return newIngredients;
    });
  };

  const copyMissingIngredients = () => {
    const missingIngredients = Object.entries(ingredients)
      .filter(([_, { have }]) => !have)
      .map(([name, { amount }]) => amount ? `${amount} ${name}` : name)
      .join('\n');
    navigator.clipboard.writeText(missingIngredients);
    alert('Copied to clipboard');
  };

  const missingIngredientsCount = Object.values(ingredients).filter(({ have }) => !have).length;

  const categorizedIngredients = Object.entries(ingredients).reduce((acc, [name, info]) => {
    if (!acc[info.category]) {
      acc[info.category] = [];
    }
    acc[info.category].push({ name, ...info });
    return acc;
  }, {} as Record<IngredientCategory, { name: string; amount: string; have: boolean }[]>);

  const setAllIngredients = (have: boolean) => {
    setIngredients(prev => {
      const newIngredients = Object.entries(prev).reduce((acc, [name, info]) => {
        acc[name] = { ...info, have };
        return acc;
      }, {} as IngredientState);
      localStorage.setItem('ingredientState', JSON.stringify(newIngredients));
      return newIngredients;
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2>weekly ingredients</h2>
          <div className="bulk-actions">
            <button onClick={() => setAllIngredients(true)} className="modal-button secondary-button">
              have all
            </button>
            <button onClick={() => setAllIngredients(false)} className="modal-button secondary-button">
              don't have all
            </button>
          </div>
        </div>
        <div className="modal-body">
          {Object.entries(categorizedIngredients).map(([category, categoryIngredients]) => (
            <div key={category} className="ingredient-category">
              <h3>{category}</h3>
              <ul className="ingredient-list">
                {categoryIngredients.map(({ name, amount, have }) => (
                  <li key={name} className="ingredient-item">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={have}
                        onChange={() => toggleIngredient(name)}
                      />
                      <span className="slider"></span>
                    </label>
                    <span className={`ingredient-name ${have ? 'have' : 'dont-have'}`}>
                      {amount ? `${amount} ${name}` : name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="modal-footer">
        {missingIngredientsCount > 0 && (
            <button onClick={copyMissingIngredients} className="modal-button primary-button">
              copy to clipboard ({missingIngredientsCount})
            </button>
          )}
          <button onClick={onClose} className="modal-button secondary-button">close</button>
        </div>
      </div>
    </div>
  );
}