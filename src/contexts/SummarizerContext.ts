import { createContext } from 'react';
import type { Recipe } from '../types/recipe';

export interface SummarizerContextValue {
  summarizeRecipe: (recipe: Recipe) => Promise<void>;
  summarizeRecipeById: (recipeId: string) => Promise<void>;
  getSummary: (recipeId: string) => string | null;
  isLoading: (recipeId: string) => boolean;
  error: (recipeId: string) => string | null;
  clearError: (recipeId: string) => void;
  clearSummary: (recipeId: string) => void;
}

export const SummarizerContext = createContext<SummarizerContextValue | null>(null);
