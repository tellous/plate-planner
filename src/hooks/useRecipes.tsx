import { useState, useEffect } from 'react';

export interface Recipe {
  id: string;
  url: string;
  difficulty: number;
  mealTimes: MealTime[];
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner';

const EXAMPLE_RECIPES: Recipe[] = [
  // Breakfast recipes
  { id: '1', url: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/', difficulty: 3, mealTimes: ['breakfast'] },
  { id: '2', url: 'https://www.simplyrecipes.com/recipes/how_to_make_an_omelet/', difficulty: 4, mealTimes: ['breakfast'] },
  { id: '3', url: 'https://www.foodnetwork.com/recipes/alton-brown/steel-cut-oatmeal-recipe-1939448', difficulty: 2, mealTimes: ['breakfast'] },
  { id: '4', url: 'https://www.epicurious.com/recipes/food/views/avocado-toast-51226620', difficulty: 1, mealTimes: ['breakfast'] },
  { id: '5', url: 'https://www.bbcgoodfood.com/recipes/classic-french-toast', difficulty: 3, mealTimes: ['breakfast'] },
  { id: '6', url: 'https://www.seriouseats.com/perfect-scrambled-eggs-recipe', difficulty: 2, mealTimes: ['breakfast'] },
  { id: '7', url: 'https://www.thekitchn.com/how-to-make-a-frittata-cooking-lessons-from-the-kitchn-170717', difficulty: 5, mealTimes: ['breakfast'] },

  // Lunch recipes
  { id: '8', url: 'https://www.bonappetit.com/recipe/classic-caesar-salad', difficulty: 4, mealTimes: ['lunch'] },
  { id: '9', url: 'https://www.simplyrecipes.com/recipes/classic_blt_sandwich/', difficulty: 2, mealTimes: ['lunch'] },
  { id: '10', url: 'https://www.foodnetwork.com/recipes/ree-drummond/perfect-tomato-soup-3381883', difficulty: 3, mealTimes: ['lunch'] },
  { id: '11', url: 'https://www.epicurious.com/recipes/food/views/tuna-salad-sandwich-237630', difficulty: 1, mealTimes: ['lunch'] },
  { id: '12', url: 'https://www.bbcgoodfood.com/recipes/classic-chicken-caesar-salad', difficulty: 3, mealTimes: ['lunch'] },
  { id: '13', url: 'https://www.seriouseats.com/classic-grilled-cheese-sandwich-recipe', difficulty: 2, mealTimes: ['lunch'] },
  { id: '14', url: 'https://www.thekitchn.com/how-to-make-veggie-noodle-bowls-242003', difficulty: 4, mealTimes: ['lunch'] },

  // Dinner recipes
  { id: '15', url: 'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/', difficulty: 6, mealTimes: ['dinner'] },
  { id: '16', url: 'https://www.simplyrecipes.com/recipes/roast_chicken/', difficulty: 5, mealTimes: ['dinner'] },
  { id: '17', url: 'https://www.foodnetwork.com/recipes/ina-garten/beef-bourguignon-recipe-1942045', difficulty: 7, mealTimes: ['dinner'] },
  { id: '18', url: 'https://www.epicurious.com/recipes/food/views/grilled-salmon-with-lemon-and-dill', difficulty: 4, mealTimes: ['dinner'] },
  { id: '19', url: 'https://www.bbcgoodfood.com/recipes/spaghetti-carbonara-recipe', difficulty: 3, mealTimes: ['dinner'] },
  { id: '20', url: 'https://www.seriouseats.com/the-best-slow-cooked-bolognese-sauce-recipe', difficulty: 6, mealTimes: ['dinner'] },
  { id: '21', url: 'https://www.thekitchn.com/how-to-make-stir-fry-vegetables-cooking-lessons-from-the-kitchn-218111', difficulty: 3, mealTimes: ['dinner'] },
];

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(() => {
    const saved = localStorage.getItem('recipes');
    return saved ? JSON.parse(saved) : EXAMPLE_RECIPES;
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe: Omit<Recipe, 'id'>) => {
    const newRecipe = { ...recipe, id: Date.now().toString() };
    setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(r => r.id === id ? { ...r, ...updates } : r)
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== id));
  };

  const resetToDefault = () => {
    setRecipes(EXAMPLE_RECIPES);
  };

  return { recipes, addRecipe, updateRecipe, deleteRecipe, resetToDefault };
}