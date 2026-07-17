import axios from 'axios';

type TryCatchResult<T> = { error: string | null; data: T | null };

const tryCatch = async <T>(
  promise: Promise<T>,
  defaultResult: T | null = null
): Promise<TryCatchResult<T>> => {
  try {
    const result = await promise;
    return { error: null, data: result };
  } catch (error) {
    let err: string;

    const backendMessage = axios.isAxiosError(error) ? error.response?.data?.message : undefined;

    if (typeof backendMessage === 'string') err = backendMessage;
    else if (error instanceof Error) err = error.message;
    else if (typeof error === 'string') err = error;
    else err = 'Unexpected Error';

    return { error: err, data: defaultResult };
  }
};

export { tryCatch };
export type { TryCatchResult };
