import { useCallback, useState } from 'react';
import type { TranslationStatus } from '../components/TranslationStatusNotification';
import { languages } from '../constants/languages';
import translatorService from '../services/ai/translatorService';

interface UseTranslationStatusReturn {
  translations: TranslationStatus[];
  initializeTranslator: (languageCode: string) => Promise<void>;
  retryTranslator: (languageCode: string) => Promise<void>;
  dismissNotification: (languageCode: string) => void;
  clearAllNotifications: () => void;
  isTranslatorReady: (languageCode: string) => boolean;
  getTranslationProgress: (languageCode: string) => number;
}

export function useTranslationStatus(): UseTranslationStatusReturn {
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
        updateTranslationStatus(languageCode, { 
          status: 'error',
          error: 'Translation not supported for this language'
        });
        console.warn(`Translation from 'en' to '${languageCode}' is not supported ${availability}.`);
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

    } catch (error) {
      console.error(`Failed to initialize translator for ${languageCode}:`, error);
      updateTranslationStatus(languageCode, { 
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }, [updateTranslationStatus]);

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
  const calculateEstimatedTime = (progress: number): string => {
    if (progress <= 0) return 'Calculating...';
    if (progress >= 90) return 'Almost done';
    if (progress >= 50) return '30s';
    if (progress >= 25) return '1m';
    return '2m';
  };

  return {
    translations,
    initializeTranslator,
    retryTranslator,
    dismissNotification,
    clearAllNotifications,
    isTranslatorReady,
    getTranslationProgress
  };
}
