import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { RecipeCard } from '../components/RecipeCard';
import { SearchInput } from '../components/SearchInput';
import { useRecipeSearch } from '../hooks/useRecipes';

const searchPage = tv({
  slots: {
    container: 'py-4',
    form: 'mb-8 flex gap-4',
    error: 'rounded-md bg-red-50 p-4 text-red-700',
    loadingContainer: 'grid place-items-center py-12',
    loadingContent: 'text-center',
    loadingSpinner: 'h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600',
    loadingText: 'mt-2 text-gray-600',
    resultsSection: '',
    resultsTitle: 'mb-6 text-xl font-semibold',
    resultsGrid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
    noResultsContainer: 'py-12 text-center',
    noResultsTitle: 'text-xl font-medium',
    noResultsText: 'mt-2 text-gray-600'
  }
});

const {
  container,
  form,
  error,
  loadingContainer,
  loadingContent,
  loadingSpinner,
  loadingText,
  resultsSection,
  resultsTitle,
  resultsGrid,
  noResultsContainer,
  noResultsTitle,
  noResultsText
} = searchPage();

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(query);
  const { results, isLoading, error: searchError } = useRecipeSearch(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  useEffect(() => {
    // Update the search input when the URL query changes
    setSearchQuery(query);
  }, [query]);

  return (
    <div className={container()}>
      <form onSubmit={handleSearch} className={form()}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </form>

      {searchError && (
        <div className={error()}>
          {searchError}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className={loadingContainer()}>
          <div className={loadingContent()}>
            <div className={loadingSpinner()}></div>
            <p className={loadingText()}>Searching recipes...</p>
          </div>
        </div>
      )}

      {/* Results found */}
      {!isLoading && results.length > 0 && (
        <div className={resultsSection()}>
          <h2 className={resultsTitle()}>Results for "{query}"</h2>
          <div className={resultsGrid()}>
            {results.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* No results found */}
      {!isLoading && results.length === 0 && query && (
        <div className={noResultsContainer()}>
          <h2 className={noResultsTitle()}>No recipes found for "{query}"</h2>
          <p className={noResultsText()}>Try a different search term or browse our suggestions.</p>
        </div>
      )}
    </div>
  );
}
