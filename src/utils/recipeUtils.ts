import { Recipe } from '../hooks/useRecipes';

export async function enrichRecipeWithIngredients(recipe: Recipe): Promise<Recipe> {
  // If the recipe already has ingredients, return it as is
  if (recipe.ingredients && recipe.ingredients.length > 0) {
    return recipe;
  }
  // Otherwise, return the recipe with an empty ingredients array
  return { ...recipe, ingredients: [] };
}