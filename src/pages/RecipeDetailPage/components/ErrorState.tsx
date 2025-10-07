import { tv } from 'tailwind-variants';
import { Button } from '../../../components/Button';

const errorState = tv({
  slots: {
    container: 'py-4',
    content: 'rounded-lg bg-red-50 p-6 text-center',
    title: 'text-2xl font-bold text-red-800',
    text: 'mt-2 text-red-700',
    button: 'mt-6',
  }
});

const { container, content, title, text, button } = errorState();

interface ErrorStateProps {
  onGoBack: () => void;
}

export function ErrorState({ onGoBack }: ErrorStateProps) {
  return (
    <div className={container()}>
      <div className={content()}>
        <h1 className={title()}>Recipe Not Found</h1>
        <p className={text()}>The recipe you're looking for doesn't exist or has been removed.</p>
        <Button
          variant="primary"
          className={button()}
          onClick={onGoBack}
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}
