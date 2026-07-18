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
      className="rounded border gap-x-2"
      onClick={onClearFilters}
      title="Clear all filters and sorting"
    >
      <RotateCcw size={18} />
      Clear Filters
    </Button>
  );
};

export { ClearFiltersButton };
