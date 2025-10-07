import { tv } from 'tailwind-variants';

const chatHeader = tv({
  slots: {
    container: 'flex items-center justify-between border-b p-4',
    content: 'flex items-center gap-3',
    icon: 'h-5 w-5',
    info: '',
    title: 'text-lg font-semibold',
    subtitle: 'text-xs',
    closeButton: 'rounded-md p-1 transition-colors',
    closeIcon: 'h-5 w-5'
  },
  variants: {
    variant: {
      light: {
        container: 'bg-blue-600 text-white border-blue-700',
        subtitle: 'text-blue-100',
        closeButton: 'hover:bg-blue-700'
      },
      dark: {
        container: 'bg-gray-800 text-white border-gray-700',
        subtitle: 'text-gray-400',
        closeButton: 'hover:bg-gray-700'
      }
    }
  }
});

interface ChatHeaderProps {
  readonly variant?: 'light' | 'dark';
  readonly title: string;
  readonly subtitle: string;
  readonly onClose: () => void;
}

export function ChatHeader({ variant = 'light', title, subtitle, onClose }: ChatHeaderProps) {
  const { 
    container, 
    content, 
    icon, 
    info, 
    title: titleClass, 
    subtitle: subtitleClass, 
    closeButton, 
    closeIcon 
  } = chatHeader({ variant });

  return (
    <div className={container()}>
      <div className={content()}>
        <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
        <div className={info()}>
          <h3 className={titleClass()}>{title}</h3>
          <p className={subtitleClass()}>{subtitle}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className={closeButton()}
        aria-label="Close chat"
      >
        <svg className={closeIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
