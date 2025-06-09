import { useEffect, useState } from 'react';
import { recipes } from '../data/recipes';
import type { Recipe, RecipePreview } from '../types/recipe';

export function useRecipeSearch(query: string) {
  const [results, setResults] = useState<RecipePreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't search for empty queries
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call with a timeout
    const timeoutId = setTimeout(() => {
      try {
        const lowerQuery = query.toLowerCase();
        
        // Separate the filter logic for clarity
        const filteredRecipes = recipes.filter((recipe) => 
          recipe.name.toLowerCase().includes(lowerQuery) ||
          recipe.description.toLowerCase().includes(lowerQuery) ||
          recipe.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
          
        const searchResults = filteredRecipes.map(({ id, name, description, imageUrl }): RecipePreview => ({
          id,
          name,
          description,
          imageUrl,
        }));

        setResults(searchResults);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to search recipes');
        setIsLoading(false);
      }
    }, 500); // Debounce for 500ms

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { results, isLoading, error };
}

export function useRecipeById(id: string | undefined) {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setRecipe(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API call with a timeout
    const timeoutId = setTimeout(() => {
      try {
        const foundRecipe = recipes.find(recipe => recipe.id === id) || null;
        
        if (!foundRecipe) {
          setError('Recipe not found');
        }
        
        setRecipe(foundRecipe);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to fetch recipe');
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [id]);

  return { recipe, isLoading, error };
}
