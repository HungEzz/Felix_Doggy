import { createSlice } from '@reduxjs/toolkit';
import type { Product } from '../types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface WishlistState {
  items: Product[];
}

const loadWishlistFromStorage = (): WishlistState => {
  try {
    const raw = localStorage.getItem('wishlist');
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed as WishlistState;
  } catch {
    return { items: [] };
  }
};

export const saveWishlistToStorage = (state: WishlistState) => {
  try {
    localStorage.setItem('wishlist', JSON.stringify(state));
  } catch {
    // Ignore quota exceeded errors
  }
};

const initialState: WishlistState = loadWishlistFromStorage();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<Product>) => {
      const product = action.payload;
      const index = state.items.findIndex(item => item.id === product.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(product);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearWishlist: (state) => {
      state.items = [];
    }
  }
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
