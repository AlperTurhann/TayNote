'use client';
import { AlertCircle, X } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { Button } from '@/components/base/Button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ALERT_AUTO_CLOSE, ALERT_AUTO_CLOSE_FAILURE } from '@/constants/alertConstants';
import { AlertInfo, useAlertContext } from '@/context/AlertContext';
import { cn } from '@/lib/utils';

const ALERT_GAP = 12;

interface AlertItemProps {
  alertInfo: AlertInfo;
  bottom: number;
  hideAlert: (alertId: string) => void;
  onHeightChange: (alertId: string, height: number) => void;
}

const AlertItem = ({ alertInfo, bottom, hideAlert, onHeightChange }: AlertItemProps) => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);

  const startTimer = () => {
    timerRef.current = setTimeout(
      () => {
        hideAlert(alertInfo.id);
      },
      alertInfo.type === 'failure' ? ALERT_AUTO_CLOSE_FAILURE : ALERT_AUTO_CLOSE
    );
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    startTimer();
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      onHeightChange(alertInfo.id, entry.target.getBoundingClientRect().height);
    });
    observer.observe(element);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alertInfo.id]);

  return (
    <Alert
      ref={elementRef}
      variant={`${alertInfo.type === 'failure' ? 'destructive' : 'default'}`}
      className={cn(
        'fixed right-3 z-50 w-[95%] transition-[bottom,color] duration-300 bg-base-100 hover:brightness-125 sm:w-1/2 md:w-1/3 lg:w-1/4'
      )}
      style={{ bottom: `${bottom}px` }}
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      <AlertCircle className="size-4" />
      <AlertTitle>{alertInfo.title}</AlertTitle>
      <AlertDescription className="text-xs lg:text-sm">{alertInfo.description}</AlertDescription>
      <Button
        colorVariant="ghost"
        className="absolute top-1 right-1 rounded-full p-1 text-destructive"
        onClick={() => hideAlert(alertInfo.id)}
      >
        <X className="size-4" />
      </Button>
    </Alert>
  );
};

const AlertRB = () => {
  const { alertInfos, hideAlert } = useAlertContext();
  const [heights, setHeights] = useState<Record<string, number>>({});

  const handleHeightChange = (alertId: string, height: number) => {
    setHeights((prev) => (prev[alertId] === height ? prev : { ...prev, [alertId]: height }));
  };

  if (alertInfos.length === 0) return null;

  let bottom = ALERT_GAP;

  return alertInfos.toReversed().map((alertInfo) => {
    const itemBottom = bottom;
    bottom += (heights[alertInfo.id] ?? 0) + ALERT_GAP;

    return (
      <AlertItem
        key={alertInfo.id}
        alertInfo={alertInfo}
        bottom={itemBottom}
        hideAlert={hideAlert}
        onHeightChange={handleHeightChange}
      />
    );
  });
};

export default AlertRB;
