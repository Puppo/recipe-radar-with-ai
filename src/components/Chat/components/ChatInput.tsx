import { useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';

const chatInput = tv({
  slots: {
    container: 'border-t p-4',
    wrapper: 'flex gap-2',
    input: 'flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 transition-colors',
    button: 'rounded-md p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
    icon: 'h-5 w-5 transition-transform',
    iconEnabled: 'h-5 w-5 transition-transform rotate-90'
  },
  variants: {
    variant: {
      light: {
        input: 'bg-white border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500',
        button: 'bg-blue-600 text-white hover:bg-blue-700'
      },
      dark: {
        input: 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500',
        button: 'bg-blue-600 text-white hover:bg-blue-700'
      }
    }
  }
});

interface ChatInputProps {
  readonly variant?: 'light' | 'dark';
  readonly placeholder?: string;
  readonly onSend: (message: string) => void;
  readonly disabled?: boolean;
  readonly autoFocus?: boolean;
}

export function ChatInput({ 
  variant = 'light', 
  placeholder = 'Type your message...', 
  onSend,
  disabled = false,
  autoFocus = false
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { container, wrapper, input, button, icon, iconEnabled } = chatInput({ variant });

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSend(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={container()}>
      <div className={wrapper()}>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={handleKeyUp}
          placeholder={placeholder}
          className={input()}
          disabled={disabled}
        />
        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          className={button()}
          aria-label="Send message"
        >
          <svg 
            className={inputValue.trim() && !disabled ? iconEnabled() : icon()} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
