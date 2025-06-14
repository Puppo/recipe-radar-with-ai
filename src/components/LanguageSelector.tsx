import { useState } from 'react';
import { languages } from '../constants/languages';
import { Button } from './Button';

interface LanguageSelectorProps {
  readonly selectedLanguage: string;
  readonly onLanguageChange: (language: string) => void;
  readonly variant?: 'light' | 'dark';
  readonly isTranslatorReady?: (languageCode: string) => boolean;
  readonly onInitializeTranslator?: (languageCode: string) => Promise<void>;
}

export function LanguageSelector({ 
  selectedLanguage, 
  onLanguageChange,
  variant = 'light',
  isTranslatorReady,
  onInitializeTranslator
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === selectedLanguage) || languages[0];
  
  const handleLanguageSelect = async (languageCode: string) => {
    // Initialize translator if not ready and it's not English
    if (languageCode !== 'en' && isTranslatorReady && !isTranslatorReady(languageCode) && onInitializeTranslator) {
      await onInitializeTranslator(languageCode);
    }
    
    onLanguageChange?.(languageCode);
    setIsOpen(false);
  };

  const getLanguageStatusIcon = (languageCode: string) => {
    if (languageCode === 'en') return null; // English is always ready
    
    const ready = isTranslatorReady?.(languageCode) ?? true;
    
    if (ready) {
      return (
        <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className="h-3 w-3 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    );
  };

  const dropdownClasses = variant === 'dark' 
    ? 'bg-black/80 border-white/20 text-white backdrop-blur-sm' 
    : 'bg-white border-gray-200 text-gray-900';

  const buttonClasses = variant === 'dark'
    ? 'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
    : 'border-gray-300 text-gray-700 hover:bg-gray-50';

  return (
    <div className="relative">
      <Button
        variant="outline"
        className={`flex items-center gap-2 px-3 py-2 ${buttonClasses}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg">{currentLanguage.flag}</span>
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <span className="sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <button 
            className="fixed inset-0 z-10 cursor-default" 
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            aria-label="Close language selector"
          />
          
          {/* Dropdown */}
          <div className={`absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg z-20 ${dropdownClasses}`}>
            <div className="py-2">
              {languages.map((language) => {
                const isSelected = language.code === selectedLanguage;
                const selectedClasses = variant === 'dark' ? 'bg-white/20' : 'bg-blue-50 text-blue-700';
                
                return (
                  <button
                    key={language.code}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-gray-100 ${
                      variant === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                    } ${
                      isSelected ? selectedClasses : ''
                    }`}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex-1 flex items-center justify-between">
                      <span>{language.name}</span>
                      <div className="flex items-center gap-2">
                        {getLanguageStatusIcon(language.code)}
                        {isSelected && (
                          <svg
                            className="h-4 w-4 text-blue-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
