type ErrorHandler = (message: string) => void;

let errorHandler: ErrorHandler | null = null;

const registerErrorHandler = (handler: ErrorHandler | null) => {
  errorHandler = handler;
};

const emitError = (message: string) => {
  errorHandler?.(message);
};

export { emitError, registerErrorHandler };
