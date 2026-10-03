'use client';
import { RotateCcw } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/base/Button';
import { useAppDispatch } from '@/lib/hooks';
import { resetAllFiltersAsync } from '@/services/taskService';

const ClearFiltersButton = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const onClearFilters = () => {
    dispatch(resetAllFiltersAsync());
    router.replace(pathname, { scroll: false });
  };

  return (
    <Button
      colorVariant="secondary"
      className="h-9 px-2.5 text-sm"
      onClick={onClearFilters}
      title="Clear all filters and sorting"
    >
      <RotateCcw size={16} />
      <span className="hidden sm:inline">Clear filters</span>
    </Button>
  );
};

export { ClearFiltersButton };
