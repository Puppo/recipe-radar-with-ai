import { useContext } from 'react';
import { PromptApiContext } from '../contexts/PromptApiContext';

export function usePromptApi() {
  const context = useContext(PromptApiContext);
  
  if (!context) {
    throw new Error('usePromptApi must be used within a PromptApiProvider');
  }
  
  return context;
}
