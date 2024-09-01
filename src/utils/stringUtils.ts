export function extractRecipeNameFromUrl(url: string): string {
  try {
    const urlObject = new URL(url);
    const pathSegments = urlObject.pathname.split('/').filter(segment => segment.length > 0);
    
    // Remove common words and file extensions
    const cleanedSegments = pathSegments.map(segment => 
      segment.replace(/(-recipe|\.html?|\.php|\.aspx)$/i, '')
        .replace(/-/g, ' ')
    );

    // Find the longest segment, which is likely to be the recipe name
    let recipeName = cleanedSegments.reduce((a, b) => a.length > b.length ? a : b, '');

    // Capitalize first letter of each word
    recipeName = recipeName.replace(/\b\w/g, c => c.toUpperCase());

    return recipeName || 'Recipe';
  } catch (error) {
    // If URL parsing fails, return a default string
    return 'Recipe';
  }
}