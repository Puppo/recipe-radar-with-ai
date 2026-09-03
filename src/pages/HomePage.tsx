import { useSearchParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { RecipeCard } from '../components/RecipeCard';
import { useRecipeFilter } from '../hooks/useRecipeFilter';
import { useAllRecipes } from '../hooks/useRecipes';
import { useSearchWebMCP } from '../hooks/useSearchWebMCP';

const homePage = tv({
  slots: {
    container: 'relative isolate min-h-screen bg-white px-6 lg:px-8 transition-all duration-300',
    content: 'mx-auto max-w-2xl transition-all duration-300',
    textSection: 'text-center transition-all duration-300 overflow-hidden',
    title: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl',
    subtitle: 'mt-6 text-lg leading-8 text-gray-600',
    searchSection: 'rounded-lg border border-purple-200 bg-purple-50 p-4 transition-all duration-300',
    searchHeader: 'mb-2 flex items-center gap-2',
    searchLabel: 'flex items-center gap-1.5 text-sm font-medium text-purple-800',
    modeBadge: 'ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-normal text-purple-700 ring-1 ring-inset ring-purple-200',
    searchInputWrapper: 'relative',
    searchInput:
      'w-full rounded-md border border-purple-300 bg-white py-2 pl-4 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500',
    searchClearButton:
      'absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-600',
    searchStatus: 'mt-2 flex items-center gap-1.5 text-xs text-purple-600',
    searchSpinner: 'h-3 w-3 animate-spin rounded-full border-b border-t border-purple-600',
    searchError: 'mt-2 text-xs text-red-600',
    searchFallback: 'mt-2 text-xs text-gray-500',
    resultsWrapper: 'mx-auto max-w-7xl transition-all duration-300',
    resultsTitle: 'mb-6 text-xl font-semibold',
    resultsGrid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    noResultsContainer: 'py-12 text-center',
    noResultsTitle: 'text-xl font-medium',
    noResultsText: 'mt-2 text-gray-600',
  }
});

const styles = homePage();

const viewTransitionConfig = { viewTransitionName: 'ai-filter-section' };

const searchIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
    <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.547 26.547 0 0 1 5.93-3.95.75.75 0 0 0 .42-.739 41.053 41.053 0 0 0-.39-3.114 29.925 29.925 0 0 0-5.199 2.801 2.25 2.25 0 0 1-2.514 0c-.41-.275-.833-.54-1.267-.794Z" clipRule="evenodd" />
  </svg>
);

export function HomePage() {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') ?? '';

  useSearchWebMCP();

  const { recipes: allRecipes } = useAllRecipes();

  const {
    searchQuery,
    setSearchQuery,
    results,
    isSearching,
    error: searchError,
    searchMode,
    isSearchActive: hasActiveSearch,
    clearSearch,
  } = useRecipeFilter(allRecipes, { initialQuery: filterParam });

  const isSearchActive = hasActiveSearch || searchQuery.trim().length > 0;
  const modeLabel = searchMode === 'checking'
    ? 'Checking AI…'
    : searchMode === 'ai'
      ? 'AI enhanced'
      : 'Keyword search';
  const searchPlaceholder = searchMode === 'ai'
    ? 'e.g. "quick vegetarian recipes" or "something with pasta"'
    : searchMode === 'keyword'
      ? 'Search by name, description, or tag'
      : 'Search recipes';

  return (
    <div className={styles.container()}>
      {/* Hero section — collapses when search is active */}
      <div
        className={styles.content()}
        style={{ paddingTop: isSearchActive ? '1rem' : undefined }}
      >
        <div
          className={styles.textSection()}
          style={{
            maxHeight: isSearchActive ? 0 : '500px',
            opacity: isSearchActive ? 0 : 1,
            marginBottom: isSearchActive ? 0 : undefined,
          }}
        >
          <h1 className={styles.title()}>
            Find the Perfect Recipe
          </h1>
          <p className={styles.subtitle()}>
            Discover delicious recipes for any occasion. Simple, easy, and tasty ideas for your next meal.
          </p>
        </div>

        {/* Adaptive recipe search */}
        <div
          className={styles.searchSection()}
          style={{
            ...viewTransitionConfig,
            marginTop: isSearchActive ? 0 : '2.5rem',
            textAlign: 'left',
          }}
        >
          <div className={styles.searchHeader()}>
            <label className={styles.searchLabel()} htmlFor="recipe-search">
              {searchIcon}
              Recipe search
            </label>
            <span className={styles.modeBadge()} aria-live="polite">
              {modeLabel}
            </span>
          </div>

          <form
            // @ts-expect-error -- WebMCP declarative attributes are not yet in React/TS typings
            toolname="filter_recipes"
            tooldescription="Search recipes with natural language when Built-In AI is available, or by name, description, and tags otherwise"
            onSubmit={(event) => event.preventDefault()}
            aria-busy={isSearching}
          >
            <div className={styles.searchInputWrapper()}>
              <input
                id="recipe-search"
                type="search"
                name="query"
                className={styles.searchInput()}
                style={{ viewTransitionName: 'ai-filter-input' }}
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                // @ts-expect-error -- WebMCP declarative attribute (draft spec)
                toolparamdescription="Recipe search query"
              />
              <button type="submit" className="sr-only">Search</button>
              {searchQuery && (
                <button
                  type="button"
                  className={styles.searchClearButton()}
                  onClick={clearSearch}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {searchMode === 'keyword' && (
              <p className={styles.searchFallback()}>
                Built-In AI isn&apos;t available; using keyword search across names, descriptions, and tags.
              </p>
            )}

            {isSearching && (
              <p className={styles.searchStatus()} role="status" aria-live="polite">
                <span className={styles.searchSpinner()} aria-hidden="true" />
                {searchMode === 'checking'
                  ? 'Checking search capabilities…'
                  : searchMode === 'ai'
                    ? 'Searching with AI…'
                    : 'Searching recipes…'}
              </p>
            )}

            {searchError && (
              <p className={styles.searchError()} role="alert">{searchError}</p>
            )}
          </form>
        </div>
      </div>

      {/* Results section */}
      {hasActiveSearch && !isSearching && !searchError && results.length > 0 && (
        <div className={styles.resultsWrapper()} style={{ paddingTop: '1.5rem' }}>
          <h2 className={styles.resultsTitle()}>
            {searchMode === 'ai' ? 'AI search results' : 'Search results'}
            <span className="ml-2 text-sm font-normal text-purple-600">
              — {results.length} of {allRecipes.length} shown
            </span>
          </h2>
          <div className={styles.resultsGrid()}>
            {results.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {hasActiveSearch && !isSearching && !searchError && results.length === 0 && (
        <div className={styles.noResultsContainer()}>
          <h2 className={styles.noResultsTitle()}>No recipes match your search</h2>
          <p className={styles.noResultsText()}>
            Try a different query or{' '}
            <button className="text-purple-600 underline" onClick={clearSearch}>
              clear the search
            </button>
            .
          </p>
        </div>
      )}
    </div>
  );
}
