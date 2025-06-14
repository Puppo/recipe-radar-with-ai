import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { Button } from '../components/Button';
import { LanguageSelector } from '../components/LanguageSelector';
import { TranslationStatusNotification } from '../components/TranslationStatusNotification';
import { TranslationStatusPanel } from '../components/TranslationStatusPanel';
import { useRecipeById } from '../hooks/useRecipes';
import { useTranslationStatus } from '../hooks/useTranslationStatus';

const recipeDetailPage = tv({
  slots: {
    // Loading state
    loadingContainer: 'grid place-items-center py-24',
    loadingContent: 'text-center',
    loadingSpinner: 'h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600',
    loadingText: 'mt-4 text-xl text-gray-600',
    
    // Error state
    errorContainer: 'py-4',
    errorContent: 'rounded-lg bg-red-50 p-6 text-center',
    errorTitle: 'text-2xl font-bold text-red-800',
    errorText: 'mt-2 text-red-700',
    errorButton: 'mt-6',
    
    // Page layout
    pageContainer: '',
    
    // Hero section
    heroSection: 'relative',
    heroBackground: 'absolute inset-0',
    heroImage: 'h-full w-full object-cover',
    heroOverlay: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    heroContent: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white',
    heroControls: 'flex items-center justify-between mb-6',
    backButton: 'border-white text-white hover:bg-white/20',
    heroTitle: 'text-4xl font-bold sm:text-5xl',
    heroDescription: 'mt-4 max-w-2xl text-xl text-white/90',
    
    // Translation elements
    translationBadge: 'mt-4 flex items-center gap-2',
    translationStatus: 'flex items-center gap-2 rounded-full bg-blue-600/70 px-3 py-1 text-sm',
    translationIcon: 'h-4 w-4',
    
    // Tags and content
    tagsContainer: 'mt-8 flex flex-wrap gap-2',
    tag: 'rounded-full bg-blue-600/70 px-3 py-1 text-sm',
    
    // Recipe details section
    recipeDetails: 'py-12',
    statusPanelContainer: 'mb-8',
    contentGrid: 'grid gap-8 md:grid-cols-3',
    
    // Sidebar
    sidebar: 'rounded-lg bg-gray-50 p-6',
    sidebarTitle: 'text-lg font-semibold',
    sidebarList: 'mt-4 space-y-4',
    sidebarItem: '',
    sidebarLabel: 'text-sm text-gray-500',
    sidebarValue: 'font-medium',
    
    // Main content
    mainContent: 'md:col-span-2 space-y-8',
    section: '',
    sectionHeader: 'flex items-center justify-between',
    sectionTitle: 'text-2xl font-bold',
    translatedLabel: 'text-sm text-gray-500 flex items-center gap-1',
    translatedIcon: 'h-3 w-3',
    
    // Ingredients
    ingredientsList: 'mt-4 space-y-2',
    ingredientItem: 'flex items-start',
    ingredientBullet: 'mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600',
    ingredientText: '',
    
    // Instructions
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
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Translation status management
  const {
    translations,
    initializeTranslator,
    retryTranslator,
    dismissNotification,
    clearAllNotifications,
    isTranslatorReady
  } = useTranslationStatus();

  // Navigate back function
  const goBack = () => navigate(-1);
  
  // Handle language change
  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    
    // Initialize translator if not ready
    if (language !== 'en' && !isTranslatorReady(language)) {
      await initializeTranslator(language);
    }
    
    console.log(`Translating recipe to: ${language}`);
  };

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
      {/* Translation Status Notifications */}
      <TranslationStatusNotification
        translations={translations}
        onDismiss={dismissNotification}
        onRetry={retryTranslator}
      />
      
      {/* Hero section */}
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
          <h1 className={heroTitle()}>{recipe.name}</h1>
          <p className={heroDescription()}>{recipe.description}</p>
          
          {/* Translation Status */}
          {selectedLanguage !== 'en' && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-blue-600/70 px-3 py-1 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>Translated to {selectedLanguage.toUpperCase()}</span>
              </div>
            </div>
          )}
          
          <div className={tagsContainer()}>
            {recipe.tags.map((tagName) => (
              <span key={tagName} className={tag()}>
                {tagName}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recipe details */}
      <div className={recipeDetails()}>
        {/* Translation Status Panel */}
        <div className={statusPanelContainer()}>
          <TranslationStatusPanel
            translations={translations}
            onRetry={retryTranslator}
            onClearAll={clearAllNotifications}
          />
        </div>
        
        <div className={contentGrid()}>
          {/* Left sidebar with preparation info */}
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
          
          {/* Main recipe content */}
          <div className="md:col-span-2 space-y-8">
            {/* Ingredients */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ingredients</h2>
                {selectedLanguage !== 'en' && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={`ingredient-${ingredient}`} className="flex items-start">
                    <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Instructions */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Instructions</h2>
                {selectedLanguage !== 'en' && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ol className={instructionsList()}>
                {recipe.instructions.map((instruction, index) => (
                  <li key={`instruction-${instruction.substring(0, 20)}`} className={instructionItem()}>
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
