import { useState } from 'react';
import { tv } from 'tailwind-variants';
import { languages } from '../constants/languages';
import { Button } from './Button';

const container = tv({
  base: 'relative'
});

const selectorButton = tv({
  base: 'flex items-center gap-2 px-3 py-2',
  variants: {
    variant: {
      light: 'border-gray-300 text-gray-700 hover:bg-gray-50',
      dark: 'border-white/30 text-white hover:bg-white/10 backdrop-blur-sm'
    }
  }
});

const flagText = tv({
  base: 'text-lg'
});

const languageName = tv({
  base: 'hidden sm:inline'
});

const languageCode = tv({
  base: 'sm:hidden'
});

const chevronIcon = tv({
  base: 'h-4 w-4 transition-transform',
  variants: {
    open: {
      true: 'rotate-180',
      false: ''
    }
  }
});

const backdrop = tv({
  base: 'fixed inset-0 z-10 cursor-default'
});

const dropdown = tv({
  base: 'absolute right-0 top-full mt-2 w-48 rounded-lg border shadow-lg z-20',
  variants: {
    variant: {
      light: 'bg-white border-gray-200 text-gray-900',
      dark: 'bg-black/80 border-white/20 text-white backdrop-blur-sm'
    }
  }
});

const dropdownContent = tv({
  base: 'py-2'
});

const languageButton = tv({
  base: 'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
  variants: {
    variant: {
      light: 'hover:bg-gray-100',
      dark: 'hover:bg-white/10'
    },
    selected: {
      true: '',
      false: ''
    }
  },
  compoundVariants: [
    {
      variant: 'light',
      selected: true,
      class: 'bg-blue-50 text-blue-700'
    },
    {
      variant: 'dark',
      selected: true,
      class: 'bg-white/20'
    }
  ]
});

const languageContent = tv({
  base: 'flex-1 flex items-center justify-between'
});

const languageNameText = tv({
  base: ''
});

const iconContainer = tv({
  base: 'flex items-center gap-2'
});

const statusIcon = tv({
  base: 'h-3 w-3',
  variants: {
    status: {
      ready: 'text-green-500',
      downloading: 'text-orange-500'
    }
  }
});

const checkmarkIcon = tv({
  base: 'h-4 w-4 text-blue-600'
});

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
        <svg className={statusIcon({ status: 'ready' })} fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    
    return (
      <svg className={statusIcon({ status: 'downloading' })} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
      </svg>
    );
  };

  const dropdownClasses = dropdown({ variant });

  return (
    <div className={container()}>
      <Button
        variant="outline"
        className={selectorButton({ variant })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={flagText()}>{currentLanguage.flag}</span>
        <span className={languageName()}>{currentLanguage.name}</span>
        <span className={languageCode()}>{currentLanguage.code.toUpperCase()}</span>
        <svg
          className={chevronIcon({ open: isOpen })}
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
            className={backdrop()} 
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            aria-label="Close language selector"
          />
          
          {/* Dropdown */}
          <div className={dropdownClasses}>
            <div className={dropdownContent()}>
              {languages.map((language) => {
                const isSelected = language.code === selectedLanguage;
                
                return (
                  <button
                    key={language.code}
                    className={languageButton({ 
                      variant, 
                      selected: isSelected 
                    })}
                    onClick={() => handleLanguageSelect(language.code)}
                  >
                    <span className={flagText()}>{language.flag}</span>
                    <div className={languageContent()}>
                      <span className={languageNameText()}>{language.name}</span>
                      <div className={iconContainer()}>
                        {getLanguageStatusIcon(language.code)}
                        {isSelected && (
                          <svg
                            className={checkmarkIcon()}
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
