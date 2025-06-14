import { tv } from 'tailwind-variants';

export interface TranslationStatus {
  language: string;
  languageCode: string;
  flag: string;
  status: 'idle' | 'checking' | 'downloading' | 'ready' | 'error';
  progress?: number;
  error?: string;
  downloadSize?: string;
  estimatedTime?: string;
  dismissed?: boolean;
}

const translationNotification = tv({
  slots: {
    container: 'fixed top-4 right-4 z-50 space-y-2',
    card: 'min-w-80 max-w-sm rounded-lg border-l-4 bg-white dark:bg-gray-800 shadow-lg transition-all duration-300',
    content: 'p-4',
    header: 'flex items-start justify-between',
    mainContent: 'flex items-center space-x-3 flex-1',
    flag: 'text-2xl',
    details: 'flex-1',
    statusRow: 'flex items-center space-x-2',
    statusIcon: 'h-4 w-4',
    title: 'text-sm font-medium text-gray-900 dark:text-gray-100',
    downloadInfo: 'mt-2 space-y-1',
    downloadMeta: 'flex justify-between text-xs text-gray-600 dark:text-gray-400',
    progressContainer: 'h-2 rounded-full transition-all duration-300 w-full bg-gray-200 dark:bg-gray-700',
    progressFill: 'h-2 rounded-full transition-all duration-300 bg-blue-500',
    progressText: 'text-xs text-gray-600 dark:text-gray-400 text-center',
    errorText: 'mt-1 text-xs text-red-600 dark:text-red-400',
    retryButton: 'mt-2 text-xs underline text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors',
    dismissButton: 'ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors',
    dismissIcon: 'h-4 w-4'
  },
  variants: {
    status: {
      checking: {
        card: 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/20',
        statusIcon: 'text-blue-500 animate-spin'
      },
      downloading: {
        card: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20',
        statusIcon: 'text-blue-500 animate-pulse'
      },
      ready: {
        card: 'border-l-green-500 bg-green-50 dark:bg-green-950/20',
        statusIcon: 'text-green-500'
      },
      error: {
        card: 'border-l-red-500 bg-red-50 dark:bg-red-950/20',
        statusIcon: 'text-red-500'
      },
      idle: {
        card: 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20',
        statusIcon: 'text-gray-500'
      }
    }
  },
  defaultVariants: {
    status: 'idle'
  }
});

interface TranslationStatusNotificationProps {
  readonly translations: TranslationStatus[];
  readonly onDismiss?: (languageCode: string) => void;
  readonly onRetry?: (languageCode: string) => void;
  readonly className?: string;
}

export function TranslationStatusNotification({
  translations,
  onDismiss,
  onRetry,
  className = ''
}: TranslationStatusNotificationProps) {
  const activeTranslations = translations.filter(t => t.status !== 'idle' && !t.dismissed);

  if (activeTranslations.length === 0) return null;

  const getStatusIcon = (status: TranslationStatus['status']) => {
    const { statusIcon } = translationNotification({ status });
    
    switch (status) {
      case 'checking':
        return (
          <svg className={statusIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'downloading':
        return (
          <svg className={statusIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      case 'ready':
        return (
          <svg className={statusIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={statusIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = (translation: TranslationStatus) => {
    switch (translation.status) {
      case 'checking':
        return `Checking ${translation.language} translator availability...`;
      case 'downloading':
        return `Downloading ${translation.language} translator...`;
      case 'ready':
        return `${translation.language} translator ready`;
      case 'error':
        return `Failed to load ${translation.language} translator`;
      default:
        return '';
    }
  };

  const {
    container,
    content,
    header,
    mainContent,
    flag,
    details,
    statusRow,
    title,
    downloadInfo,
    downloadMeta,
    progressContainer,
    progressFill,
    progressText,
    errorText,
    retryButton,
    dismissButton,
    dismissIcon
  } = translationNotification();

  return (
    <div className={`${container()} ${className}`}>
      {activeTranslations.map((translation) => {
        const { card } = translationNotification({ status: translation.status });
        
        return (
          <div
            key={translation.languageCode}
            className={card()}
          >
            <div className={content()}>
              <div className={header()}>
                <div className={mainContent()}>
                  <span className={flag()}>{translation.flag}</span>
                  <div className={details()}>
                    <div className={statusRow()}>
                      {getStatusIcon(translation.status)}
                      <p className={title()}>
                        {getStatusText(translation)}
                      </p>
                    </div>
                    
                    {translation.status === 'downloading' && (
                      <div className={downloadInfo()}>
                        <div className={downloadMeta()}>
                          <span>{translation.downloadSize && `${translation.downloadSize}`}</span>
                          <span>{translation.estimatedTime && `~${translation.estimatedTime}`}</span>
                        </div>
                        <div className={progressContainer()}>
                          <div 
                            className={progressFill()}
                            style={{ width: `${translation.progress ?? 0}%` }}
                          />
                        </div>
                        <div className={progressText()}>
                          {translation.progress ?? 0}%
                        </div>
                      </div>
                    )}

                    {translation.status === 'error' && translation.error && (
                      <p className={errorText()}>
                        {translation.error}
                      </p>
                    )}

                    {translation.status === 'error' && onRetry && (
                      <button
                        onClick={() => onRetry(translation.languageCode)}
                        className={retryButton()}
                      >
                        Retry download
                      </button>
                    )}
                  </div>
                </div>

                {onDismiss && (
                  <button
                    onClick={() => onDismiss(translation.languageCode)}
                    className={dismissButton()}
                    aria-label={`Dismiss ${translation.language} notification`}
                  >
                    <svg className={dismissIcon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
