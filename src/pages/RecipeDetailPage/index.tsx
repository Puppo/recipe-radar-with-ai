import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { Chat } from '../../components/Chat';
import { TranslationStatusNotification } from '../../components/TranslationStatusNotification';
import { TranslationStatusPanel } from '../../components/TranslationStatusPanel';
import { languages } from '../../constants/languages';
import { useLanguageDetection } from '../../hooks/useLanguageDetection';
import { usePromptApi } from '../../hooks/usePromptApi';
import { useRecipeById } from '../../hooks/useRecipes';
import { useRecipeTranslation } from '../../hooks/useRecipeTranslation';
import { useTranslationStatus } from '../../hooks/useTranslationStatus';
import { PromptApiProvider } from '../../providers/PromptApiProvider';
import type { Recipe } from '../../types/recipe';
import {
  ErrorState,
  LoadingState,
  RecipeHero,
  RecipeIngredients,
  RecipeInstructions,
  RecipePreparationInfo
} from './components';

const recipeDetailPage = tv({
  slots: {
    pageContainer: '',
    recipeDetails: 'py-12',
    statusPanelContainer: 'mb-8',
    contentGrid: 'grid gap-8 md:grid-cols-3',
    mainContent: 'md:col-span-2 space-y-8',
  }
});

const {
  pageContainer,
  recipeDetails,
  statusPanelContainer,
  contentGrid,
  mainContent
} = recipeDetailPage();

function RecipeDetailPageContent({
  recipe
}: { recipe: Recipe }) {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [hasDetectedLanguage, setHasDetectedLanguage] = useState(false);
  const [isInitializingLanguage, setIsInitializingLanguage] = useState(true);

  // Use Prompt API from context
  const {
    messages: chatMessages,
    isResponding: isChatTyping,
    sendMessageStreaming
  } = usePromptApi();

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
      if (hasDetectedLanguage || !recipe) return;

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

  const handleSendMessage = async (message: string) => {
    // Use streaming for a better user experience
    await sendMessageStreaming(message);
  };

  if (!selectedLanguage || isInitializingLanguage || supportsLanguageDetection === 'detecting') {
    let loadingMessage = 'Initializing...';
    if (supportsLanguageDetection === 'detecting') {
      loadingMessage = 'Checking language detection support...';
    } else if (isInitializingLanguage) {
      loadingMessage = 'Detecting language...';
    }

    return <LoadingState message={loadingMessage} />;
  }

  return (
    <div className={pageContainer()}>
      <TranslationStatusNotification
        translations={translations}
        onDismiss={dismissNotification}
        onRetry={retryTranslator}
      />
      
      <RecipeHero
        recipe={recipe}
        displayContent={displayContent}
        selectedLanguage={selectedLanguage}
        isTranslating={isTranslating}
        translationError={translationError}
        hasTranslation={hasTranslationFor(selectedLanguage)}
        onGoBack={goBack}
        onLanguageChange={handleLanguageChange}
        isTranslatorReady={isTranslatorReady}
        onInitializeTranslator={initializeTranslator}
      />
      
      <div className={recipeDetails()}>
        <div className={statusPanelContainer()}>
          <TranslationStatusPanel
            translations={translations}
            onRetry={retryTranslator}
            onClearAll={clearAllNotifications}
          />
        </div>
        
        <div className={contentGrid()}>
          <RecipePreparationInfo
            prepTime={displayContent?.prepTime ?? recipe.prepTime}
            cookTime={displayContent?.cookTime ?? recipe.cookTime}
            servings={recipe.servings}
          />
          
          <div className={mainContent()}>
            <RecipeIngredients
              ingredients={displayContent?.ingredients ?? recipe.ingredients}
              showTranslatedLabel={selectedLanguage !== 'en' && hasTranslationFor(selectedLanguage)}
            />
            
            <RecipeInstructions
              instructions={displayContent?.instructions ?? recipe.instructions}
              showTranslatedLabel={selectedLanguage !== 'en' && hasTranslationFor(selectedLanguage)}
            />
          </div>
        </div>
      </div>

      <Chat
        variant="light"
        messages={chatMessages}
        onSendMessage={handleSendMessage}
        isTyping={isChatTyping}
        title="Recipe Assistant"
        subtitle="Ask me about this recipe"
      />
    </div>
  );
}

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { recipe, isLoading, error } = useRecipeById(id);
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  // Generate system prompt based on recipe
  const systemPrompt = recipe
    ? `You are a helpful cooking assistant. You help users with questions about recipes, cooking techniques, ingredients, and meal planning. Be friendly, informative, and concise in your responses.

If someone asks about the recipe, use the following context to inform your answers. 
Current recipe context:
Name: ${recipe.name}
Description: ${recipe.description}
Ingredients: ${recipe.ingredients.join(', ')}
Instructions: ${recipe.instructions.join(' ')}`
    : 'You are a helpful cooking assistant. You help users with questions about recipes, cooking techniques, ingredients, and meal planning. Be friendly, informative, and concise in your responses.';

  if (isLoading) {
    return <LoadingState message="Loading recipe..." />;
  }

  if (error || !recipe) {
    return <ErrorState onGoBack={goBack} />;
  }

  return (
      <PromptApiProvider
        systemPrompt={systemPrompt}
        temperature={0.8}
        topK={40}
        autoInitialize={true}
      >
          <RecipeDetailPageContent recipe={recipe!} />
      </PromptApiProvider>
  );
}
