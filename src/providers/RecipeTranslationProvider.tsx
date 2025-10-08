import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { RecipeTranslationContext, type RecipeTranslationContextValue } from '../contexts/RecipeTranslationContext';
import translatorService from '../services/ai/translatorService';
import type { Recipe, TranslatedRecipe } from '../types/recipe';

interface RecipeTranslationProviderProps {
  readonly children: ReactNode;
  readonly onError?: (error: Error, targetLanguage: string) => void;
}

export function RecipeTranslationProvider({
  children,
  onError
}: RecipeTranslationProviderProps) {
  const [translatedRecipe, setTranslatedRecipe] = useState<TranslatedRecipe | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const translateRecipe = useCallback(async (recipe: Recipe, targetLanguage: string) => {
    if (!recipe) return;

    if (targetLanguage === 'en') {
      setTranslatedRecipe(recipe);
      return;
    }

    const currentTranslated = translatedRecipe || recipe;
    if (translatorService.hasTranslation(currentTranslated as TranslatedRecipe, targetLanguage)) {
      return;
    }

    try {
      setIsTranslating(true);
      setTranslationError(null);

      const translated = await translatorService.translateRecipe(recipe, targetLanguage);
      setTranslatedRecipe(translated);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setTranslationError(errorMessage);
      console.error('Recipe translation failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage), targetLanguage);
    } finally {
      setIsTranslating(false);
    }
  }, [translatedRecipe, onError]);

  const getDisplayContent = useCallback((language: string) => {
    if (!translatedRecipe) return null;
    return translatorService.getTranslatedContent(translatedRecipe, language);
  }, [translatedRecipe]);

  const hasTranslationFor = useCallback((language: string) => {
    if (!translatedRecipe) return false;
    return translatorService.hasTranslation(translatedRecipe, language);
  }, [translatedRecipe]);

  const clearTranslation = useCallback(() => {
    setTranslatedRecipe(null);
    setTranslationError(null);
  }, []);

  useEffect(() => {
    setTranslationError(null);
  }, [translatedRecipe]);

  const value: RecipeTranslationContextValue = {
    translatedRecipe,
    isTranslating,
    translationError,
    translateRecipe,
    getDisplayContent,
    hasTranslationFor,
    clearTranslation
  };

  return (
    <RecipeTranslationContext.Provider value={value}>
      {children}
    </RecipeTranslationContext.Provider>
  );
}
