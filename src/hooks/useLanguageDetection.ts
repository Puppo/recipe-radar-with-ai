import { useContext } from 'react';
import { LanguageDetectionContext } from '../contexts/LanguageDetectionContext';

export function useLanguageDetection() {
  const context = useContext(LanguageDetectionContext);
  
  if (!context) {
    throw new Error('useLanguageDetection must be used within a LanguageDetectionProvider');
  }
  
  return context;
}
