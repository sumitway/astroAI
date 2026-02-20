import { configureStore } from '@reduxjs/toolkit';
import { api } from './api';
import chartReducer from './slices/chartSlice';
import userReducer from './slices/userSlice';
import panchangaReducer from './slices/panchangaSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    chart: chartReducer,
    user: userReducer,
    panchanga: panchangaReducer,
    chat: chatReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
