'use client';
import { NotebookPen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import { Button } from '@/components/base/Button';
import { BoardSelector } from '@/components/BoardSelector';
import { RightPanel } from '@/components/layout/RightPanel';

const Header = () => {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);

  return (
    <header className="relative z-40 flex h-14 shrink-0 items-center justify-between gap-x-3 border-b bg-base-900/80 px-3 backdrop-blur sm:px-4">
      <Link
        href="/"
        title="Go to home"
        className="flex items-center gap-x-2 rounded-md p-1 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70"
      >
        <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
          <NotebookPen size={18} />
        </span>
        <span className="text-lg font-semibold tracking-tight text-base-100">TayNote</span>
      </Link>
      <div className="flex min-w-0 items-center justify-end gap-x-2">
        <BoardSelector />
        <Button
          colorVariant="ghost"
          className="shrink-0"
          title={isRightPanelOpen ? 'Close labels panel' : 'Open labels panel'}
          aria-expanded={isRightPanelOpen}
          onClick={() => setIsRightPanelOpen((prev) => !prev)}
        >
          {isRightPanelOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
        </Button>
      </div>
      <RightPanel isOpen={isRightPanelOpen} />
    </header>
  );
};

export { Header };
