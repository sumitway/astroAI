import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { BirthDataInput } from '../api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthData?: BirthDataInput;
  savedCharts: SavedChart[];
  plan: 'free' | 'basic' | 'premium';
}

export interface SavedChart {
  id: string;
  name: string;
  birthData: BirthDataInput;
  isPrimary: boolean;
  createdAt: string;
}

interface UserState {
  profile: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  activeSavedChartId: string | null;
}

const initialState: UserState = {
  profile: null,
  accessToken: null,
  isAuthenticated: false,
  activeSavedChartId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ profile: UserProfile; token: string }>) {
      state.profile = action.payload.profile;
      state.accessToken = action.payload.token;
      state.isAuthenticated = true;
    },
    clearUser(state) {
      state.profile = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.activeSavedChartId = null;
    },
    addSavedChart(state, action: PayloadAction<SavedChart>) {
      state.profile?.savedCharts.push(action.payload);
    },
    removeSavedChart(state, action: PayloadAction<string>) {
      if (state.profile) {
        state.profile.savedCharts = state.profile.savedCharts.filter(
          c => c.id !== action.payload
        );
      }
    },
    setActiveSavedChart(state, action: PayloadAction<string>) {
      state.activeSavedChartId = action.payload;
    },
    updateBirthData(state, action: PayloadAction<BirthDataInput>) {
      if (state.profile) {
        state.profile.birthData = action.payload;
      }
    },
  },
});

export const {
  setUser, clearUser, addSavedChart, removeSavedChart,
  setActiveSavedChart, updateBirthData,
} = userSlice.actions;

export default userSlice.reducer;
