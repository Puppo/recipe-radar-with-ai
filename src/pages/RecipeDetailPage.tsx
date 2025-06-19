import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { Button } from '../components/Button';
import { LanguageSelector } from '../components/LanguageSelector';
import { TranslationStatusNotification } from '../components/TranslationStatusNotification';
import { TranslationStatusPanel } from '../components/TranslationStatusPanel';
import { languages } from '../constants/languages';
import { useLanguageDetection } from '../hooks/useLanguageDetection';
import { useRecipeById } from '../hooks/useRecipes';
import { useRecipeTranslation } from '../hooks/useRecipeTranslation';
import { useTranslationStatus } from '../hooks/useTranslationStatus';

const recipeDetailPage = tv({
  slots: {
    loadingContainer: 'grid place-items-center py-24',
    loadingContent: 'text-center',
    loadingSpinner: 'h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600',
    loadingText: 'mt-4 text-xl text-gray-600',
    
    errorContainer: 'py-4',
    errorContent: 'rounded-lg bg-red-50 p-6 text-center',
    errorTitle: 'text-2xl font-bold text-red-800',
    errorText: 'mt-2 text-red-700',
    errorButton: 'mt-6',
    
    pageContainer: '',
    
    heroSection: 'relative',
    heroBackground: 'absolute inset-0',
    heroImage: 'h-full w-full object-cover',
    heroOverlay: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    heroContent: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white',
    heroControls: 'flex items-center justify-between mb-6',
    backButton: 'border-white text-white hover:bg-white/20',
    heroTitle: 'text-4xl font-bold sm:text-5xl',
    heroDescription: 'mt-4 max-w-2xl text-xl text-white/90',
    
    translationBadge: 'mt-4 flex items-center gap-2',
    translationStatus: 'flex items-center gap-2 rounded-full bg-blue-600/70 px-3 py-1 text-sm',
    translationIcon: 'h-4 w-4',
    

    tagsContainer: 'mt-8 flex flex-wrap gap-2',
    tag: 'rounded-full bg-blue-600/70 px-3 py-1 text-sm',
    
    recipeDetails: 'py-12',
    statusPanelContainer: 'mb-8',
    contentGrid: 'grid gap-8 md:grid-cols-3',
    
    sidebar: 'rounded-lg bg-gray-50 p-6',
    sidebarTitle: 'text-lg font-semibold',
    sidebarList: 'mt-4 space-y-4',
    sidebarItem: '',
    sidebarLabel: 'text-sm text-gray-500',
    sidebarValue: 'font-medium',
    
    mainContent: 'md:col-span-2 space-y-8',
    section: '',
    sectionHeader: 'flex items-center justify-between',
    sectionTitle: 'text-2xl font-bold',
    translatedLabel: 'text-sm text-gray-500 flex items-center gap-1',
    translatedIcon: 'h-3 w-3',
    
    ingredientsList: 'mt-4 space-y-2',
    ingredientItem: 'flex items-start',
    ingredientBullet: 'mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600',
    ingredientText: '',
    
    instructionsList: 'mt-4 space-y-6',
    instructionItem: 'flex',
    instructionNumber: 'mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800',
    instructionText: 'pt-1'
  }
});

const {
  loadingContainer,
  loadingContent,
  loadingSpinner,
  loadingText,
  errorContainer,
  errorContent,
  errorTitle,
  errorText,
  errorButton,
  pageContainer,
  heroSection,
  heroBackground,
  heroImage,
  heroOverlay,
  heroContent,
  heroControls,
  backButton,
  heroTitle,
  heroDescription,
  tagsContainer,
  tag,
  recipeDetails,
  statusPanelContainer,
  contentGrid,
  sidebar,
  sidebarTitle,
  sidebarList,
  sidebarItem,
  sidebarLabel,
  sidebarValue,
  instructionsList,
  instructionItem,
  instructionNumber,
  instructionText
} = recipeDetailPage();

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading, error } = useRecipeById(id);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [hasDetectedLanguage, setHasDetectedLanguage] = useState(false);
  const [isInitializingLanguage, setIsInitializingLanguage] = useState(true);
  
  const {
    detectRecipeLanguage,
    detectBrowserLanguage,
    supportsLanguageDetection,
    initializeDetector
  } = useLanguageDetection();
  
  const {
    translations,
    initializeTranslator,
    retryTranslator,
    dismissNotification,
    clearAllNotifications,
    isTranslatorReady
  } = useTranslationStatus();

  const {
    isTranslating,
    translationError,
    translateRecipe,
    getDisplayContent,
    hasTranslationFor
  } = useRecipeTranslation();

  const goBack = () => navigate(-1);

  const getBrowserLanguageFallback = useCallback(() => {
    const browserLang = navigator.language || navigator.languages?.[0];
    if (browserLang) {
      const langCode = browserLang.split('-')[0];
      const supportedLang = languages.find(lang => lang.code === langCode);
      if (supportedLang) {
        return supportedLang.code;
      }
    }
    return 'en';
  }, []);

  useEffect(() => {
    const initializeLanguage = async () => {
      if (hasDetectedLanguage) return;

      if (supportsLanguageDetection === 'detecting') {
        console.log('Still checking language detection support...');
        return;
      }

      try {
        setIsInitializingLanguage(true);
        let detectedLang = 'en';

        if (supportsLanguageDetection === 'detected') {
          console.log('Language detection is supported, initializing detector...');
          
          const initialized = await initializeDetector();
          
          if (initialized) {
            console.log('Language detector initialized successfully');
            
            if (recipe) {
              console.log('Detecting recipe language...');
              detectedLang = await detectRecipeLanguage(recipe);
              console.log(`Recipe language detected as: ${detectedLang}`);
            } else {
              console.log('Detecting browser language...');
              detectedLang = await detectBrowserLanguage();
              console.log(`Browser language detected as: ${detectedLang}`);
            }
          } else {
            console.log('Failed to initialize language detector, falling back to browser language');
            detectedLang = getBrowserLanguageFallback();
            console.log(`Browser language fallback: ${detectedLang}`);
          }
        } else {
          console.log('Language detection not supported, using browser language fallback');
          detectedLang = getBrowserLanguageFallback();
          console.log(`Browser language fallback: ${detectedLang}`);
        }

        setSelectedLanguage(detectedLang);
        setHasDetectedLanguage(true);
      } catch (error) {
        console.error('Failed to detect language:', error);
        setSelectedLanguage('en');
        setHasDetectedLanguage(true);
      } finally {
        setIsInitializingLanguage(false);
      }
    };

    initializeLanguage();
  }, [recipe, hasDetectedLanguage, supportsLanguageDetection, initializeDetector, detectRecipeLanguage, detectBrowserLanguage, getBrowserLanguageFallback]);
  
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    
    if (language !== 'en' && !isTranslatorReady(language)) {
      await initializeTranslator(language);
    }

    if (recipe && (language === 'en' || isTranslatorReady(language))) {
      await translateRecipe(recipe, language);
    }
    
    console.log(`Translating recipe to: ${language}`);
  };

  useEffect(() => {
    if (recipe && selectedLanguage && selectedLanguage !== 'en' && isTranslatorReady(selectedLanguage)) {
      translateRecipe(recipe, selectedLanguage);
    }
  }, [recipe, selectedLanguage, isTranslatorReady, translateRecipe]);

  const displayContent = selectedLanguage ? getDisplayContent(selectedLanguage) : null;

  if (!selectedLanguage || isInitializingLanguage || supportsLanguageDetection === 'detecting') {
    let loadingMessage = 'Initializing...';
    if (supportsLanguageDetection === 'detecting') {
      loadingMessage = 'Checking language detection support...';
    } else if (isInitializingLanguage) {
      loadingMessage = 'Detecting language...';
    }

    return (
      <div className={loadingContainer()}>
        <div className={loadingContent()}>
          <div className={loadingSpinner()}></div>
          <p className={loadingText()}>{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={loadingContainer()}>
        <div className={loadingContent()}>
          <div className={loadingSpinner()}></div>
          <p className={loadingText()}>Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className={errorContainer()}>
        <div className={errorContent()}>
          <h1 className={errorTitle()}>Recipe Not Found</h1>
          <p className={errorText()}>The recipe you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="primary"
            className={errorButton()}
            onClick={goBack}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={pageContainer()}>
      <TranslationStatusNotification
        translations={translations}
        onDismiss={dismissNotification}
        onRetry={retryTranslator}
      />
      
      <div className={heroSection()}>
        <div className={heroBackground()}>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className={heroImage()}
          />
          <div className={heroOverlay()}></div>
        </div>
        
        <div className={heroContent()}>
          <div className={heroControls()}>
            <Button
              variant="outline"
              className={backButton()}
              onClick={goBack}
            >
              ← Back
            </Button>
            
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              variant="dark"
              isTranslatorReady={isTranslatorReady}
              onInitializeTranslator={initializeTranslator}
            />
          </div>
          <h1 className={heroTitle()}>{displayContent?.name ?? recipe.name}</h1>
          <p className={heroDescription()}>{displayContent?.description ?? recipe.description}</p>
          
          {selectedLanguage !== 'en' && (
            <div className="mt-4 flex items-center gap-2">
              {(() => {
                if (isTranslating) {
                  return (
                    <div className="flex items-center gap-2 rounded-full bg-yellow-600/70 px-3 py-1 text-sm">
                      <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Translating...</span>
                    </div>
                  );
                }
                
                if (translationError) {
                  return (
                    <div className="flex items-center gap-2 rounded-full bg-red-600/70 px-3 py-1 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span>Translation failed</span>
                    </div>
                  );
                }
                
                if (hasTranslationFor(selectedLanguage)) {
                  return (
                    <div className="flex items-center gap-2 rounded-full bg-green-600/70 px-3 py-1 text-sm">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Translated to {selectedLanguage.toUpperCase()}</span>
                    </div>
                  );
                }
                
                return (
                  <div className="flex items-center gap-2 rounded-full bg-blue-600/70 px-3 py-1 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    <span>Ready to translate</span>
                  </div>
                );
              })()}
            </div>
          )}
          
          <div className={tagsContainer()}>
            {(displayContent?.tags ?? recipe.tags).map((tagName) => (
              <span key={tagName} className={tag()}>
                {tagName}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <div className={recipeDetails()}>
        <div className={statusPanelContainer()}>
          <TranslationStatusPanel
            translations={translations}
            onRetry={retryTranslator}
            onClearAll={clearAllNotifications}
          />
        </div>
        
        <div className={contentGrid()}>
          <div className={sidebar()}>
            <h2 className={sidebarTitle()}>Preparation</h2>
            <dl className={sidebarList()}>
              <div className={sidebarItem()}>
                <dt className={sidebarLabel()}>Prep Time</dt>
                <dd className={sidebarValue()}>{recipe.prepTime}</dd>
              </div>
              <div className={sidebarItem()}>
                <dt className={sidebarLabel()}>Cook Time</dt>
                <dd className={sidebarValue()}>{recipe.cookTime}</dd>
              </div>
              <div className={sidebarItem()}>
                <dt className={sidebarLabel()}>Servings</dt>
                <dd className={sidebarValue()}>{recipe.servings}</dd>
              </div>
            </dl>
          </div>
          
          <div className="md:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ingredients</h2>
                {selectedLanguage !== 'en' && hasTranslationFor(selectedLanguage) && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {(displayContent?.ingredients ?? recipe.ingredients).map((ingredient, index) => (
                  <li key={`ingredient-${index}-${ingredient.substring(0, 20)}`} className="flex items-start">
                    <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Instructions</h2>
                {selectedLanguage !== 'en' && hasTranslationFor(selectedLanguage) && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ol className={instructionsList()}>
                {(displayContent?.instructions ?? recipe.instructions).map((instruction, index) => (
                  <li key={`instruction-${index}-${instruction.substring(0, 20)}`} className={instructionItem()}>
                    <span className={instructionNumber()}>
                      {index + 1}
                    </span>
                    <span className={instructionText()}>{instruction}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
