import { tv } from 'tailwind-variants';

const chatEmptyState = tv({
  slots: {
    container: 'flex flex-col items-center justify-center h-full text-center p-8',
    icon: 'h-16 w-16 mb-4 opacity-50',
    title: 'text-lg font-semibold mb-2',
    text: 'text-sm opacity-70'
  },
  variants: {
    variant: {
      light: {
        title: 'text-gray-900',
        text: 'text-gray-600'
      },
      dark: {
        title: 'text-gray-100',
        text: 'text-gray-400'
      }
    }
  }
});

interface ChatEmptyStateProps {
  readonly variant?: 'light' | 'dark';
}

export function ChatEmptyState({ variant = 'light' }: ChatEmptyStateProps) {
  const { container, icon, title, text } = chatEmptyState({ variant });

  return (
    <div className={container()}>
      <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <h4 className={title()}>Start a Conversation</h4>
      <p className={text()}>
        Ask me anything about recipes, cooking tips, or ingredients!
      </p>
    </div>
  );
}
