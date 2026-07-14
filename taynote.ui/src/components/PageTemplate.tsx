import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  children: ReactNode;
  className?: string;
}

const PageTemplate = ({ children, className }: Props) => {
  return <div className={cn('flex flex-col p-4 gap-y-4', className)}>{children}</div>;
};

export default PageTemplate;
