import { createContext } from 'react';
import type { Recipe } from '../types/recipe';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

export interface LanguageDetectionContextValue {
  detectedLanguage: string | null;
  isDetecting: boolean;
  detectionError: string | null;
  supportsLanguageDetection: LanguageDetectionSupport;
  detectRecipeLanguage: (recipe: Recipe) => Promise<string>;
  detectBrowserLanguage: () => Promise<string>;
  initializeDetector: () => Promise<boolean>;
}

export const LanguageDetectionContext = createContext<LanguageDetectionContextValue | null>(null);
