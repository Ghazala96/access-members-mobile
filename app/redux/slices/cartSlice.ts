import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  id: number;
  itemId: number;
  itemType: string;
  unitPrice?: number;
  quantity: number;
  totalPrice: number;
}

interface CartState {
  cartId: number | null;
  eventId: number | null;
  items: CartItem[];
  totalPrice: number;
}

const initialState: CartState = {
  cartId: null,
  eventId: null,
  items: [],
  totalPrice: 0
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart(
      state,
      action: PayloadAction<{
        cartId: string;
        eventId: string;
        items: CartItem[];
        totalPrice: number;
      }>
    ) {
      state.cartId = Number(action.payload.cartId);
      state.eventId = Number(action.payload.eventId);
      state.items = action.payload.items.map((item) => ({
        ...item,
        id: Number(item.id),
        itemId: Number(item.itemId)
      }));
      state.totalPrice = action.payload.totalPrice;
    },
    addItem(
      state,
      action: PayloadAction<{ id: string; itemId: string; quantity: number; totalPrice: string }>
    ) {
      state.items.push({
        ...action.payload,
        id: Number(action.payload.id),
        itemId: Number(action.payload.itemId),
        itemType: 'Ticket',
        totalPrice: Number(action.payload.totalPrice)
      });
      state.totalPrice += Number(action.payload.totalPrice);
    },
    updateItem(
      state,
      action: PayloadAction<{ purchaseItemId: string; quantity: number; totalPrice: number }>
    ) {
      const item = state.items.find((i) => i.id === Number(action.payload.purchaseItemId));
      let initialTotalPrice = 0;
      if (item) {
        initialTotalPrice = item.totalPrice;
        item.quantity = action.payload.quantity;
        item.totalPrice = action.payload.totalPrice;
      }
      state.totalPrice =
        parseFloat(state.totalPrice.toString()) -
        initialTotalPrice +
        parseFloat(action.payload.totalPrice.toString());
    },
    removeItem(state, action: PayloadAction<{ purchaseItemId: string }>) {
      state.items = state.items.filter((i) => i.id !== Number(action.payload.purchaseItemId));
      state.totalPrice = state.items.reduce((sum, i) => sum + i.totalPrice, 0);
    },
    clearCart(state) {
      state.cartId = null;
      state.eventId = null;
      state.items = [];
      state.totalPrice = 0;
    }
  }
});

export const { setCart, addItem, updateItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
