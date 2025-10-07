import { createContext } from 'react';
import type { ChatMessage } from '../components/Chat';
import type { PromptApiOptions } from '../services/ai/promptApiService';

export interface PromptApiContextValue {
  messages: ChatMessage[];
  availability: Availability;
  isInitializing: boolean;
  isResponding: boolean;
  error: string | null;
  tokenInfo: {
    maxTokens: number | null;
    tokensLeft: number | null;
    tokensSoFar: number | null;
  };
  sendMessage: (message: string) => Promise<void>;
  sendMessageStreaming: (message: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  initializeSession: (options?: PromptApiOptions) => Promise<boolean>;
  destroySession: () => void;
}

export const PromptApiContext = createContext<PromptApiContextValue | null>(null);
