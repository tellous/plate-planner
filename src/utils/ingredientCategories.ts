export type IngredientCategory = string;

const categoryKeywords: Record<IngredientCategory, string[]> = {
  meat: ['beef', 'chicken', 'pork', 'lamb', 'turkey', 'fish', 'salmon', 'shrimp', 'bacon', 'sausage'],
  dairy: ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg'],
  produce: ['apple', 'banana', 'carrot', 'lettuce', 'tomato', 'onion', 'garlic', 'potato', 'pepper', 'broccoli', 'spinach', 'cucumber'],
  grains: ['rice', 'pasta', 'bread', 'flour', 'oats', 'cereal', 'quinoa'],
  pantry: ['oil', 'vinegar', 'sugar', 'salt', 'pepper', 'spice', 'herb', 'sauce', 'broth', 'stock', 'can', 'jar'],
  other: [],
};

export function categorizeIngredient(ingredient: string): IngredientCategory {
  const words = ingredient.toLowerCase().split(' ');
  
  for (const word of words) {
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.includes(word)) {
        return category as IngredientCategory;
      }
    }
  }
  
  return 'Other';
}