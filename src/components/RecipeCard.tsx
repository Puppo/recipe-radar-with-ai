import { Link } from 'react-router-dom';
import type { RecipePreview } from '../types/recipe';

interface RecipeCardProps {
  readonly recipe: RecipePreview;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="group">
      <article className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg">
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-900">{recipe.name}</h3>
          <p className="mt-2 line-clamp-2 text-gray-600">{recipe.description}</p>
        </div>
      </article>
    </Link>
  );
}
