'use client';
import { House, PanelRightClose, PanelRightOpen } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/base/Button';
import { LinkButton } from '@/components/base/LinkButton';
import { BoardSelector } from '@/components/BoardSelector';
import { RightPanel } from '@/components/layout/RightPanel';

const Header = () => {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(false);

  return (
    <header className="relative grid grid-cols-3 border-b p-4">
      <div className="flex items-center gap-x-2">
        <LinkButton href="/" colorVariant="ghost" className="rounded">
          <House />
        </LinkButton>
      </div>
      <h1 className="text-center font-bold text-3xl text-base-100">TayNote</h1>
      <div className="flex items-center justify-end gap-x-2">
        <BoardSelector />
        <Button
          colorVariant="ghost"
          className="rounded"
          title={isRightPanelOpen ? 'Close right panel' : 'Open right panel'}
          onClick={() => setIsRightPanelOpen((prev) => !prev)}
        >
          {isRightPanelOpen ? <PanelRightClose /> : <PanelRightOpen />}
        </Button>
      </div>
      <RightPanel isOpen={isRightPanelOpen} setIsOpen={setIsRightPanelOpen} />
    </header>
  );
};

export { Header };
