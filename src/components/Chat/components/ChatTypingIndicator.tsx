import { tv } from 'tailwind-variants';

const chatTypingIndicator = tv({
  slots: {
    wrapper: 'flex justify-start',
    container: 'flex items-center gap-1 px-4 py-2 rounded-lg max-w-[80%]',
    dot: 'h-2 w-2 rounded-full animate-bounce'
  },
  variants: {
    variant: {
      light: {
        container: 'bg-gray-200',
        dot: 'bg-gray-600'
      },
      dark: {
        container: 'bg-gray-800',
        dot: 'bg-gray-400'
      }
    }
  }
});

interface ChatTypingIndicatorProps {
  readonly variant?: 'light' | 'dark';
}

export function ChatTypingIndicator({ variant = 'light' }: ChatTypingIndicatorProps) {
  const { wrapper, container, dot } = chatTypingIndicator({ variant });

  return (
    <div className={wrapper()}>
      <div className={container()}>
        <div className={dot()} style={{ animationDelay: '0ms' }}></div>
        <div className={dot()} style={{ animationDelay: '150ms' }}></div>
        <div className={dot()} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
}
