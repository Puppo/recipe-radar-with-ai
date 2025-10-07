import { useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

const chat = tv({
  slots: {
    container: 'fixed bottom-4 right-4 z-50 flex flex-col',
    chatToggleButton: 'ml-auto rounded-full p-4 shadow-lg transition-all hover:scale-105',
    chatIcon: 'h-6 w-6',
    closeIcon: 'h-6 w-6',
    chatWindow: 'mb-4 flex flex-col rounded-lg border shadow-xl transition-all',
    header: 'flex items-center justify-between border-b p-4',
    headerContent: 'flex items-center gap-3',
    headerIcon: 'h-5 w-5',
    headerInfo: '',
    title: 'text-lg font-semibold',
    subtitle: 'text-xs',
    closeButton: 'rounded-md p-1 transition-colors',
    closeButtonIcon: 'h-5 w-5',
    messagesContainer: 'flex-1 overflow-y-auto p-4 space-y-4',
    messageWrapper: 'flex',
    messageBubble: 'max-w-[80%] rounded-lg px-4 py-2 break-words',
    messageText: 'text-sm',
    messageTime: 'mt-1 text-xs opacity-70',
    inputContainer: 'border-t p-4',
    inputWrapper: 'flex gap-2',
    input: 'flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors',
    sendButton: 'rounded-md p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    sendIcon: 'h-5 w-5',
    emptyState: 'flex flex-col items-center justify-center h-full text-center p-8',
    emptyIcon: 'h-16 w-16 mb-4 opacity-50',
    emptyTitle: 'text-lg font-semibold mb-2',
    emptyText: 'text-sm opacity-70',
    typingIndicator: 'flex items-center gap-1 px-4 py-2 rounded-lg max-w-[80%]',
    typingDot: 'h-2 w-2 rounded-full animate-bounce'
  },
  variants: {
    variant: {
      light: {
        chatToggleButton: 'bg-blue-600 text-white hover:bg-blue-700',
        chatWindow: 'bg-white border-gray-200 text-gray-900',
        header: 'bg-blue-600 text-white border-blue-700',
        subtitle: 'text-blue-100',
        closeButton: 'hover:bg-blue-700',
        messagesContainer: 'bg-gray-50',
        input: 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
        sendButton: 'bg-blue-600 text-white hover:bg-blue-700',
        emptyTitle: 'text-gray-900',
        emptyText: 'text-gray-600',
        typingIndicator: 'bg-gray-200',
        typingDot: 'bg-gray-600'
      },
      dark: {
        chatToggleButton: 'bg-blue-500 text-white hover:bg-blue-600',
        chatWindow: 'bg-gray-900 border-gray-700 text-white',
        header: 'bg-gray-800 text-white border-gray-700',
        subtitle: 'text-gray-400',
        closeButton: 'hover:bg-gray-700',
        messagesContainer: 'bg-gray-950',
        input: 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500',
        sendButton: 'bg-blue-600 text-white hover:bg-blue-700',
        emptyTitle: 'text-gray-100',
        emptyText: 'text-gray-400',
        typingIndicator: 'bg-gray-800',
        typingDot: 'bg-gray-400'
      }
    },
    messageType: {
      user: {
        messageWrapper: 'justify-end',
        messageBubble: 'bg-blue-600 text-white'
      },
      assistant: {
        messageWrapper: 'justify-start',
        messageBubble: 'bg-gray-200 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      }
    },
    open: {
      true: {},
      false: {}
    }
  }
});

export interface ChatMessage {
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
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    container,
    chatToggleButton,
    chatIcon,
    closeIcon,
    chatWindow,
    header,
    headerContent,
    headerIcon,
    headerInfo,
    title: titleClass,
    subtitle: subtitleClass,
    closeButton,
    closeButtonIcon,
    messagesContainer,
    messageText,
    messageTime,
    inputContainer,
    inputWrapper,
    input,
    sendButton,
    sendIcon,
    emptyState,
    emptyIcon,
    emptyTitle,
    emptyText,
    typingIndicator,
    typingDot
  } = chat({ variant, open: isOpen });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`${container()} ${className}`}>
      {isOpen && (
        <div className={chatWindow()} style={{ width: '384px', height: '600px' }}>
          {/* Header */}
          <div className={header()}>
            <div className={headerContent()}>
              <svg className={headerIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <div className={headerInfo()}>
                <h3 className={titleClass()}>{title}</h3>
                <p className={subtitleClass()}>{subtitle}</p>
              </div>
            </div>
            <button
              onClick={handleToggleChat}
              className={closeButton()}
              aria-label="Close chat"
            >
              <svg className={closeButtonIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={messagesContainer()}>
            {messages.length === 0 && !isTyping ? (
              <div className={emptyState()}>
                <svg className={emptyIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h4 className={emptyTitle()}>Start a Conversation</h4>
                <p className={emptyText()}>
                  Ask me anything about recipes, cooking tips, or ingredients!
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => {
                  const { messageWrapper, messageBubble } = chat({ 
                    variant, 
                    messageType: message.type 
                  });
                  
                  return (
                    <div key={message.id} className={messageWrapper()}>
                      <div className={messageBubble()}>
                        <p className={messageText()}>{message.text}</p>
                        <p className={messageTime()}>{formatTime(message.timestamp)}</p>
                      </div>
                    </div>
                  );
                })}
                
                {isTyping && (
                  <div className={chat({ variant, messageType: 'assistant' }).messageWrapper()}>
                    <div className={typingIndicator()}>
                      <div className={typingDot()} style={{ animationDelay: '0ms' }}></div>
                      <div className={typingDot()} style={{ animationDelay: '150ms' }}></div>
                      <div className={typingDot()} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className={inputContainer()}>
            <div className={inputWrapper()}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className={input()}
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className={sendButton()}
                aria-label="Send message"
              >
                <svg className={sendIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={handleToggleChat}
        className={chatToggleButton()}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className={closeIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className={chatIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>
    </div>
  );
}
