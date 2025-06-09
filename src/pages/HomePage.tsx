import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { SearchInput } from '../components/SearchInput';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative isolate h-screen bg-white px-6 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Find the Perfect Recipe
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Discover delicious recipes for any occasion. Simple, easy, and tasty ideas for your next meal.
          </p>
          <div className="mt-10">
            <form onSubmit={handleSearch} className="flex flex-col gap-4 sm:flex-row">
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients, or meal types..."
                aria-label="Search for recipes"
                className="flex-1"
              />
              <Button type="submit">
                Search
              </Button>
            </form>
          </div>
          <div className="mt-10">
            <div className="flex flex-wrap justify-center gap-2">
              {['Italian', 'Vegetarian', 'Dessert', 'Quick', 'Healthy'].map((tag) => (
                <Button 
                  key={tag} 
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery(tag);
                    navigate(`/search?q=${encodeURIComponent(tag)}`);
                  }}
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
