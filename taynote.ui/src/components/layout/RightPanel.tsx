import React from 'react';

import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const RightPanel = ({ isOpen, setIsOpen }: Props) => {
  return (
    <aside
      className={cn(
        'w-48 h-[calc(100vh-100%)] z-50 absolute top-full right-0 flex flex-col items-center transition-all duration-500 border-l border-t p-4 bg-base-800',
        isOpen ? 'translate-x-0' : 'translate-x-full'
      )}
      onBlur={() => setIsOpen(() => false)}
    >
      RightPanel
    </aside>
  );
};

export { RightPanel };
