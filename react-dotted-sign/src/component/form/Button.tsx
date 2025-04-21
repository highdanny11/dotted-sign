import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ButtonProps } from 'react-html-props';

interface PrimayButton extends ButtonProps {
  theme: 'primary' | 'primary-outline' | 'primary-inline';
  size: 'sm' | 'md' | 'lg';
}
export function Button({
  className,
  theme,
  size,
  children,
  ...props
}: PrimayButton) {
  const getThemeClass = () => {
    switch (theme) {
      case 'primary':
        return 'bg-brand text-white hover:bg-brand-hover disabled:bg-ui-grey disabled:text-dark-grey';
      case 'primary-outline':
        return 'border-grey border text-dark hover:bg-brand hover:bg-primary disabled:bg-ui-grey disabled:text-dark-grey';
      case 'primary-inline':
        return 'text-brand';
    }
  };
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'h-8 rounded text-xs px-2 py-1';
      case 'md':
        return 'h-10 rounded text-sm py-2 px-4';
      case 'lg':
        return 'h-12 rounded text-base px-6 py-3 font-bold';
    }
  };
  return (
    <button
      type="button"
      {...props}
      className={twMerge(
        clsx('duration-200', getThemeClass(), getSizeClass(), className)
      )}>
      {children}
    </button>
  );
}
