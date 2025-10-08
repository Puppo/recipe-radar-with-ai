import { useContext } from 'react';
import { TranslationStatusContext } from '../contexts/TranslationStatusContext';

export function useTranslationStatus() {
  const context = useContext(TranslationStatusContext);
  
  if (!context) {
    throw new Error('useTranslationStatus must be used within a TranslationStatusProvider');
  }
  
  return context;
}
