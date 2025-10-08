import { useContext } from 'react';
import { SummarizerContext } from '../contexts/SummarizerContext';

export function useSummarizer() {
  const context = useContext(SummarizerContext);
  
  if (!context) {
    throw new Error('useSummarizer must be used within a SummarizerProvider');
  }
  
  return context;
}
