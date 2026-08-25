import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/authSlice';
import jobsReducer from '@/store/jobsSlice';
import offersReducer from '@/store/offersSlice';
import trackingReducer from '@/store/trackingSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    offers: offersReducer,
    tracking: trackingReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
