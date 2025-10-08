import { useCallback, useEffect, useState } from 'react';
import translatorService from '../services/ai/translatorService';
import type { Recipe, TranslatedRecipe } from '../types/recipe';

interface UseRecipeTranslationReturn {
  translatedRecipe: TranslatedRecipe | null;
  isTranslating: boolean;
  translationError: string | null;
  translateRecipe: (recipe: Recipe, targetLanguage: string) => Promise<void>;
  getDisplayContent: (language: string) => Omit<Recipe, 'id' | 'imageUrl' | 'servings'> | null;
  hasTranslationFor: (language: string) => boolean;
}

export function useRecipeTranslation(): UseRecipeTranslationReturn {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Translation failed';
      setTranslationError(errorMessage);
      console.error('Recipe translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  }, [translatedRecipe]);

  const getDisplayContent = useCallback((language: string) => {
    if (!translatedRecipe) return null;
    return translatorService.getTranslatedContent(translatedRecipe, language);
  }, [translatedRecipe]);

  const hasTranslationFor = useCallback((language: string) => {
    if (!translatedRecipe) return false;
    return translatorService.hasTranslation(translatedRecipe, language);
  }, [translatedRecipe]);

  useEffect(() => {
    setTranslationError(null);
  }, [translatedRecipe]);

  return {
    translatedRecipe,
    isTranslating,
    translationError,
    translateRecipe,
    getDisplayContent,
    hasTranslationFor
  };
}
