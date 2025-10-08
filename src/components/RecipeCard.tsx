import { useState } from 'react';
import { Link } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { useSummarizer } from '../hooks/useSummarizer';
import type { RecipePreview } from '../types/recipe';
import { Button } from './Button';

const recipeCard = tv({
  slots: {
    container: 'overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg',
    linkContainer: 'group block',
    imageContainer: 'aspect-video w-full overflow-hidden',
    image: 'h-full w-full object-cover transition-transform group-hover:scale-105',
    content: 'p-4',
    title: 'text-xl font-semibold text-gray-900',
    description: 'mt-2 line-clamp-2 text-gray-600',
    actionContainer: 'mt-4 flex items-center justify-between',
    summaryContainer: 'mt-4 rounded-md bg-blue-50 p-3 border border-blue-200',
    summaryTitle: 'text-sm font-medium text-blue-900 mb-2',
    summaryText: 'text-sm text-blue-800 space-y-2',
    errorContainer: 'mt-4 rounded-md bg-red-50 p-3',
    errorText: 'text-sm text-red-800'
  }
});

const { 
  container, 
  linkContainer, 
  imageContainer, 
  image, 
  content, 
  title, 
  description, 
  actionContainer,
  summaryContainer,
  summaryTitle,
  summaryText,
  errorContainer,
  errorText
} = recipeCard();

interface RecipeCardProps {
  readonly recipe: RecipePreview;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showSummary, setShowSummary] = useState(false);
  const { summarizeRecipeById, getSummary, isLoading, error, clearError } = useSummarizer();

  const handleSummarize = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (showSummary) {
      setShowSummary(false);
      return;
    }

    const existingSummary = getSummary(recipe.id);
    if (existingSummary) {
      setShowSummary(true);
      return;
    }

    try {
      await summarizeRecipeById(recipe.id);
      setShowSummary(true);
    } catch (err) {
      console.error('Failed to summarize recipe:', err);
    }
  };

  const currentSummary = getSummary(recipe.id);
  const currentError = error(recipe.id);
  const isCurrentlyLoading = isLoading(recipe.id);

  const getButtonText = () => {
    if (isCurrentlyLoading) return 'Summarizing...';
    if (showSummary && currentSummary) return 'Hide Summary';
    return 'AI Summary';
  };

  return (
    <article className={container()}>
      <Link to={`/recipes/${recipe.id}`} className={linkContainer()}>
        <div className={imageContainer()}>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className={image()}
          />
        </div>
        <div className={content()}>
          <h3 className={title()}>{recipe.name}</h3>
          <p className={description()}>{recipe.description}</p>
        </div>
      </Link>
      
      <div className={content()} style={{ paddingTop: 0 }}>
        <div className={actionContainer()}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleSummarize}
            disabled={isCurrentlyLoading}
          >
            {isCurrentlyLoading && (
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 inline-block" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {getButtonText()}
          </Button>
        </div>

        {currentError && (
          <div className={errorContainer()}>
            <p className={errorText()}>{currentError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                clearError(recipe.id);
              }}
            >
              Dismiss
            </Button>
          </div>
        )}

        {showSummary && currentSummary && (
          <div className={summaryContainer()}>
            <h4 className={summaryTitle()}>AI Summary</h4>
            <div 
              className={`${summaryText()} summary-content`}
              dangerouslySetInnerHTML={{ __html: currentSummary }}
            />
          </div>
        )}
      </div>
    </article>
  );
}
