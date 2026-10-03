import React, { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';

interface Props {
  button: ReactNode;
  title?: string;
  description: string;
  handleAccept: () => void;
}

const VerificationRequiredButton = ({
  button,
  title = 'Are you absolutely sure?',
  description,
  handleAccept
}: Props) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{button}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm gap-0 p-0 sm:max-w-sm">
        <AlertDialogHeader className="p-6">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="rounded-b-xl border-t bg-base-900/60 p-4">
          <AlertDialogCancel variant="secondary">Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleAccept}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { VerificationRequiredButton };
