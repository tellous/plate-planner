import { Recipe } from '../hooks/useRecipes';

export async function exportData() {
  const recipes = localStorage.getItem('recipes');
  const weeklyRecipes = localStorage.getItem('weeklyRecipes');
  const ingredientState = localStorage.getItem('ingredientState');

  const data = {
    recipes: recipes ? JSON.parse(recipes) : [],
    weeklyRecipes: weeklyRecipes ? JSON.parse(weeklyRecipes) : [],
    ingredientState: ingredientState ? JSON.parse(ingredientState) : {},
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'plate_planner_data.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function importData(): Promise<boolean> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          if (data.recipes) localStorage.setItem('recipes', JSON.stringify(data.recipes));
          if (data.weeklyRecipes) localStorage.setItem('weeklyRecipes', JSON.stringify(data.weeklyRecipes));
          if (data.ingredientState) localStorage.setItem('ingredientState', JSON.stringify(data.ingredientState));
          
          resolve(true);
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Failed to import data. Please make sure the file is valid.');
          resolve(false);
        }
      } else {
        resolve(false);
      }
    };
    input.click();
  });
}