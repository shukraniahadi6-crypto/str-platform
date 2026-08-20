import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Coordinates, Geofence } from '@/lib/types';

interface TrackingState {
  isOnline: boolean;
  currentLocation: Coordinates | null;
  trackingInterval: number;
  geofences: Geofence[];
  permissionGranted: boolean;
}

const initialState: TrackingState = {
  isOnline: false,
  currentLocation: null,
  trackingInterval: 15000,
  geofences: [],
  permissionGranted: false,
};

const trackingSlice = createSlice({
  name: 'tracking',
  initialState,
  reducers: {
    setOnline(state, action: PayloadAction<boolean>) {
      state.isOnline = action.payload;
    },
    setCurrentLocation(state, action: PayloadAction<Coordinates | null>) {
      state.currentLocation = action.payload;
    },
    setTrackingInterval(state, action: PayloadAction<number>) {
      state.trackingInterval = action.payload;
    },
    setGeofences(state, action: PayloadAction<Geofence[]>) {
      state.geofences = action.payload;
    },
    setPermissionGranted(state, action: PayloadAction<boolean>) {
      state.permissionGranted = action.payload;
    },
  },
});

export const { setOnline, setCurrentLocation, setTrackingInterval, setGeofences, setPermissionGranted } = trackingSlice.actions;
export default trackingSlice.reducer;
