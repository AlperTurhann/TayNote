import { Middleware } from '@reduxjs/toolkit';

import { emitError } from '@/lib/alertBus';
import { TryCatchResult } from '@/utils/tryCatch';

const isTryCatchResult = (payload: unknown): payload is TryCatchResult<unknown> =>
  typeof payload === 'object' &&
  payload !== null &&
  'error' in payload &&
  'data' in payload;

const errorAlertMiddleware: Middleware = () => (next) => (action) => {
  if (
    typeof action === 'object' &&
    action !== null &&
    'payload' in action &&
    isTryCatchResult(action.payload) &&
    action.payload.error
  ) {
    emitError(action.payload.error);
  }
  return next(action);
};

export { errorAlertMiddleware };
