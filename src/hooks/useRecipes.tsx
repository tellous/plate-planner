import { useState, useEffect } from 'react';

export interface Recipe {
  id: string;
  name: string;
  url: string;
  difficulty: number;
  mealTimes: MealTime[];
  ingredients: string[];
}

export type MealTime = 'breakfast' | 'lunch' | 'dinner';

const EXAMPLE_RECIPES: Recipe[] = [
  // Breakfast recipes
  { id: '1', name: 'Good Old Fashioned Pancakes', url: 'https://www.allrecipes.com/recipe/21014/good-old-fashioned-pancakes/', difficulty: 3, mealTimes: ['breakfast'], ingredients: ['1 1/2 cups all-purpose flour', '3 1/2 teaspoons baking powder', '1/4 teaspoon salt', '1 tablespoon sugar', '1 1/4 cups milk', '1 egg', '3 tablespoons melted butter'] },
  { id: '2', name: 'How to Make an Omelet', url: 'https://www.simplyrecipes.com/recipes/how_to_make_an_omelet/', difficulty: 4, mealTimes: ['breakfast'], ingredients: ['3 eggs', '1 tablespoon butter', '2 tablespoons shredded cheese', 'Salt and pepper to taste', '1/4 cup diced ham (optional)'] },
  { id: '3', name: 'Steel Cut Oatmeal', url: 'https://www.foodnetwork.com/recipes/alton-brown/steel-cut-oatmeal-recipe-1939448', difficulty: 2, mealTimes: ['breakfast'], ingredients: ['1 cup steel cut oats', '3 cups water', '1 cup milk', '1/4 teaspoon salt', '1 tablespoon brown sugar'] },
  { id: '4', name: 'Avocado Toast', url: 'https://www.epicurious.com/recipes/food/views/avocado-toast-51226620', difficulty: 1, mealTimes: ['breakfast'], ingredients: ['2 slices whole grain bread', '1 ripe avocado', 'Salt and red pepper flakes to taste', '1 tablespoon olive oil'] },
  { id: '5', name: 'Classic French Toast', url: 'https://www.bbcgoodfood.com/recipes/classic-french-toast', difficulty: 3, mealTimes: ['breakfast'], ingredients: ['4 thick slices bread', '2 large eggs', '2/3 cup milk', '1 teaspoon vanilla extract', '2 tablespoons butter', 'Maple syrup for serving'] },
  { id: '6', name: 'Perfect Scrambled Eggs', url: 'https://www.seriouseats.com/perfect-scrambled-eggs-recipe', difficulty: 2, mealTimes: ['breakfast'], ingredients: ['6 large eggs', '2 tablespoons butter', 'Salt and pepper to taste', '1 tablespoon chopped chives'] },
  { id: '7', name: 'How to Make a Frittata', url: 'https://www.thekitchn.com/how-to-make-a-frittata-cooking-lessons-from-the-kitchn-170717', difficulty: 5, mealTimes: ['breakfast'], ingredients: ['8 large eggs', '1/3 cup milk', '1 cup chopped vegetables', '1 cup shredded cheese', '2 tablespoons olive oil', 'Salt and pepper to taste'] },

  // Lunch recipes
  { id: '8', name: 'Classic Caesar Salad', url: 'https://www.bonappetit.com/recipe/classic-caesar-salad', difficulty: 4, mealTimes: ['lunch'], ingredients: ['1 head romaine lettuce', '1/2 cup Caesar dressing', '1/4 cup grated Parmesan cheese', '1 cup croutons', '2 tablespoons lemon juice'] },
  { id: '9', name: 'Classic BLT Sandwich', url: 'https://www.simplyrecipes.com/recipes/classic_blt_sandwich/', difficulty: 2, mealTimes: ['lunch'], ingredients: ['4 slices bacon', '2 slices bread', '1 tomato, sliced', '2 lettuce leaves', '1 tablespoon mayonnaise'] },
  { id: '10', name: 'Perfect Tomato Soup', url: 'https://www.foodnetwork.com/recipes/ree-drummond/perfect-tomato-soup-3381883', difficulty: 3, mealTimes: ['lunch'], ingredients: ['2 cans (14.5 oz each) diced tomatoes', '1 cup chicken broth', '1/2 cup heavy cream', '2 tablespoons butter', '1 onion, diced', '2 cloves garlic, minced'] },
  { id: '11', name: 'Tuna Salad Sandwich', url: 'https://www.epicurious.com/recipes/food/views/tuna-salad-sandwich-237630', difficulty: 1, mealTimes: ['lunch'], ingredients: ['1 can (5 oz) tuna, drained', '1/4 cup mayonnaise', '1 celery stalk, chopped', '1 tablespoon red onion, minced', '2 slices bread'] },
  { id: '12', name: 'Classic Chicken Caesar Salad', url: 'https://www.bbcgoodfood.com/recipes/classic-chicken-caesar-salad', difficulty: 3, mealTimes: ['lunch'], ingredients: ['2 chicken breasts', '1 head romaine lettuce', '1/2 cup Caesar dressing', '1/4 cup grated Parmesan cheese', '1 cup croutons'] },
  { id: '13', name: 'Classic Grilled Cheese Sandwich', url: 'https://www.seriouseats.com/classic-grilled-cheese-sandwich-recipe', difficulty: 2, mealTimes: ['lunch'], ingredients: ['2 slices bread', '2 slices cheddar cheese', '2 tablespoons butter'] },
  { id: '14', name: 'Veggie Noodle Bowls', url: 'https://www.thekitchn.com/how-to-make-veggie-noodle-bowls-242003', difficulty: 4, mealTimes: ['lunch'], ingredients: ['2 zucchini, spiralized', '1 carrot, spiralized', '1 cup edamame', '1/4 cup peanut sauce', '1 tablespoon sesame seeds'] },

  // Dinner recipes
  { id: '15', name: 'World\'s Best Lasagna', url: 'https://www.allrecipes.com/recipe/23600/worlds-best-lasagna/', difficulty: 6, mealTimes: ['dinner'], ingredients: ['1 pound ground beef', '1 pound Italian sausage', '1 onion, chopped', '4 cloves garlic, minced', '1 can (28 oz) crushed tomatoes', '2 cans (6 oz each) tomato paste', '1 package lasagna noodles', '23 oz ricotta cheese', '1 egg', '1/2 cup grated Parmesan cheese', '3 cups shredded mozzarella cheese'] },
  { id: '16', name: 'Roast Chicken', url: 'https://www.simplyrecipes.com/recipes/roast_chicken/', difficulty: 5, mealTimes: ['dinner'], ingredients: ['1 whole chicken (3-4 lbs)', '2 tablespoons olive oil', '1 lemon', '4 cloves garlic', '1 tablespoon fresh rosemary', 'Salt and pepper to taste'] },
  { id: '17', name: 'Beef Bourguignon', url: 'https://www.foodnetwork.com/recipes/ina-garten/beef-bourguignon-recipe-1942045', difficulty: 7, mealTimes: ['dinner'], ingredients: ['3 pounds beef chuck, cubed', '1 bottle red wine', '2 cups beef broth', '1/2 pound bacon, diced', '1 pound carrots', '1 pound pearl onions', '1 pound mushrooms', '3 cloves garlic, minced', '1 tablespoon tomato paste', '1 bouquet garni (thyme, parsley, bay leaf)'] },
  { id: '18', name: 'Grilled Salmon with Lemon and Dill', url: 'https://www.epicurious.com/recipes/food/views/grilled-salmon-with-lemon-and-dill', difficulty: 4, mealTimes: ['dinner'], ingredients: ['4 salmon fillets', '2 lemons', '1/4 cup fresh dill', '2 tablespoons olive oil', 'Salt and pepper to taste'] },
  { id: '19', name: 'Spaghetti Carbonara', url: 'https://www.bbcgoodfood.com/recipes/spaghetti-carbonara-recipe', difficulty: 3, mealTimes: ['dinner'], ingredients: ['1 pound spaghetti', '3.5 oz pancetta or bacon, diced', '2 large eggs', '1 cup grated Pecorino Romano cheese', '1/2 cup grated Parmesan cheese', '2 cloves garlic, minced', 'Black pepper to taste'] },
  { id: '20', name: 'Slow-Cooked Bolognese Sauce', url: 'https://www.seriouseats.com/the-best-slow-cooked-bolognese-sauce-recipe', difficulty: 6, mealTimes: ['dinner'], ingredients: ['1 pound ground beef', '1 pound ground pork', '1 onion, finely chopped', '2 carrots, finely chopped', '2 celery stalks, finely chopped', '4 cloves garlic, minced', '1 can (28 oz) crushed tomatoes', '1 cup milk', '1 cup red wine', '2 bay leaves'] },
  { id: '21', name: 'Stir-Fry Vegetables', url: 'https://www.thekitchn.com/how-to-make-stir-fry-vegetables-cooking-lessons-from-the-kitchn-218111', difficulty: 3, mealTimes: ['dinner'], ingredients: ['2 cups mixed vegetables (bell peppers, broccoli, carrots, snap peas)', '2 tablespoons vegetable oil', '2 cloves garlic, minced', '1 tablespoon ginger, minced', '1/4 cup soy sauce', '1 tablespoon cornstarch', '1/4 cup water'] },
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

  const updateRecipe = (recipe: Recipe) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(r => r.id === recipe.id ? { ...r, ...recipe } : r)
    );
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prevRecipes => prevRecipes.filter(r => r.id !== id));
  };

  const resetToDefault = () => {
    setRecipes(EXAMPLE_RECIPES);
  };

  const deleteAllRecipes = () => {
    setRecipes([]);
  };

  return { recipes, addRecipe, updateRecipe, deleteRecipe, resetToDefault, deleteAllRecipes };
}