import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { RecipeCard } from '../components/RecipeCard';
import { SearchInput } from '../components/SearchInput';
import { useRecipeSearch } from '../hooks/useRecipes';

const pageContainer = tv({
  base: 'py-4'
});

const searchForm = tv({
  base: 'mb-8 flex gap-4'
});

const errorMessage = tv({
  base: 'rounded-md bg-red-50 p-4 text-red-700'
});

const loadingContainer = tv({
  base: 'grid place-items-center py-12'
});

const loadingContent = tv({
  base: 'text-center'
});

const loadingSpinner = tv({
  base: 'h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600'
});

const loadingText = tv({
  base: 'mt-2 text-gray-600'
});

const resultsSection = tv({
  base: ''
});

const resultsTitle = tv({
  base: 'mb-6 text-xl font-semibold'
});

const resultsGrid = tv({
  base: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3'
});

const noResultsContainer = tv({
  base: 'py-12 text-center'
});

const noResultsTitle = tv({
  base: 'text-xl font-medium'
});

const noResultsText = tv({
  base: 'mt-2 text-gray-600'
});

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(query);
  const { results, isLoading, error } = useRecipeSearch(query);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { q: searchQuery } : {});
  };

  useEffect(() => {
    // Update the search input when the URL query changes
    setSearchQuery(query);
  }, [query]);

  return (
    <div className={pageContainer()}>
      <form onSubmit={handleSearch} className={searchForm()}>
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </form>

      {error && (
        <div className={errorMessage()}>
          {error}
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
