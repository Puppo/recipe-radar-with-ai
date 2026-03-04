import { useNavigate } from 'react-router-dom';
import { tv } from 'tailwind-variants';

const homePage = tv({
  slots: {
    container: 'relative isolate min-h-screen bg-white px-6 lg:px-8',
    content: 'mx-auto max-w-2xl pt-32 pb-12 sm:pt-48 lg:pt-56',
    textSection: 'text-center',
    title: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl',
    subtitle: 'mt-6 text-lg leading-8 text-gray-600',
    aiFilterSection: 'mt-10 rounded-lg border border-purple-200 bg-purple-50 p-4 text-left',
    aiFilterLabel: 'mb-2 flex items-center gap-1.5 text-sm font-medium text-purple-800',
    aiFilterInputWrapper: 'relative',
    aiFilterInput:
      'w-full rounded-md border border-purple-300 bg-white py-2 pl-4 pr-10 text-sm shadow-sm placeholder:text-gray-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500',
  }
});

const {
  container,
  content,
  textSection,
  title,
  subtitle,
  aiFilterSection,
  aiFilterLabel,
  aiFilterInputWrapper,
  aiFilterInput,
} = homePage();

function navigateWithTransition(navigate: ReturnType<typeof useNavigate>, url: string) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      navigate(url);
    });
  } else {
    navigate(url);
  }
}

const viewTransitionConfig = { viewTransitionName: 'ai-filter-section' };

export function HomePage() {
  const navigate = useNavigate();

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

          <div className={aiFilterSection()} style={viewTransitionConfig}>
            <label className={aiFilterLabel()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 0 1 .672 0 41.059 41.059 0 0 1 8.198 5.424.75.75 0 0 1-.254 1.285 31.372 31.372 0 0 0-7.86 3.83.75.75 0 0 1-.84 0 31.508 31.508 0 0 0-2.08-1.287V9.394c0-.244.116-.463.302-.592a35.504 35.504 0 0 1 3.305-2.033.75.75 0 0 0-.714-1.319 37 37 0 0 0-3.446 2.12A2.216 2.216 0 0 0 6 9.393v.38a31.293 31.293 0 0 0-4.28-1.746.75.75 0 0 1-.254-1.285 41.059 41.059 0 0 1 8.198-5.424ZM6 11.459a29.848 29.848 0 0 0-2.455-1.158 41.029 41.029 0 0 0-.39 3.114.75.75 0 0 0 .419.74c.528.256 1.046.53 1.554.82-.21.324-.455.63-.739.914a.75.75 0 1 0 1.06 1.06c.37-.369.69-.77.96-1.193a26.61 26.61 0 0 1 3.095 2.348.75.75 0 0 0 .992 0 26.547 26.547 0 0 1 5.93-3.95.75.75 0 0 0 .42-.739 41.053 41.053 0 0 0-.39-3.114 29.925 29.925 0 0 0-5.199 2.801 2.25 2.25 0 0 1-2.514 0c-.41-.275-.833-.54-1.267-.794Z" clipRule="evenodd" />
              </svg>
              AI Filter
            </label>

            <div className={aiFilterInputWrapper()}>
              <input
                type="text"
                className={aiFilterInput()}
                style={{ viewTransitionName: 'ai-filter-input' }}
                placeholder='e.g. "quick vegetarian recipes" or "something with pasta"'
                onChange={(e) => {
                  const value = e.target.value.trim();
                  if (value) {
                    navigateWithTransition(navigate, `/search?filter=${encodeURIComponent(value)}`);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
