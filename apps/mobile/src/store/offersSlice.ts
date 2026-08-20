import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '@/lib/types';
import * as offersService from '@/services/offers';

interface OffersState {
  pendingOffers: Offer[];
  activeOffer: Offer | null;
  offerHistory: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  pendingOffers: [],
  activeOffer: null,
  offerHistory: [],
  loading: false,
  error: null,
};

export const fetchPendingOffers = createAsyncThunk('offers/fetchPending', offersService.getPendingOffers);
export const fetchOfferHistory = createAsyncThunk('offers/history', offersService.getOfferHistory);
export const acceptOfferAction = createAsyncThunk('offers/accept', offersService.acceptOffer);
export const declineOfferAction = createAsyncThunk('offers/decline', offersService.declineOffer);

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {
    upsertOffer(state, action: PayloadAction<Offer>) {
      state.pendingOffers = [action.payload, ...state.pendingOffers.filter((offer) => offer.id !== action.payload.id)];
      state.activeOffer = action.payload;
    },
    setActiveOffer(state, action: PayloadAction<Offer | null>) {
      state.activeOffer = action.payload;
    },
    expireOffer(state, action: PayloadAction<string>) {
      state.pendingOffers = state.pendingOffers.filter((offer) => offer.id !== action.payload);
      if (state.activeOffer?.id === action.payload) {
        state.activeOffer = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOffers = action.payload;
      })
      .addCase(fetchOfferHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.offerHistory = action.payload;
      })
      .addCase(acceptOfferAction.fulfilled, (state, action) => {
        state.loading = false;
        state.activeOffer = action.payload;
        state.pendingOffers = state.pendingOffers.filter((offer) => offer.id !== action.payload.id);
        state.offerHistory = [action.payload, ...state.offerHistory.filter((offer) => offer.id !== action.payload.id)];
      })
      .addCase(declineOfferAction.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingOffers = state.pendingOffers.filter((offer) => offer.id !== action.payload.id);
        state.offerHistory = [action.payload, ...state.offerHistory.filter((offer) => offer.id !== action.payload.id)];
        if (state.activeOffer?.id === action.payload.id) {
          state.activeOffer = null;
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('offers/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('offers/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message ?? 'Unable to manage offers';
        },
      );
  },
});

export const { upsertOffer, setActiveOffer, expireOffer } = offersSlice.actions;
export default offersSlice.reducer;
