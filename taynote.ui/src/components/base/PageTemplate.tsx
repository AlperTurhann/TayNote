import React, { ReactNode } from 'react';

import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const PageTemplate = ({ children, className }: Props) => {
  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <Header />
      <div className={cn('flex flex-col flex-1 min-h-0 p-3 gap-y-3 sm:p-4 sm:gap-y-4', className)}>
        {children}
      </div>
    </div>
  );
};

export { PageTemplate };
