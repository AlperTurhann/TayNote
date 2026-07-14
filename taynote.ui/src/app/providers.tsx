'use client';
import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

import { makeStore } from '@/lib/store';

interface Props {
  children: ReactNode;
}

const Providers = ({ children }: Props) => {
  const storeRef = useRef<ReturnType<typeof makeStore>>(null);

  storeRef.current ??= makeStore();

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export { Providers };
