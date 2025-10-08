import { createContext } from 'react';
import type { TranslationStatus } from '../components/TranslationStatusNotification';

export interface TranslationStatusContextValue {
  translations: TranslationStatus[];
  initializeTranslator: (languageCode: string) => Promise<void>;
  retryTranslator: (languageCode: string) => Promise<void>;
  dismissNotification: (languageCode: string) => void;
  clearAllNotifications: () => void;
  isTranslatorReady: (languageCode: string) => boolean;
  getTranslationProgress: (languageCode: string) => number;
}

export const TranslationStatusContext = createContext<TranslationStatusContextValue | null>(null);
