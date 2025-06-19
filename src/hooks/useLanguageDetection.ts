import { useCallback, useEffect, useState } from 'react';
import { languages } from '../constants/languages';
import languageDetectionService from '../services/ai/languageDetectionService';
import type { Recipe } from '../types/recipe';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

interface UseLanguageDetectionReturn {
  detectedLanguage: string | null;
  isDetecting: boolean;
  detectionError: string | null;
  detectRecipeLanguage: (recipe: Recipe) => Promise<string>;
  detectBrowserLanguage: () => Promise<string>;
  supportsLanguageDetection: LanguageDetectionSupport;
  initializeDetector: () => Promise<boolean>;
}

export function useLanguageDetection(): UseLanguageDetectionReturn {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [supportsLanguageDetection, setSupportsLanguageDetection] = useState<LanguageDetectionSupport>('detecting');

  useEffect(() => {
    const checkSupport = async () => {
      try {
        const support = await languageDetectionService.checkLanguageDetectionSupport();
        setSupportsLanguageDetection(support !== 'unavailable' ? 'detected' : 'unavailable');
      } catch (error) {
        console.error('Failed to check language detection support:', error);
        setSupportsLanguageDetection('unavailable');
      }
    };
    
    checkSupport();
  }, []);

  const initializeDetector = useCallback(async (): Promise<boolean> => {
    if (supportsLanguageDetection === 'unavailable') return false;
    if (supportsLanguageDetection === 'detecting') {
      console.log('Waiting for language detection support check to complete...');
      return false;
    }

    try {
      setDetectionError(null);
      return await languageDetectionService.initializeDetector();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize language detector';
      setDetectionError(errorMessage);
      console.error('Language detector initialization failed:', error);
      return false;
    }
  }, [supportsLanguageDetection]);

  const detectRecipeLanguage = useCallback(async (recipe: Recipe): Promise<string> => {
    if (supportsLanguageDetection !== 'detected') {
      return 'en';
    }

    try {
      setIsDetecting(true);
      setDetectionError(null);

      const detectedLang = await languageDetectionService.detectRecipeLanguage(recipe);
      setDetectedLanguage(detectedLang);
      
      const isSupported = languages.some(lang => lang.code === detectedLang);
      if (!isSupported) {
        console.warn(`Detected language '${detectedLang}' is not supported, using English`);
        return 'en';
      }

      return detectedLang;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Language detection failed';
      setDetectionError(errorMessage);
      console.error('Recipe language detection failed:', error);
      return 'en';
    } finally {
      setIsDetecting(false);
    }
  }, [supportsLanguageDetection]);

  const detectBrowserLanguage = useCallback(async (): Promise<string> => {
    if (supportsLanguageDetection !== 'detected') {
      const browserLang = navigator.language || navigator.languages?.[0];
      if (browserLang) {
        const langCode = browserLang.split('-')[0];
        const supportedLang = languages.find(lang => lang.code === langCode);
        if (supportedLang) {
          return supportedLang.code;
        }
      }
      return 'en';
    }

    try {
      setIsDetecting(true);
      setDetectionError(null);

      const detectedLang = await languageDetectionService.detectBrowserLanguage();
      setDetectedLanguage(detectedLang);
      
      const isSupported = languages.some(lang => lang.code === detectedLang);
      if (!isSupported) {
        console.warn(`Detected language '${detectedLang}' is not supported, using English`);
        return 'en';
      }

      return detectedLang;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Browser language detection failed';
      setDetectionError(errorMessage);
      console.error('Browser language detection failed:', error);
      return 'en';
    } finally {
      setIsDetecting(false);
    }
  }, [supportsLanguageDetection]);

  useEffect(() => {
    initializeDetector();
  }, [initializeDetector]);

  return {
    detectedLanguage,
    isDetecting,
    detectionError,
    detectRecipeLanguage,
    detectBrowserLanguage,
    supportsLanguageDetection,
    initializeDetector
  };
}
