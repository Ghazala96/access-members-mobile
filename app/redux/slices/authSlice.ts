import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Role {
  id: string;
  name: string;
}

interface RoleTag {
  id: string;
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  roleTags: RoleTag[];
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; user: User }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
    }
  }
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
