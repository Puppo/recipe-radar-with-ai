import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import { Button } from '../components/Button';
import { SearchInput } from '../components/SearchInput';

const homePage = tv({
  slots: {
    container: 'relative isolate h-screen bg-white px-6 lg:px-8',
    content: 'mx-auto max-w-2xl py-32 sm:py-48 lg:py-56',
    textSection: 'text-center',
    title: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl',
    subtitle: 'mt-6 text-lg leading-8 text-gray-600',
    searchSection: 'mt-10',
    searchForm: 'flex flex-col gap-4 sm:flex-row',
    searchInput: 'flex-1',
    tagsSection: 'mt-10',
    tagsContainer: 'flex flex-wrap justify-center gap-2'
  }
});

const {
  container,
  content,
  textSection,
  title,
  subtitle,
  searchSection,
  searchForm,
  searchInput,
  tagsSection,
  tagsContainer
} = homePage();

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
    <div className={container()}>
      <div className={content()}>
        <div className={textSection()}>
          <h1 className={title()}>
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
