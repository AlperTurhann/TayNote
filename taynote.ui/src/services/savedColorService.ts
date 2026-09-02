import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { AppDispatch } from '@/lib/store';
import { CreateSavedColor, SavedColor } from '@/models/SavedColor';
import { tryCatch, TryCatchResult } from '@/utils/tryCatch';

type ThunkConfig = { dispatch: AppDispatch };

const getSavedColorsAsync = createAsyncThunk(
  'savedColors/getSavedColorsAsync',
  async (): Promise<TryCatchResult<SavedColor[]>> => {
    return await tryCatch<SavedColor[]>(
      axios
        .get<SavedColor[]>(`/api/saved-colors`)
        .then((res) => res.data)
    );
  }
);

const addSavedColorAsync = createAsyncThunk<TryCatchResult<SavedColor>, CreateSavedColor, ThunkConfig>(
  'savedColors/addSavedColorAsync',
  async (data, { dispatch }) => {
    const result = await tryCatch<SavedColor>(
      axios
        .post<SavedColor>(`/api/saved-colors`, data)
        .then((res) => res.data)
    );
    if (!result.error) dispatch(getSavedColorsAsync());
    return result;
  }
);

const deleteSavedColorAsync = createAsyncThunk<TryCatchResult<void>, string, ThunkConfig>(
  'savedColors/deleteSavedColorAsync',
  async (savedColorId, { dispatch }) => {
    const result = await tryCatch<void>(
      axios
        .delete<void>(`/api/saved-colors/${savedColorId}`)
        .then((res) => res.data)
    );
    if (!result.error) dispatch(getSavedColorsAsync());
    return result;
  }
);

export { getSavedColorsAsync, addSavedColorAsync, deleteSavedColorAsync };
