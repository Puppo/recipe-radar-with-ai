import { type ComponentProps, forwardRef } from 'react';
import { tv } from 'tailwind-variants';

const input = tv({
  base: 'rounded-md border px-4 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm',
  variants: {
    fullWidth: {
      true: 'w-full',
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

type InputProps = ComponentProps<'input'> & {
  fullWidth?: boolean;
};

export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  function SearchInput({ fullWidth, className, ...props }, ref) {
    return (
      <input
        ref={ref}
        type="search"
        className={input({ fullWidth, className })}
        placeholder="Search recipes..."
        {...props}
      />
    );
  }
);
