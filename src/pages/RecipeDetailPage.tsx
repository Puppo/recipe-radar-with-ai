import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { LanguageSelector } from '../components/LanguageSelector';
import { useRecipeById } from '../hooks/useRecipes';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading, error } = useRecipeById(id);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Navigate back function
  const goBack = () => navigate(-1);
  
  // Handle language change
  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    // TODO: Here you would typically trigger the translation API call
    console.log(`Translating recipe to: ${language}`);
  };

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="mt-4 text-xl text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="py-4">
        <div className="rounded-lg bg-red-50 p-6 text-center">
          <h1 className="text-2xl font-bold text-red-800">Recipe Not Found</h1>
          <p className="mt-2 text-red-700">The recipe you're looking for doesn't exist or has been removed.</p>
          <Button
            variant="primary"
            className="mt-6"
            onClick={goBack}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-white">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white/20"
              onClick={goBack}
            >
              ← Back
            </Button>
            
            <LanguageSelector
              selectedLanguage={selectedLanguage}
              onLanguageChange={handleLanguageChange}
              variant="dark"
            />
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl">{recipe.name}</h1>
          <p className="mt-4 max-w-2xl text-xl text-white/90">{recipe.description}</p>
          
          {/* Translation Status */}
          {selectedLanguage !== 'en' && (
            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full bg-blue-600/70 px-3 py-1 text-sm">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span>Translated to {selectedLanguage.toUpperCase()}</span>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex flex-wrap gap-2">
            {recipe.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-blue-600/70 px-3 py-1 text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recipe details */}
      <div className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Left sidebar with preparation info */}
          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="text-lg font-semibold">Preparation</h2>
            <dl className="mt-4 space-y-4">
              <div>
                <dt className="text-sm text-gray-500">Prep Time</dt>
                <dd className="font-medium">{recipe.prepTime}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Cook Time</dt>
                <dd className="font-medium">{recipe.cookTime}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Servings</dt>
                <dd className="font-medium">{recipe.servings}</dd>
              </div>
            </dl>
          </div>
          
          {/* Main recipe content */}
          <div className="md:col-span-2 space-y-8">
            {/* Ingredients */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Ingredients</h2>
                {selectedLanguage !== 'en' && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ul className="mt-4 space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={`ingredient-${ingredient}`} className="flex items-start">
                    <span className="mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600"></span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </section>
            
            {/* Instructions */}
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Instructions</h2>
                {selectedLanguage !== 'en' && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                    Translated
                  </span>
                )}
              </div>
              <ol className="mt-4 space-y-6">
                {recipe.instructions.map((instruction, index) => (
                  <li key={`instruction-${instruction.substring(0, 20)}`} className="flex">
                    <span className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800">
                      {index + 1}
                    </span>
                    <span className="pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
