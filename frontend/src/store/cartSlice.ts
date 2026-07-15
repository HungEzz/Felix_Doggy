import { createSlice } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../types';
import type { PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: CartItem[];
}

// Read cart from localStorage on startup — persist across reload
const loadCartFromStorage = (): CartState => {
  try {
    const raw = localStorage.getItem('cart');
    if (!raw) return { items: [] };
    const parsed = JSON.parse(raw);
    // Validate shape: must have items as an array to prevent crash if data is corrupted
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };
    return parsed as CartState;
  } catch {
    return { items: [] };
  }
};

// This function is called from main.tsx via store.subscribe() to auto-save whenever cart changes
export const saveCartToStorage = (state: CartState) => {
  try {
    localStorage.setItem('cart', JSON.stringify(state));
  } catch {
    // Ignore quota exceeded errors
  }
};

const initialState: CartState = loadCartFromStorage();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // quantity: number of items to add (default 1). Stock check is done at component level.
    addToCart: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;