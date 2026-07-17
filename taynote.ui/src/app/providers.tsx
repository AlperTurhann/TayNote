'use client';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

import AlertProvider from '@/components/providers/AlertProvider';
import { makeStore } from '@/lib/store';

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const storeRef = useRef<ReturnType<typeof makeStore>>(null);

  storeRef.current ??= makeStore();

  return (
    <AlertProvider>
      <Provider store={storeRef.current}>{children}</Provider>
    </AlertProvider>
  );
};

export { Providers };
