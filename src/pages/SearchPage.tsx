import { useSearchParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipeAIFilter } from '../hooks/useRecipeAIFilter';
import { useAllRecipes } from '../hooks/useRecipes';

const searchPage = tv({
  slots: {
    container: 'py-4',
    resultsTitle: 'mb-6 text-xl font-semibold',
    resultsGrid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    noResultsContainer: 'py-12 text-center',
    noResultsTitle: 'text-xl font-medium',
    noResultsText: 'mt-2 text-gray-600',
    aiFilterSection: 'mb-8 rounded-lg border border-purple-200 bg-purple-50 p-4',
    aiFilterLabel: 'mb-2 flex items-center gap-1.5 text-sm font-medium text-purple-800',
    aiFilterInputWrapper: 'relative',
    aiFilterInput:
      'w-full rounded-md border border-purple-300 bg-white py-2 pl-4 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500',
    aiFilterClearButton:
      'absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600',
    aiFilterStatus: 'mt-2 flex items-center gap-1.5 text-xs text-purple-600',
    aiFilterSpinner: 'h-3 w-3 animate-spin rounded-full border-b border-t border-purple-600',
    aiFilterError: 'mt-2 text-xs text-red-600',
    aiFilterUnavailable: 'text-xs text-gray-400 italic',
  }
});

const {
  container,
  resultsTitle,
  resultsGrid,
  noResultsContainer,
  noResultsTitle,
  noResultsText,
  aiFilterSection,
  aiFilterLabel,
  aiFilterInputWrapper,
  aiFilterInput,
  aiFilterClearButton,
  aiFilterStatus,
  aiFilterSpinner,
  aiFilterError,
  aiFilterUnavailable,
} = searchPage();

export function SearchPage() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') ?? '';

  const { recipes: allRecipes } = useAllRecipes();

  const {
    filterQuery,
    setFilterQuery,
    filteredRecipes,
    isFiltering,
    error: filterError,
    isAvailable: isAIAvailable,
    isFilterActive,
    clearFilter,
  } = useRecipeAIFilter(allRecipes, { initialQuery: filterParam });

  return (
    <div className={container()}>
      <div className={aiFilterSection()}>
        <label className={aiFilterLabel()}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.547 26.547 0 0 1 5.93-3.95.75.75 0 0 0 .42-.739 41.053 41.053 0 0 0-.39-3.114 29.925 29.925 0 0 0-5.199 2.801 2.25 2.25 0 0 1-2.514 0c-.41-.275-.833-.54-1.267-.794Z" clipRule="evenodd" />
          </svg>
          AI Filter
        </label>

        {isAIAvailable ? (
          <>
            <div className={aiFilterInputWrapper()}>
              <input
                type="text"
                className={aiFilterInput()}
                placeholder='e.g. "quick vegetarian recipes" or "something with pasta"'
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
              {filterQuery && (
                <button
                  type="button"
                  className={aiFilterClearButton()}
                  onClick={clearFilter}
                  aria-label="Clear filter"
                >
                  ✕
                </button>
              )}
            </div>

            {isFiltering && (
              <p className={aiFilterStatus()}>
                <span className={aiFilterSpinner()} />
                Filtering with AI…
              </p>
            )}

            {filterError && (
              <p className={aiFilterError()}>{filterError}</p>
            )}
          </>
        ) : (
          <p className={aiFilterUnavailable()}>
            Chrome's built-in AI is not available in this browser. Enable it in chrome://flags to use natural language filtering.
          </p>
        )}
      </div>

      {isFilterActive && !isFiltering && filteredRecipes.length > 0 && (
        <>
          <h2 className={resultsTitle()}>
            AI Filter Results
            <span className="ml-2 text-sm font-normal text-purple-600">
              — {filteredRecipes.length} of {allRecipes.length} shown
            </span>
          </h2>
          <div className={resultsGrid()}>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </>
      )}

      {isFilterActive && !isFiltering && filteredRecipes.length === 0 && (
        <div className={noResultsContainer()}>
          <h2 className={noResultsTitle()}>No recipes match your filter</h2>
          <p className={noResultsText()}>
            Try a different description or{' '}
            <button className="text-purple-600 underline" onClick={clearFilter}>
              clear the filter
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
