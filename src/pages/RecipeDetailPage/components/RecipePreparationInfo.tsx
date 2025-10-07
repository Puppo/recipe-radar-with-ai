import { tv } from 'tailwind-variants';

const recipePreparation = tv({
  slots: {
    sidebar: 'rounded-lg bg-gray-50 p-6',
    title: 'text-lg font-semibold',
    list: 'mt-4 space-y-4',
    item: '',
    label: 'text-sm text-gray-500',
    value: 'font-medium',
  }
});

const { sidebar, title, list, item, label, value } = recipePreparation();

interface RecipePreparationInfoProps {
  prepTime: string;
  cookTime: string;
  servings: number;
}

export function RecipePreparationInfo({ prepTime, cookTime, servings }: RecipePreparationInfoProps) {
  return (
    <div className={sidebar()}>
      <h2 className={title()}>Preparation</h2>
      <dl className={list()}>
        <div className={item()}>
          <dt className={label()}>Prep Time</dt>
          <dd className={value()}>{prepTime}</dd>
        </div>
        <div className={item()}>
          <dt className={label()}>Cook Time</dt>
          <dd className={value()}>{cookTime}</dd>
        </div>
        <div className={item()}>
          <dt className={label()}>Servings</dt>
          <dd className={value()}>{servings}</dd>
        </div>
      </dl>
    </div>
  );
}
