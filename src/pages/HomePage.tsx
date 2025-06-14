import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { Button } from '../components/Button';
import { SearchInput } from '../components/SearchInput';

const pageContainer = tv({
  base: 'relative isolate h-screen bg-white px-6 lg:px-8'
});

const contentContainer = tv({
  base: 'mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'
});

const textSection = tv({
  base: 'text-center'
});

const mainTitle = tv({
  base: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'
});

const subtitle = tv({
  base: 'mt-6 text-lg leading-8 text-gray-600'
});

const searchSection = tv({
  base: 'mt-10'
});

const searchForm = tv({
  base: 'flex flex-col gap-4 sm:flex-row'
});

const searchInput = tv({
  base: 'flex-1'
});

const tagsSection = tv({
  base: 'mt-10'
});

const tagsContainer = tv({
  base: 'flex flex-wrap justify-center gap-2'
});

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
    <div className={pageContainer()}>
      <div className={contentContainer()}>
        <div className={textSection()}>
          <h1 className={mainTitle()}>
            Find the Perfect Recipe
          </h1>
          <p className={subtitle()}>
            Discover delicious recipes for any occasion. Simple, easy, and tasty ideas for your next meal.
          </p>
          <div className={searchSection()}>
            <form onSubmit={handleSearch} className={searchForm()}>
              <SearchInput
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients, or meal types..."
                aria-label="Search for recipes"
                className={searchInput()}
              />
              <Button type="submit">
                Search
              </Button>
            </form>
          </div>
          <div className={tagsSection()}>
            <div className={tagsContainer()}>
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
