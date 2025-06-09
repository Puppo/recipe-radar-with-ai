import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';

/**
 * Hook for searching recipes with debounce
 */
export function useRecipeSearch(query: string) {
  // State for debounced query
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  // Debounce the query input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
  // Use React Query to fetch search results
  const { 
    data: results = [], 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['recipes', 'search', debouncedQuery],
    queryFn: () => recipeService.searchRecipes(debouncedQuery),
    enabled: debouncedQuery.trim().length > 0,
    placeholderData: [],
  });
  
  return { 
    results, 
    isLoading: debouncedQuery !== query || isLoading, // Show loading when debouncing
    error: error instanceof Error ? error.message : null 
  };
}

/**
 * Hook for fetching a recipe by ID
 */
export function useRecipeById(id: string | undefined) {
  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipe', id],
    queryFn: () => (id ? recipeService.getRecipeById(id) : null),
    enabled: !!id,
  });
  
  return { 
    recipe, 
    isLoading, 
    error: error instanceof Error ? error.message : null 
  };
}

/**
 * Hook for fetching all recipes
 */
export function useAllRecipes() {
  const {
    data: recipes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['recipes', 'all'],
    queryFn: recipeService.getAllRecipes,
  });
  
  return {
    recipes,
    isLoading,
    error: error instanceof Error ? error.message : null
  };
}
