import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RecipeCard } from '../components/RecipeCard';
import { SearchInput } from '../components/SearchInput';
import { useRecipeSearch } from '../hooks/useRecipes';

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
    <div className="py-4">
      <form onSubmit={handleSearch} className="mb-8 flex gap-4">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
        />
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid place-items-center py-12">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Searching recipes...</p>
          </div>
        </div>
      )}

      {/* Results found */}
      {!isLoading && results.length > 0 && (
        <div>
          <h2 className="mb-6 text-xl font-semibold">Results for "{query}"</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      )}

      {/* No results found */}
      {!isLoading && results.length === 0 && query && (
        <div className="py-12 text-center">
          <h2 className="text-xl font-medium">No recipes found for "{query}"</h2>
          <p className="mt-2 text-gray-600">Try a different search term or browse our suggestions.</p>
        </div>
      )}
    </div>
  );
}
