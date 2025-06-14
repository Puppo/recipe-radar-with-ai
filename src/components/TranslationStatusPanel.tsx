import type { TranslationStatus } from './TranslationStatusNotification';

interface TranslationStatusPanelProps {
  readonly translations: TranslationStatus[];
  readonly isOnline?: boolean;
  readonly onRetry?: (languageCode: string) => void;
  readonly onClearAll?: () => void;
  readonly className?: string;
}

export function TranslationStatusPanel({
  translations,
  isOnline = true,
  onRetry,
  onClearAll,
  className = ''
}: TranslationStatusPanelProps) {
  const activeTranslations = translations.filter(t => t.status !== 'idle' && !t.dismissed);
  const completedCount = translations.filter(t => t.status === 'ready' && !t.dismissed).length;
  const downloadingCount = translations.filter(t => t.status === 'downloading' && !t.dismissed).length;
  const errorCount = translations.filter(t => t.status === 'error' && !t.dismissed).length;

  if (activeTranslations.length === 0) return null;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Translation Services
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {completedCount} ready • {downloadingCount} downloading • {errorCount} errors
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className="flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
                </svg>
                Offline
              </div>
            )}
            
            {onClearAll && (
              <button
                onClick={onClearAll}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 max-h-32 overflow-y-auto">
        {activeTranslations.map((translation) => (
          <div key={translation.languageCode} className="flex items-center gap-3 p-2 rounded-md bg-gray-50 dark:bg-gray-700/50">
            <span className="text-lg">{translation.flag}</span>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {translation.language}
                </span>
                
                <div className="flex items-center gap-2">
                  {translation.status === 'checking' && (
                    <svg className="h-3 w-3 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  
                  {translation.status === 'downloading' && (
                    <svg className="h-3 w-3 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                    </svg>
                  )}
                  
                  {translation.status === 'ready' && (
                    <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                  
                  {translation.status === 'error' && (
                    <div className="flex items-center gap-1">
                      <svg className="h-3 w-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {onRetry && (
                        <button
                          onClick={() => onRetry(translation.languageCode)}
                          className="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                        >
                          Retry
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {translation.status === 'downloading' && (
                <div className="mt-1">
                  <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                    <span>{translation.progress ?? 0}%</span>
                    <span>{translation.downloadSize}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                    <div 
                      className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${translation.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              {translation.status === 'error' && translation.error && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 truncate">
                  {translation.error}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
