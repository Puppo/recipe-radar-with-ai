import { tv } from 'tailwind-variants';

const loadingState = tv({
  slots: {
    container: 'grid place-items-center py-24',
    content: 'text-center',
    spinner: 'h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600 mx-auto',
    text: 'mt-4 text-xl text-gray-600',
  }
});

const { container, content, spinner, text } = loadingState();

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className={container()}>
      <div className={content()}>
        <div className={spinner()}></div>
        <p className={text()}>{message}</p>
      </div>
    </div>
  );
}
