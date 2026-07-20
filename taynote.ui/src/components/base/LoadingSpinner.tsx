import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const LoadingSpinner = ({ className }: Props) => {
  return <Loader2 className={cn('animate-spin', className)} />;
};

export { LoadingSpinner };
