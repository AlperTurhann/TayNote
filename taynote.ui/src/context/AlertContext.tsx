import { createContext, useContext } from 'react';

interface AlertInfo {
  id: string;
  title: string;
  description: string;
  type: 'success' | 'failure';
}

type AlertContextType = {
  showAlert: (description: string) => void;
  showErrorAlert: (description: string) => void;
  hideAlert: (alertId: string) => void;
  alertInfos: AlertInfo[];
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const useAlertContext = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlertContext must be used within an AlertProvider');
  }
  return context;
};

export { AlertContext, useAlertContext };
export type { AlertInfo, AlertContextType };
