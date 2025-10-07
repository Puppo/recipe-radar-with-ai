import { tv } from 'tailwind-variants';

const recipeInstructions = tv({
  slots: {
    section: '',
    header: 'flex items-center justify-between',
    title: 'text-2xl font-bold',
    translatedLabel: 'text-sm text-gray-500 flex items-center gap-1',
    icon: 'h-3 w-3',
    list: 'mt-4 space-y-6',
    item: 'flex',
    number: 'mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-800',
    text: 'pt-1',
  }
});

const { section, header, title, translatedLabel, icon, list, item, number, text } = recipeInstructions();

interface RecipeInstructionsProps {
  instructions: string[];
  showTranslatedLabel?: boolean;
}

export function RecipeInstructions({ instructions, showTranslatedLabel = false }: RecipeInstructionsProps) {
  return (
    <section className={section()}>
      <div className={header()}>
        <h2 className={title()}>Instructions</h2>
        {showTranslatedLabel && (
          <span className={translatedLabel()}>
            <svg className={icon()} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
            Translated
          </span>
        )}
      </div>
      <ol className={list()}>
        {instructions.map((instruction, index) => (
          <li key={`instruction-${index}-${instruction.substring(0, 20)}`} className={item()}>
            <span className={number()}>
              {index + 1}
            </span>
            <span className={text()}>{instruction}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
