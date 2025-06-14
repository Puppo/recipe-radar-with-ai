import { tv } from 'tailwind-variants';
import type { TranslationStatus } from './TranslationStatusNotification';

const panel = tv({
  base: 'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm'
});

const panelHeader = tv({
  base: 'p-4 border-b border-gray-200 dark:border-gray-700'
});

const statusIcon = tv({
  base: 'h-3 w-3',
  variants: {
    status: {
      checking: 'text-blue-500 animate-spin',
      downloading: 'text-blue-500',
      ready: 'text-green-500',
      error: 'text-red-500',
      offline: 'text-red-500'
    }
  }
});

const statusCard = tv({
  base: 'flex items-center space-x-3 p-2 rounded-md bg-gray-50 dark:bg-gray-700/50'
});

const progressBar = tv({
  base: 'h-1 rounded-full transition-all duration-300',
  variants: {
    variant: {
      container: 'w-full bg-gray-200 dark:bg-gray-600',
      fill: 'bg-blue-500'
    }
  }
});

const text = tv({
  base: '',
  variants: {
    variant: {
      title: 'text-lg font-semibold text-gray-900 dark:text-gray-100',
      subtitle: 'text-sm text-gray-600 dark:text-gray-400',
      name: 'text-sm font-medium text-gray-900 dark:text-gray-100 truncate',
      error: 'text-xs text-red-600 dark:text-red-400 truncate',
      progress: 'text-xs text-gray-500 dark:text-gray-400',
      clearAll: 'text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
    }
  }
});

const button = tv({
  base: 'transition-colors',
  variants: {
    variant: {
      retry: 'text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline ml-2'
    }
  }
});

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

  const getStatusIcon = (status: TranslationStatus['status']) => {
    switch (status) {
      case 'checking':
        return (
          <svg className={statusIcon({ status: 'checking' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case 'downloading':
        return (
          <svg className={statusIcon({ status: 'downloading' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
        );
      case 'ready':
        return (
          <svg className={statusIcon({ status: 'ready' })} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg className={statusIcon({ status: 'error' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={panel({ className })}>
      <div className={panelHeader()}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            <div>
              <h3 className={text({ variant: 'name' })}>
                Translation Services
              </h3>
              <p className={text({ variant: 'subtitle' })}>
                {completedCount} ready • {downloadingCount} downloading • {errorCount} errors
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!isOnline && (
              <div className={`flex items-center gap-1 ${text({ variant: 'error' })}`}>
                <svg className={statusIcon({ status: 'offline' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-12.728 12.728m0-12.728l12.728 12.728" />
                </svg>
                Offline
              </div>
            )}
            
            {onClearAll && (
              <button
                onClick={onClearAll}
                className={text({ variant: 'clearAll' })}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 space-y-2 max-h-32 overflow-y-auto">
        {activeTranslations.map((translation) => (
          <div key={translation.languageCode} className={statusCard()}>
            <span className="text-lg">{translation.flag}</span>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={text({ variant: 'name' })}>
                  {translation.language}
                </span>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(translation.status)}
                  
                  {translation.status === 'downloading' && translation.progress && (
                    <span className={text({ variant: 'progress' })}>
                      {translation.progress}%
                    </span>
                  )}
                  
                  {translation.status === 'error' && onRetry && (
                    <button
                      onClick={() => onRetry(translation.languageCode)}
                      className={button({ variant: 'retry' })}
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
              
              {translation.status === 'downloading' && (
                <div className="mt-1">
                  <div className={progressBar({ variant: 'container' })}>
                    <div 
                      className={progressBar({ variant: 'fill' })}
                      style={{ width: `${translation.progress ?? 0}%` }}
                    />
                  </div>
                </div>
              )}
              
              {translation.status === 'error' && translation.error && (
                <p className={`${text({ variant: 'error' })} mt-1`}>
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
