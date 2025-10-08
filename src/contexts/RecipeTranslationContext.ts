import { createContext } from 'react';
import type { Recipe, TranslatedRecipe } from '../types/recipe';

export interface RecipeTranslationContextValue {
  translatedRecipe: TranslatedRecipe | null;
  isTranslating: boolean;
  translationError: string | null;
  translateRecipe: (recipe: Recipe, targetLanguage: string) => Promise<void>;
  getDisplayContent: (language: string) => Omit<Recipe, 'id' | 'imageUrl' | 'servings'> | null;
  hasTranslationFor: (language: string) => boolean;
  clearTranslation: () => void;
}

export const RecipeTranslationContext = createContext<RecipeTranslationContextValue | null>(null);
