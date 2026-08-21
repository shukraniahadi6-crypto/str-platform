import * as SecureStore from 'expo-secure-store';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthPayload, User } from '@/lib/types';
import { STORAGE_KEYS } from '@/lib/constants';
import * as authService from '@/services/auth';

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const persistTokens = async ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
  await SecureStore.setItemAsync(STORAGE_KEYS.authToken, accessToken);
  await SecureStore.setItemAsync(STORAGE_KEYS.refreshToken, refreshToken);
};

export const hydrateAuth = createAsyncThunk('auth/hydrate', async () => {
  const [accessToken, refreshToken] = await Promise.all([
    SecureStore.getItemAsync(STORAGE_KEYS.authToken),
    SecureStore.getItemAsync(STORAGE_KEYS.refreshToken),
  ]);

  if (!accessToken || !refreshToken) {
    throw new Error('No active session found');
  }

  const response = await authService.refreshToken({ refreshToken });
  await persistTokens(response);
  return response;
});

export const login = createAsyncThunk('auth/login', async (payload: { email: string; password: string }) => {
  const response = await authService.login(payload);
  await persistTokens(response);
  return response;
});

export const signup = createAsyncThunk('auth/signup', async (payload: Record<string, string>) => {
  const response = await authService.signup(payload);
  await persistTokens(response);
  return response;
});

export const refreshSession = createAsyncThunk('auth/refresh', async () => {
  const refreshToken = await SecureStore.getItemAsync(STORAGE_KEYS.refreshToken);
  if (!refreshToken) {
    throw new Error('Missing refresh token');
  }
  const response = await authService.refreshToken({ refreshToken });
  await persistTokens(response);
  return response;
});

export const logout = createAsyncThunk('auth/logout', async (_, { getState }) => {
  const state = getState() as { auth: AuthState };
  await authService.logout(state.auth.token ?? undefined);
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.authToken),
    SecureStore.deleteItemAsync(STORAGE_KEYS.refreshToken),
  ]);
});

const applyAuthPayload = (state: AuthState, payload: AuthPayload) => {
  state.user = payload.user;
  state.token = payload.accessToken;
  state.refreshToken = payload.refreshToken;
  state.isAuthenticated = true;
  state.loading = false;
  state.error = null;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        applyAuthPayload(state, action.payload);
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        applyAuthPayload(state, action.payload);
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        applyAuthPayload(state, action.payload);
      })
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        applyAuthPayload(state, action.payload);
      })
      .addCase(logout.fulfilled, () => initialState)
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.error.message ?? 'Something went wrong';
          if (action.type === logout.rejected.type) return;
          if (action.type === hydrateAuth.rejected.type || action.type === refreshSession.rejected.type) {
            state.isAuthenticated = false;
            state.token = null;
            state.refreshToken = null;
            state.user = null;
          }
        },
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.loading = true;
        },
      );
  },
});

export const { clearAuthError, updateUser } = authSlice.actions;
export default authSlice.reducer;
