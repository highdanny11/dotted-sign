import clsx from 'clsx';
import { InputProps } from 'react-html-props';
import { twMerge } from 'tailwind-merge';

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      type="text"
      {...props}
      className={twMerge(clsx(
        'border-grey text-dark-grey placeholder:text-dark-grey/50 focus:border-brand focus-within:outline-brand h-10 rounded border px-3 py-2 text-xs',
        className
      ))}
    />
  );
}
