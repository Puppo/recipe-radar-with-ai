import { tv } from 'tailwind-variants';

const recipeIngredients = tv({
  slots: {
    section: '',
    header: 'flex items-center justify-between',
    title: 'text-2xl font-bold',
    translatedLabel: 'text-sm text-gray-500 flex items-center gap-1',
    icon: 'h-3 w-3',
    list: 'mt-4 space-y-2',
    item: 'flex items-start',
    bullet: 'mr-2 mt-1 flex h-2 w-2 rounded-full bg-blue-600',
    text: '',
  }
});

const { section, header, title, translatedLabel, icon, list, item, bullet, text } = recipeIngredients();

interface RecipeIngredientsProps {
  ingredients: string[];
  showTranslatedLabel?: boolean;
}

export function RecipeIngredients({ ingredients, showTranslatedLabel = false }: RecipeIngredientsProps) {
  return (
    <section className={section()}>
      <div className={header()}>
        <h2 className={title()}>Ingredients</h2>
        {showTranslatedLabel && (
          <span className={translatedLabel()}>
            <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Translated
          </span>
        )}
      </div>
      <ul className={list()}>
        {ingredients.map((ingredient, index) => (
          <li key={`ingredient-${index}-${ingredient.substring(0, 20)}`} className={item()}>
            <span className={bullet()}></span>
            <span className={text()}>{ingredient}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
