import { useContext } from 'react';
import { RecipeTranslationContext } from '../contexts/RecipeTranslationContext';

export function useRecipeTranslation() {
  const context = useContext(RecipeTranslationContext);
  
  if (!context) {
    throw new Error('useRecipeTranslation must be used within a RecipeTranslationProvider');
  }
  
  return context;
}
