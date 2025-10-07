import { useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { ChatEmptyState } from './components/ChatEmptyState';
import { ChatHeader } from './components/ChatHeader';
import { ChatInput } from './components/ChatInput';
import { ChatMessage } from './components/ChatMessage';
import { ChatTypingIndicator } from './components/ChatTypingIndicator';

const chat = tv({
  slots: {
    container: 'fixed bottom-4 right-4 z-50 flex flex-col',
    toggleButton: 'ml-auto rounded-full p-4 shadow-lg transition-all hover:scale-105',
    icon: 'h-6 w-6',
    window: 'mb-4 flex flex-col rounded-lg border shadow-xl transition-all',
    messagesContainer: 'flex-1 overflow-y-auto p-4 space-y-4'
  },
  variants: {
    variant: {
      light: {
        toggleButton: 'bg-blue-600 text-white hover:bg-blue-700',
        window: 'bg-white border-gray-200 text-gray-900',
        messagesContainer: 'bg-gray-50'
      },
      dark: {
        toggleButton: 'bg-blue-500 text-white hover:bg-blue-600',
        window: 'bg-gray-900 border-gray-700 text-white',
        messagesContainer: 'bg-gray-950'
      }
    }
  }
});

export type ChatMessage = {
  readonly id: string;
  readonly type: 'user' | 'assistant';
  readonly text: string;
  readonly timestamp: Date;
}

interface ChatProps {
  readonly variant?: 'light' | 'dark';
  readonly className?: string;
  readonly onSendMessage?: (message: string) => void;
  readonly messages?: ChatMessage[];
  readonly isTyping?: boolean;
  readonly placeholder?: string;
  readonly title?: string;
  readonly subtitle?: string;
}

export function Chat({
  variant = 'light',
  className = '',
  onSendMessage,
  messages = [],
  isTyping = false,
  placeholder = 'Type your message...',
  title = 'AI Assistant',
  subtitle = 'Powered by Chrome Built-in AI'
}: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { container, toggleButton, icon, window, messagesContainer } = chat({ variant });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <div className={`${container()} ${className}`}>
      {isOpen && (
        <div className={window()} style={{ width: '384px', height: '600px' }}>
          <ChatHeader
            variant={variant}
            title={title}
            subtitle={subtitle}
            onClose={handleToggleChat}
          />

          <div className={messagesContainer()}>
            {messages.length === 0 && !isTyping ? (
              <ChatEmptyState variant={variant} />
            ) : (
              <>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                
                {isTyping && <ChatTypingIndicator variant={variant} />}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          <ChatInput
            variant={variant}
            placeholder={placeholder}
            onSend={handleSendMessage}
            disabled={isTyping}
            autoFocus={isOpen}
          />
        </div>
      )}

      <button
        onClick={handleToggleChat}
        className={toggleButton()}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
