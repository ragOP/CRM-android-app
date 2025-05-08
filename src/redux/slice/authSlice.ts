import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export type Role = 'user' | 'salesperson' | 'dnd';


type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<{token: string; user: User}>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    logout(state) {
      state.token = null;
      state.user = null;
    },
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const {login, logout, setUser} = authSlice.actions;
export default authSlice.reducer;
