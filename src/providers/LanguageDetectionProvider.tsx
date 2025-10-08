import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { languages } from '../constants/languages';
import { LanguageDetectionContext, type LanguageDetectionContextValue } from '../contexts/LanguageDetectionContext';
import languageDetectionService from '../services/ai/languageDetectionService';
import type { Recipe } from '../types/recipe';

type LanguageDetectionSupport = 'detecting' | 'detected' | 'unavailable';

interface LanguageDetectionProviderProps {
  readonly children: ReactNode;
  readonly autoInitialize?: boolean;
  readonly onError?: (error: Error) => void;
}

export function LanguageDetectionProvider({
  children,
  autoInitialize = true,
  onError
}: LanguageDetectionProviderProps) {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [supportsLanguageDetection, setSupportsLanguageDetection] = useState<LanguageDetectionSupport>('detecting');
  
  const hasAutoInitialized = useRef(false);

  // Check availability on mount
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const support = await languageDetectionService.checkLanguageDetectionSupport();
        setSupportsLanguageDetection(support !== 'unavailable' ? 'detected' : 'unavailable');
      } catch (err) {
        console.error('Failed to check language detection support:', err);
        setSupportsLanguageDetection('unavailable');
        onError?.(err instanceof Error ? err : new Error('Failed to check language detection support'));
      }
    };
    
    checkSupport();
  }, [onError]);

  const initializeDetector = useCallback(async (): Promise<boolean> => {
    if (supportsLanguageDetection === 'unavailable') {
      return false;
    }
    
    if (supportsLanguageDetection === 'detecting') {
      console.log('Waiting for language detection support check to complete...');
      return false;
    }

    try {
      setDetectionError(null);
      return await languageDetectionService.initializeDetector();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize language detector';
      setDetectionError(errorMessage);
      console.error('Language detector initialization failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return false;
    }
  }, [supportsLanguageDetection, onError]);

  // Auto-initialize if requested
  useEffect(() => {
    if (autoInitialize && supportsLanguageDetection === 'detected' && !hasAutoInitialized.current) {
      hasAutoInitialized.current = true;
      initializeDetector();
    }
  }, [autoInitialize, supportsLanguageDetection, initializeDetector]);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Language detection failed';
      setDetectionError(errorMessage);
      console.error('Recipe language detection failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return 'en';
    } finally {
      setIsDetecting(false);
    }
  }, [supportsLanguageDetection, onError]);

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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Browser language detection failed';
      setDetectionError(errorMessage);
      console.error('Browser language detection failed:', err);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return 'en';
    } finally {
      setIsDetecting(false);
    }
  }, [supportsLanguageDetection, onError]);

  const value: LanguageDetectionContextValue = {
    detectedLanguage,
    isDetecting,
    detectionError,
    supportsLanguageDetection,
    detectRecipeLanguage,
    detectBrowserLanguage,
    initializeDetector
  };

  return (
    <LanguageDetectionContext.Provider value={value}>
      {children}
    </LanguageDetectionContext.Provider>
  );
}
