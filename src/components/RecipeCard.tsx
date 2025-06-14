import { Link } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import type { RecipePreview } from '../types/recipe';

const cardLink = tv({
  base: 'group'
});

const cardContainer = tv({
  base: 'overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg'
});

const imageContainer = tv({
  base: 'aspect-video w-full overflow-hidden'
});

const cardImage = tv({
  base: 'h-full w-full object-cover transition-transform group-hover:scale-105'
});

const cardContent = tv({
  base: 'p-4'
});

const cardTitle = tv({
  base: 'text-xl font-semibold text-gray-900'
});

const cardDescription = tv({
  base: 'mt-2 line-clamp-2 text-gray-600'
});

interface RecipeCardProps {
  readonly recipe: RecipePreview;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${recipe.id}`} className={cardLink()}>
      <article className={cardContainer()}>
        <div className={imageContainer()}>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className={cardImage()}
          />
        </div>
        <div className={cardContent()}>
          <h3 className={cardTitle()}>{recipe.name}</h3>
          <p className={cardDescription()}>{recipe.description}</p>
        </div>
      </article>
    </Link>
  );
}
