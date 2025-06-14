import { Link } from 'react-router-dom';
import { tv } from 'tailwind-variants';
import type { RecipePreview } from '../types/recipe';

const recipeCard = tv({
  slots: {
    link: 'group',
    container: 'overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-lg',
    imageContainer: 'aspect-video w-full overflow-hidden',
    image: 'h-full w-full object-cover transition-transform group-hover:scale-105',
    content: 'p-4',
    title: 'text-xl font-semibold text-gray-900',
    description: 'mt-2 line-clamp-2 text-gray-600'
  }
});

const { link, container, imageContainer, image, content, title, description } = recipeCard();

interface RecipeCardProps {
  readonly recipe: RecipePreview;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link to={`/recipes/${recipe.id}`} className={link()}>
      <article className={container()}>
        <div className={imageContainer()}>
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className={image()}
          />
        </div>
        <div className={content()}>
          <h3 className={title()}>{recipe.name}</h3>
          <p className={description()}>{recipe.description}</p>
        </div>
      </article>
    </Link>
  );
}
