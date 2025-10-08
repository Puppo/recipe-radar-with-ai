import { useCallback, useState, type ReactNode } from 'react';
import { SummarizerContext, type SummarizerContextValue } from '../contexts/SummarizerContext';
import summarizerService from '../services/ai/summarizerService';
import type { Recipe } from '../types/recipe';

interface SummarizerProviderProps {
  readonly children: ReactNode;
  readonly onError?: (error: Error, recipeId: string) => void;
}

interface SummaryState {
  summary: string | null;
  isLoading: boolean;
  error: string | null;
}

export function SummarizerProvider({
  children,
  onError
}: SummarizerProviderProps) {
  const [summaryStates, setSummaryStates] = useState<Record<string, SummaryState>>({});

  const summarizeRecipe = useCallback(async (recipe: Recipe) => {
    const recipeId = recipe.id;
    
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to summarize recipe';
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary: null,
          isLoading: false,
          error: errorMessage
        }
      }));

      onError?.(err instanceof Error ? err : new Error(errorMessage), recipeId);
    }
  }, [onError]);

  const summarizeRecipeById = useCallback(async (recipeId: string) => {
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to summarize recipe';
      
      setSummaryStates(prev => ({
        ...prev,
        [recipeId]: {
          summary: null,
          isLoading: false,
          error: errorMessage
        }
      }));

      onError?.(err instanceof Error ? err : new Error(errorMessage), recipeId);
    }
  }, [onError]);

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

  const value: SummarizerContextValue = {
    summarizeRecipe,
    summarizeRecipeById,
    getSummary,
    isLoading,
    error,
    clearError,
    clearSummary
  };

  return (
    <SummarizerContext.Provider value={value}>
      {children}
    </SummarizerContext.Provider>
  );
}
