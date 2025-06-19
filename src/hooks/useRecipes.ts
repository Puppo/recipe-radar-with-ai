import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { recipeService } from '../services/recipeService';


export function useRecipeSearch(query: string) {
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);
  
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
    isLoading: debouncedQuery !== query || isLoading,
    error: error instanceof Error ? error.message : null 
  };
}

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
