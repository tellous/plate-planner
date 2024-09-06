export type IngredientCategory = string;

const DEFAULT_CATEGORIES: Record<IngredientCategory, string[]> = {
  meat: ['beef', 'chicken', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'shrimp', 'bacon', 'sausage'],
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'],
  produce: ['apple', 'banana', 'carrot', 'lettuce', 'tomato', 'onion', 'garlic', 'potato', 'pepper', 'broccoli', 'spinach', 'cucumber'],
  grains: ['rice', 'pasta', 'bread', 'flour', 'oats', 'cereal', 'quinoa'],
  pantry: ['oil', 'vinegar', 'sugar', 'salt', 'pepper', 'spice', 'herb', 'sauce', 'broth', 'stock', 'can', 'jar'],
  other: [],
};

export function getCategories(): Record<IngredientCategory, string[]> {
  const savedCategories = localStorage.getItem('ingredientCategories');
  return savedCategories ? JSON.parse(savedCategories) : DEFAULT_CATEGORIES;
}

export function saveCategories(categories: Record<IngredientCategory, string[]>) {
  localStorage.setItem('ingredientCategories', JSON.stringify(categories));
}

export function categorizeIngredient(ingredient: string): IngredientCategory {
  const categories = getCategories();
  const words = ingredient.toLowerCase().split(' ');
  
  for (const word of words) {
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.includes(word) || keywords.includes(word + 's') || keywords.includes(word + 'es')) {
        return category as IngredientCategory;
      }
    }
  }
  
  return 'other';
}