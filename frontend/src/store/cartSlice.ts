import { createSlice } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../types';
import type {  PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: CartItem[];
}

// Khôi phục giỏ hàng từ localStorage khi khởi động
const loadState = (): CartState => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return { items: [] };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return { items: [] };
  }
};

// Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
const saveState = (items: CartItem[]) => {
  try {
    const serializedState = JSON.stringify({ items });
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    console.error('Could not save cart to local storage', err);
  }
};

const initialState: CartState = loadState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        // Khi đã tồn tại, chỉ tăng quantity, không kiểm tra stock ở đây
        // (Stock được kiểm tra và giảm trước khi dispatch addToCart)
        existingItem.quantity += 1;
      } else {
        // Khi thêm mới, luôn cho phép add (stock đã được kiểm tra từ component)
        state.items.push({ ...action.payload, quantity: 1 });
      }
      saveState(state.items);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveState(state.items);
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      if (item && action.payload.quantity > 0) {
        item.quantity = action.payload.quantity;
      }
      saveState(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      saveState(state.items);
    }
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;