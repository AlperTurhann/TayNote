import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap font-bold p-2 gap-x-1 text-base-100',
  {
    variants: {
      color: {
        default: 'bg-indigo-950 hover:bg-indigo-800',
        secondary: 'bg-base-700',
        green: 'bg-green-900 hover:bg-green-800',
        red: 'bg-red-950 hover:bg-red-900',
        white: 'bg-white/10 hover:bg-white/20',
        base: 'bg-base-600 hover:bg-base-500',
        ghost: 'hover:bg-gray-900/20'
      }
    },
    defaultVariants: {
      color: 'default'
    }
  }
);

interface Props extends React.ComponentProps<'button'> {
  colorVariant?: VariantProps<typeof buttonVariants>['color'];
}

const Button = ({ colorVariant, className, type = 'button', ...props }: Props) => {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ color: colorVariant }), className)}
      {...props}
    />
  );
};

export { Button };
