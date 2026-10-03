import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'flex items-center justify-center whitespace-nowrap font-medium p-2 gap-x-1.5 rounded-md text-base-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      color: {
        default: 'bg-indigo-600 hover:bg-indigo-500',
        secondary: 'bg-base-700 hover:bg-base-600 border border-white/5',
        green: 'bg-emerald-600 hover:bg-emerald-500',
        red: 'bg-red-500/15 text-red-300 hover:bg-red-500/25',
        white: 'bg-white/8 hover:bg-white/15',
        base: 'bg-base-700 hover:bg-base-600',
        ghost: 'text-base-300 hover:bg-white/10 hover:text-base-100',
        darkGhost: 'hover:bg-black/20',
        foreground: 'text-base-300 hover:text-white'
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
