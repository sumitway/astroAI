import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { PanchangaResponse } from '../api';

interface PanchangaState {
  today: PanchangaResponse | null;
  selectedDate: string;
  location: { latitude: number; longitude: number; name: string } | null;
}

const initialState: PanchangaState = {
  today: null,
  selectedDate: new Date().toISOString().split('T')[0],
  location: null,
};

const panchangaSlice = createSlice({
  name: 'panchanga',
  initialState,
  reducers: {
    setPanchanga(state, action: PayloadAction<PanchangaResponse>) {
      state.today = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string>) {
      state.selectedDate = action.payload;
    },
    setLocation(state, action: PayloadAction<{ latitude: number; longitude: number; name: string }>) {
      state.location = action.payload;
    },
  },
});

export const { setPanchanga, setSelectedDate, setLocation } = panchangaSlice.actions;
export default panchangaSlice.reducer;
