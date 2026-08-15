import { createSlice } from '@reduxjs/toolkit';

import { FetchOperations } from '@/models/FetchOperations';
import { SavedColorWithStatus } from '@/models/SavedColor';
import {
  addSavedColorAsync,
  deleteSavedColorAsync,
  getSavedColorsAsync
} from '@/services/savedColorService';

interface SavedColorState {
  savedColors: SavedColorWithStatus[];
  getSavedColors: FetchOperations;
  addSavedColor: FetchOperations;
}

const initialState: SavedColorState = {
  savedColors: [],
  getSavedColors: {
    isLoading: false
  },
  addSavedColor: {
    isLoading: false
  }
};

const findSavedColor = (state: SavedColorState, savedColorId: string) =>
  state.savedColors.find((savedColor) => savedColor.id === savedColorId);

const savedColorSlice = createSlice({
  name: 'savedColor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //#region Get Saved Colors
    builder
      .addCase(getSavedColorsAsync.pending, (state) => {
        state.getSavedColors.isLoading = true;
      })
      .addCase(getSavedColorsAsync.fulfilled, (state, action) => {
        state.savedColors = (action.payload.data ?? []).map((savedColor) => ({
          ...savedColor,
          isDeleting: false
        }));
        state.getSavedColors.isLoading = false;
        state.getSavedColors.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Add Saved Color
    builder
      .addCase(addSavedColorAsync.pending, (state) => {
        state.addSavedColor.isLoading = true;
      })
      .addCase(addSavedColorAsync.fulfilled, (state, action) => {
        state.addSavedColor.isLoading = false;
        state.addSavedColor.error = action.payload.error ?? undefined;
      });
    //#endregion
    //#region Delete Saved Color
    builder
      .addCase(deleteSavedColorAsync.pending, (state, action) => {
        const savedColor = findSavedColor(state, action.meta.arg);
        if (savedColor) savedColor.isDeleting = true;
      })
      .addCase(deleteSavedColorAsync.fulfilled, (state, action) => {
        const savedColor = findSavedColor(state, action.meta.arg);
        if (savedColor) savedColor.isDeleting = false;
      });
    //#endregion
  }
});

export const selectSavedColors = (state: { savedColor: SavedColorState }) =>
  state.savedColor.savedColors;
export const selectGetSavedColorsIsLoading = (state: { savedColor: SavedColorState }) =>
  state.savedColor.getSavedColors.isLoading;
export const selectIsAddingSavedColor = (state: { savedColor: SavedColorState }) =>
  state.savedColor.addSavedColor.isLoading;

export default savedColorSlice.reducer;
