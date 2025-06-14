import { useCallback, useState } from 'react';
import summarizerService from '../services/ai/summarizerService';
import type { Recipe } from '../types/recipe';

interface UseSummarizerReturn {
  summarizeRecipe: (recipe: Recipe) => Promise<void>;
  summarizeRecipeById: (recipeId: string) => Promise<void>;
  getSummary: (recipeId: string) => string | null;
  isLoading: (recipeId: string) => boolean;
  error: (recipeId: string) => string | null;
  clearError: (recipeId: string) => void;
  clearSummary: (recipeId: string) => void;
}

interface SummaryState {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
}

export function useSummarizer(): UseSummarizerReturn {
  const [summaryStates, setSummaryStates] = useState<Record<string, SummaryState>>({});

  const summarizeRecipe = useCallback(async (recipe: Recipe) => {
    const recipeId = recipe.id;
    
    // Set loading state
    setSummaryStates(prev => ({
      ...prev,
      [recipeId]: {
        summary: null,
        isLoading: true,
        error: null
      }
    }));

    try {
      const summary = await summarizerService.summarizeRecipe(recipe);
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary,
          isLoading: false,
          error: null
        }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarize recipe';
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary: null,
          isLoading: false,
          error: errorMessage
        }
      }));
    }
  }, []);

  const summarizeRecipeById = useCallback(async (recipeId: string) => {
    // Set loading state
    setSummaryStates(prev => ({
      ...prev,
      [recipeId]: {
        summary: null,
        isLoading: true,
        error: null
      }
    }));

    try {
      const summary = await summarizerService.summarizeRecipeById(recipeId);
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary,
          isLoading: false,
          error: null
        }
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to summarize recipe';
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary: null,
          isLoading: false,
          error: errorMessage
        }
      }));
    }
  }, []);

  const getSummary = useCallback((recipeId: string): string | null => {
    return summaryStates[recipeId]?.summary ?? null;
  }, [summaryStates]);

  const isLoading = useCallback((recipeId: string): boolean => {
    return summaryStates[recipeId]?.isLoading ?? false;
  }, [summaryStates]);

  const error = useCallback((recipeId: string): string | null => {
    return summaryStates[recipeId]?.error ?? null;
  }, [summaryStates]);

  const clearError = useCallback((recipeId: string) => {
    setSummaryStates(prev => ({
      ...prev,
      [recipeId]: {
        ...prev[recipeId],
        error: null
      }
    }));
  }, []);

  const clearSummary = useCallback((recipeId: string) => {
    setSummaryStates(prev => {
      const newState = { ...prev };
      delete newState[recipeId];
      return newState;
    });
  }, []);

  return {
    summarizeRecipe,
    summarizeRecipeById,
    getSummary,
    isLoading,
    error,
    clearError,
    clearSummary
  };
}
