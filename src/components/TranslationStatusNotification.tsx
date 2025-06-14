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
    switch (status) {
      case 'checking':
        return (
          <svg className="h-4 w-4 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'downloading':
        return (
          <svg className="h-4 w-4 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      case 'ready':
        return (
          <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

  const getStatusColor = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'checking':
        return 'border-l-blue-400 bg-blue-50 dark:bg-blue-950/20';
      case 'downloading':
        return 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'ready':
        return 'border-l-green-500 bg-green-50 dark:bg-green-950/20';
      case 'error':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      default:
        return 'border-l-gray-500 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 space-y-2 ${className}`}>
      {activeTranslations.map((translation) => (
        <div
          key={translation.languageCode}
          className={`
            min-w-80 max-w-sm rounded-lg border-l-4 bg-white dark:bg-gray-800 
            shadow-lg transition-all duration-300 ${getStatusColor(translation.status)}
          `}
        >
          <div className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <span className="text-2xl">{translation.flag}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(translation.status)}
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {getStatusText(translation)}
                    </p>
                  </div>
                  
                  {translation.status === 'downloading' && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{translation.downloadSize && `${translation.downloadSize}`}</span>
                        <span>{translation.estimatedTime && `~${translation.estimatedTime}`}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${translation.progress ?? 0}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 text-center">
                        {translation.progress ?? 0}%
                      </div>
                    </div>
                  )}

                  {translation.status === 'error' && translation.error && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {translation.error}
                    </p>
                  )}

                  {translation.status === 'error' && onRetry && (
                    <button
                      onClick={() => onRetry(translation.languageCode)}
                      className="mt-2 text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
                    >
                      Retry download
                    </button>
                  )}
                </div>
              </div>

              {onDismiss && (
                <button
                  onClick={() => onDismiss(translation.languageCode)}
                  className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={`Dismiss ${translation.language} notification`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
