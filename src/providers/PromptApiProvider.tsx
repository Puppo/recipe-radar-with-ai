import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ChatMessage } from '../components/Chat';
import { PromptApiContext, type PromptApiContextValue } from '../contexts/PromptApiContext';
import { PromptApiService } from '../services/ai/promptApiService';

interface PromptApiProviderProps {
  readonly children: ReactNode;
  readonly systemPrompt?: string;
  readonly temperature?: number;
  readonly topK?: number;
  readonly autoInitialize?: boolean;
  readonly onError?: (error: Error) => void;
  readonly onMessageReceived?: (message: ChatMessage) => void;
}

export function PromptApiProvider({
  children,
  systemPrompt,
  temperature,
  topK,
  autoInitialize = true,
  onError,
  onMessageReceived
}: PromptApiProviderProps) {
  const promptApiService = useRef(new PromptApiService());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [availability, setAvailability] = useState<Availability>('downloading');
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResponding, setIsResponding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<{
    maxTokens: number | null;
    tokensLeft: number | null;
    tokensSoFar: number | null;
  }>({
    maxTokens: null,
    tokensLeft: null,
    tokensSoFar: null
  });

  const messageIdCounter = useRef(0);
  const currentStreamingMessageId = useRef<string | null>(null);
  const hasAutoInitialized = useRef(false);

  const sessionOptions: LanguageModelCreateOptions = {
    temperature,
    topK,
    initialPrompts: systemPrompt ? [{
      role: 'system',
      content: systemPrompt
    }] : []
  };

  // Check availability on mount
  useEffect(() => {
    const checkAvailability = async () => {
      try {
        const capabilities = await promptApiService.current.checkAvailability();
        
        setAvailability(capabilities);
      } catch (err) {
        console.error('Failed to check Prompt API availability:', err);
        setAvailability('unavailable');
      }
    };

    checkAvailability();
  }, []);

  const updateTokenInfo = useCallback(() => {
    // Token info methods can be added to service if needed
    setTokenInfo({
      maxTokens: null,
      tokensLeft: null,
      tokensSoFar: null
    });
  }, []);

  const initializeSession = useCallback(async (opts?: LanguageModelCreateOptions): Promise<boolean> => {
    if (availability === 'unavailable') {
      const errorMsg = 'Prompt API is not available in this browser';
      setError(errorMsg);
      onError?.(new Error(errorMsg));
      return false;
    }

    setIsInitializing(true);
    setError(null);

    try {
      await promptApiService.current.createSession(opts || sessionOptions);
      updateTokenInfo();
      setIsInitializing(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize AI session';
      setError(errorMessage);
      setIsInitializing(false);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      return false;
    }
  }, [availability, sessionOptions, onError, updateTokenInfo]);

  // Auto-initialize if requested
  useEffect(() => {
    if (autoInitialize && availability === 'available' && !hasAutoInitialized.current && !isInitializing) {
      hasAutoInitialized.current = true;
      initializeSession(sessionOptions);
    }
  }, [autoInitialize, availability, isInitializing, initializeSession, sessionOptions]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => prev.concat([message]));
    onMessageReceived?.(message);
  }, [onMessageReceived]);

  const updateLastMessage = useCallback((text: string) => {
    setMessages(prev => {
      const newMessages = prev.concat([]);
      if (newMessages.length > 0) {
        const lastMessage = newMessages[newMessages.length - 1];
        newMessages[newMessages.length - 1] = {
          ...lastMessage,
          text: lastMessage.text + text
        };
      }
      return newMessages;
    });
  }, []);

  const sendMessage = useCallback(async (message: string): Promise<void> => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${++messageIdCounter.current}`,
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsResponding(true);
    setError(null);

    try {
      const response = await promptApiService.current.prompt(message, sessionOptions);
      updateTokenInfo();

      const assistantMessage: ChatMessage = {
        id: `assistant-${++messageIdCounter.current}`,
        type: 'assistant',
        text: response,
        timestamp: new Date()
      };

      addMessage(assistantMessage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsResponding(false);
    }
  }, [sessionOptions, addMessage, updateTokenInfo, onError]);

  const sendMessageStreaming = useCallback(async (message: string): Promise<void> => {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${++messageIdCounter.current}`,
      type: 'user',
      text: message.trim(),
      timestamp: new Date()
    };

    addMessage(userMessage);
    setIsResponding(true);
    setError(null);

    // Create placeholder for streaming response
    const assistantMessageId = `assistant-${++messageIdCounter.current}`;
    currentStreamingMessageId.current = assistantMessageId;

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      type: 'assistant',
      text: '',
      timestamp: new Date()
    };

    addMessage(assistantMessage);

    try {
      await promptApiService.current.promptStreaming(
        message,
        (chunk: string) => {
          updateLastMessage(chunk);
        },
        sessionOptions
      );

      updateTokenInfo();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));

      // Remove the empty assistant message on error
      setMessages(prev => prev.filter(m => m.id !== assistantMessageId));
    } finally {
      setIsResponding(false);
      currentStreamingMessageId.current = null;
    }
  }, [sessionOptions, addMessage, updateLastMessage, updateTokenInfo, onError]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    messageIdCounter.current = 0;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const destroySession = useCallback(() => {
    promptApiService.current.destroySession();
    setTokenInfo({
      maxTokens: null,
      tokensLeft: null,
      tokensSoFar: null
    });
  }, []);

  const value: PromptApiContextValue = {
    messages,
    availability,
    isInitializing,
    isResponding,
    error,
    tokenInfo,
    sendMessage,
    sendMessageStreaming,
    clearMessages,
    clearError,
    initializeSession,
    destroySession
  };

  useEffect(() => destroySession, []);

  return (
    <PromptApiContext.Provider value={value}>
      {children}
    </PromptApiContext.Provider>
  );
}
