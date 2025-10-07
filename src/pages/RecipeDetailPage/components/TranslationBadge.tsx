import { tv } from 'tailwind-variants';

const translationBadge = tv({
  slots: {
    container: 'mt-4 flex items-center gap-2',
    badge: 'flex items-center gap-2 rounded-full px-3 py-1 text-sm',
    icon: 'h-4 w-4',
    spinningIcon: 'h-4 w-4 animate-spin',
  },
  variants: {
    status: {
      translating: {
        badge: 'bg-yellow-600/70',
      },
      error: {
        badge: 'bg-red-600/70',
      },
      success: {
        badge: 'bg-green-600/70',
      },
      ready: {
        badge: 'bg-blue-600/70',
      },
    }
  }
});

interface TranslationBadgeProps {
  isTranslating: boolean;
  translationError: string | null;
  hasTranslation: boolean;
  selectedLanguage: string;
}

export function TranslationBadge({
  isTranslating,
  translationError,
  hasTranslation,
  selectedLanguage
}: TranslationBadgeProps) {
  const { container, badge, icon, spinningIcon } = translationBadge();

  if (isTranslating) {
    return (
      <div className={container()}>
        <div className={badge({ status: 'translating' })}>
          <svg className={spinningIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Translating...</span>
        </div>
      </div>
    );
  }
  
  if (translationError) {
    return (
      <div className={container()}>
        <div className={badge({ status: 'error' })}>
          <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Translation failed</span>
        </div>
      </div>
    );
  }
  
  if (hasTranslation) {
    return (
      <div className={container()}>
        <div className={badge({ status: 'success' })}>
          <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Translated to {selectedLanguage.toUpperCase()}</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className={container()}>
      <div className={badge({ status: 'ready' })}>
        <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        <span>Ready to translate</span>
      </div>
    </div>
  );
}
