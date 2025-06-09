import { type ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
  base: 'rounded-md px-4 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
});

type ButtonProps = ComponentProps<'button'> & VariantProps<typeof button>;

export function Button({ 
  variant, 
  size, 
  fullWidth, 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={button({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  );
}
