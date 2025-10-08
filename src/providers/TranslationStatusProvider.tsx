import { useCallback, useState, type ReactNode } from 'react';
import type { TranslationStatus } from '../components/TranslationStatusNotification';
import { languages } from '../constants/languages';
import { TranslationStatusContext, type TranslationStatusContextValue } from '../contexts/TranslationStatusContext';
import translatorService from '../services/ai/translatorService';

interface TranslationStatusProviderProps {
  readonly children: ReactNode;
  readonly onError?: (error: Error, languageCode: string) => void;
}

export function TranslationStatusProvider({
  children,
  onError
}: TranslationStatusProviderProps) {
  const [translations, setTranslations] = useState<TranslationStatus[]>(() =>
    languages.map(lang => ({
      language: lang.name,
      languageCode: lang.code,
      flag: lang.flag,
      status: lang.code === 'en' ? 'ready' : 'idle'
    }))
  );

  const updateTranslationStatus = useCallback((
    languageCode: string, 
    updates: Partial<TranslationStatus>
  ) => {
    setTranslations(prev => 
      prev.map(t => 
        t.languageCode === languageCode 
          ? { ...t, ...updates }
          : t
      )
    );
  }, []);

  const calculateEstimatedTime = useCallback((progress: number): string => {
    if (progress <= 0) return 'Calculating...';
    if (progress >= 90) return 'Almost done';
    if (progress >= 50) return '30s';
    if (progress >= 25) return '1m';
    return '2m';
  }, []);

  const initializeTranslator = useCallback(async (languageCode: string) => {
    if (languageCode === 'en' || translatorService.languageMap[languageCode]) {
      return;
    }

    const language = languages.find(l => l.code === languageCode);
    if (!language) return;

    try {
      updateTranslationStatus(languageCode, { 
        status: 'checking',
        error: undefined,
        dismissed: false
      });

      const availability = await translatorService.isTranslationBetweenLanguagesSupported('en', languageCode);
      
      if (availability === 'unavailable') {
        const errorMsg = 'Translation not supported for this language';
        updateTranslationStatus(languageCode, { 
          status: 'error',
          error: errorMsg
        });
        console.warn(`Translation from 'en' to '${languageCode}' is not supported ${availability}.`);
        onError?.(new Error(errorMsg), languageCode);
        return;
      }

      updateTranslationStatus(languageCode, { 
        status: 'downloading',
        progress: 0
      });

      const translator = await Translator.create({
        sourceLanguage: 'en',
        targetLanguage: languageCode,
        monitor(m) {
          m.addEventListener('downloadprogress', (e) => {
            const progress = Math.round(e.loaded * 100);
            updateTranslationStatus(languageCode, { 
              progress,
              downloadSize: e.total ? `${Math.round(e.total / 1024 / 1024)}MB` : undefined,
              estimatedTime: calculateEstimatedTime(progress)
            });
          });
        },
      });

      translatorService.setTranslator(languageCode, translator);

      updateTranslationStatus(languageCode, { 
        status: 'ready',
        progress: 100
      });

    } catch (err) {
      console.error(`Failed to initialize translator for ${languageCode}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      updateTranslationStatus(languageCode, { 
        status: 'error',
        error: errorMessage
      });
      onError?.(err instanceof Error ? err : new Error(errorMessage), languageCode);
    }
  }, [updateTranslationStatus, calculateEstimatedTime, onError]);

  const retryTranslator = useCallback(async (languageCode: string) => {
    updateTranslationStatus(languageCode, { 
      status: 'idle',
      error: undefined,
      progress: undefined,
      dismissed: false
    });
    
    await initializeTranslator(languageCode);
  }, [initializeTranslator, updateTranslationStatus]);

  const dismissNotification = useCallback((languageCode: string) => {
    updateTranslationStatus(languageCode, { 
      dismissed: true
    });
  }, [updateTranslationStatus]);

  const clearAllNotifications = useCallback(() => {
    setTranslations(prev => 
      prev.map(translation => ({ 
        ...translation, 
        dismissed: true 
      }))
    );
  }, []);

  const isTranslatorReady = useCallback((languageCode: string) => {
    return languageCode === 'en' || !!translatorService.languageMap[languageCode];
  }, []);

  const getTranslationProgress = useCallback((languageCode: string) => {
    const translation = translations.find(t => t.languageCode === languageCode);
    return translation?.progress ?? 0;
  }, [translations]);

  const value: TranslationStatusContextValue = {
    translations,
    initializeTranslator,
    retryTranslator,
    dismissNotification,
    clearAllNotifications,
    isTranslatorReady,
    getTranslationProgress
  };

  return (
    <TranslationStatusContext.Provider value={value}>
      {children}
    </TranslationStatusContext.Provider>
  );
}
