import { tv } from 'tailwind-variants';
import { Button } from '../../../components/Button';
import { LanguageSelector } from '../../../components/LanguageSelector';
import { TranslationBadge } from './TranslationBadge';

const recipeHero = tv({
  slots: {
    section: 'relative',
    background: 'absolute inset-0',
    image: 'h-full w-full object-cover',
    overlay: 'absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent',
    content: 'relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white',
    controls: 'flex items-center justify-between mb-6',
    backButton: 'border-white text-white hover:bg-white/20',
    title: 'text-4xl font-bold sm:text-5xl',
    description: 'mt-4 max-w-2xl text-xl text-white/90',
    tagsContainer: 'mt-8 flex flex-wrap gap-2',
    tag: 'rounded-full bg-blue-600/70 px-3 py-1 text-sm',
  }
});

const { section, background, image, overlay, content, controls, backButton, title, description, tagsContainer, tag } = recipeHero();

interface RecipeHeroProps {
  recipe: {
    imageUrl: string;
    name: string;
    description: string;
    tags: string[];
  };
  displayContent: {
    name: string;
    description: string;
    tags: string[];
  } | null;
  selectedLanguage: string;
  isTranslating: boolean;
  translationError: string | null;
  hasTranslation: boolean;
  onGoBack: () => void;
  onLanguageChange: (language: string) => void;
  isTranslatorReady: (language: string) => boolean;
  onInitializeTranslator: (language: string) => Promise<void>;
}

export function RecipeHero({
  recipe,
  displayContent,
  selectedLanguage,
  isTranslating,
  translationError,
  hasTranslation,
  onGoBack,
  onLanguageChange,
  isTranslatorReady,
  onInitializeTranslator
}: RecipeHeroProps) {
  return (
    <div className={section()}>
      <div className={background()}>
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className={image()}
        />
        <div className={overlay()}></div>
      </div>
      
      <div className={content()}>
        <div className={controls()}>
          <Button
            variant="outline"
            className={backButton()}
            onClick={onGoBack}
          >
            ← Back
          </Button>
          
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
            variant="dark"
            isTranslatorReady={isTranslatorReady}
            onInitializeTranslator={onInitializeTranslator}
          />
        </div>
        <h1 className={title()}>{displayContent?.name ?? recipe.name}</h1>
        <p className={description()}>{displayContent?.description ?? recipe.description}</p>
        
        {selectedLanguage !== 'en' && (
          <TranslationBadge
            isTranslating={isTranslating}
            translationError={translationError}
            hasTranslation={hasTranslation}
            selectedLanguage={selectedLanguage}
          />
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
  );
}
