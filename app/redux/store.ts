import { configureStore, createAction } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';

export const resetState = createAction('resetState');

const rootReducer = (state: any, action: any) => {
  if (action.type === resetState.type) {
    return undefined;
  }
  return {
    auth: authReducer(state?.auth, action),
    cart: cartReducer(state?.cart, action)
  };
};

const store = configureStore({
  reducer: rootReducer
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
