import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

interface UserState {
  // User session (for /account, user-facing pages)
  isLoggedIn: boolean;
  profile: UserProfile | null;
  // Admin session (for /admin pages) — separate so two tabs don't conflict
  isAdminLoggedIn: boolean;
  adminProfile: UserProfile | null;
}

const initialState: UserState = {
  isLoggedIn: false,
  profile: null,
  isAdminLoggedIn: false,
  adminProfile: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        id?: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        role?: string;
      }>,
    ) => {
      state.isLoggedIn = true;
      state.profile = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone || '',
        address: action.payload.address || '',
        role: action.payload.role || 'USER',
      };
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.profile = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
        // Keep localStorage in sync so the next page refresh restores the updated profile.
        const stored = localStorage.getItem('user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              'user',
              JSON.stringify({ ...parsed, ...action.payload }),
            );
          } catch {
            // ignore
          }
        }
      }
    },

    // ── Admin session actions ──────────────────────────────────────────
    adminLogin: (
      state,
      action: PayloadAction<{
        id?: string;
        name: string;
        email: string;
        phone?: string;
        address?: string;
        role?: string;
      }>,
    ) => {
      state.isAdminLoggedIn = true;
      state.adminProfile = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        phone: action.payload.phone || '',
        address: action.payload.address || '',
        role: action.payload.role || 'ADMIN',
      };
    },
    adminLogout: (state) => {
      state.isAdminLoggedIn = false;
      state.adminProfile = null;
    },
    updateAdminProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (state.adminProfile) {
        state.adminProfile = { ...state.adminProfile, ...action.payload };
        const stored = localStorage.getItem('admin_user');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            localStorage.setItem(
              'admin_user',
              JSON.stringify({ ...parsed, ...action.payload }),
            );
          } catch {
            // ignore
          }
        }
      }
    },
  },
});

export const {
  login,
  logout,
  updateProfile,
  adminLogin,
  adminLogout,
  updateAdminProfile,
} = userSlice.actions;
export default userSlice.reducer;