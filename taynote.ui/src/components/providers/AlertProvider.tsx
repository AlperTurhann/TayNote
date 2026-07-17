'use client';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import AlertRB from '@/components/AlertRB';
import { AlertContext, AlertContextType, AlertInfo } from '@/context/AlertContext';
import { registerErrorHandler } from '@/lib/alertBus';

interface Props {
  children: ReactNode;
}

const AlertProvider = ({ children }: Props) => {
  const [alertInfos, setAlertInfos] = useState<AlertInfo[]>([]);

  const hideAlert = useCallback((alertId: string) => {
    setAlertInfos((prev) => prev.filter((alert) => alert.id !== alertId));
  }, []);

  const showAlert = useCallback((description: string) => {
    setAlertInfos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: 'Successful',
        description: description,
        type: 'success'
      }
    ]);
  }, []);

  const showErrorAlert = useCallback((description: string) => {
    setAlertInfos((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        title: 'Failed',
        description: description,
        type: 'failure'
      }
    ]);
  }, []);

  const value = useMemo<AlertContextType>(
    () => ({
      showAlert,
      showErrorAlert,
      hideAlert,
      alertInfos
    }),
    [showAlert, showErrorAlert, hideAlert, alertInfos]
  );

  useEffect(() => {
    registerErrorHandler(showErrorAlert);
    return () => registerErrorHandler(null);
  }, [showErrorAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <AlertRB />
    </AlertContext.Provider>
  );
};

export default AlertProvider;
